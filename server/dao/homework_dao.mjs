"use strict";

import sqlite from 'sqlite3';

import { Homework } from '../model/homework.mjs';

import { getAllStudents } from './user_dao.mjs';
const db = new sqlite.Database("./db/database.sqlite", (err) => {
    if (err) throw err;
  });



// create an association student-homework
const addStudentHomework = (studentId, homeworkId) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO student_homework(fk_user, fk_homework) VALUES (?, ?)';
        db.run(sql, [studentId, homeworkId], function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
};

// create a new homework
export const createHomework = (homework, studentsIds) => {
    return new Promise((resolve, reject) => {
        
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            const sql = 'INSERT INTO homework(question,state,fk_iduser) VALUES (?, ?, ?)';
            db.run(sql, [homework.question, "open", homework.fk_iduser], function (err) {
                if (err) {
                    db.run('ROLLBACK');
                    reject(err);
                } else {
                    const homeworkId = this.lastID;
                    Promise.all(studentsIds.map(studentId => addStudentHomework(studentId, homeworkId)))
                    .then(() => {
                        db.run('COMMIT');
                        resolve(homeworkId);
                    })
                    .catch(error => {
                        db.run('ROLLBACK');
                        reject(error);
                    });
                }
            });
        });
    });
};

export const getAllHomeworksOfATeacher = (teacherId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM homework WHERE fk_iduser = ?';
        db.all(sql, [teacherId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const homeworks = rows.map(row => new Homework(row.id, row.question, row.answer, row.state, row.score, row.fk_iduser));
                resolve(homeworks);
            }
        }
        );
    });
};

export const gradeHomework = (id, score) => {
    return new Promise((resolve, reject) => {
        
        const  sql = 'UPDATE homework SET score = ?, state = "closed" WHERE id = ? AND answer IS NOT NULL';

        
        db.run(sql, [score, id], function (err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
};

//return for the student the list of his open homeworks 
export const getStudentOpenHomeworks = (studentId) => {
    return new Promise((resolve, reject) => {
        const sql = `
           SELECT 
    h.*
    FROM 
    student_homework sh
JOIN 
    homework h ON sh.fk_homework = h.id
JOIN 
    user u ON h.fk_iduser = u.id
WHERE 
    sh.fk_user = ?
    AND h.state = 'open';`;

        db.all(sql, [studentId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const homeworks = rows.map(row => new Homework(row.id, row.question, row.answer, row.state, row.score, row.fk_iduser));
                resolve(homeworks);
            }
        });
    });
}




//get student closed homeworks if teacherId is null or undefined it returns all the closed homeworks of the student
//if teacherId is defined it returns only the closed homeworks of the student assigned to that
export const getStudentClosedHomeworks = (studentId, teacherId) => {
    return new Promise((resolve, reject) => {
        let sql = `
            SELECT 
                h.*
            FROM 
                student_homework sh
            JOIN 
                homework h ON sh.fk_homework = h.id
            WHERE 
                sh.fk_user = ?
                AND h.state = 'closed'`;
        const params = [studentId];

        if (teacherId !== null && teacherId !== undefined) {
            sql += ` AND h.fk_iduser = ?`;
            params.push(teacherId);
        }

        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const homeworks = rows.map(row => new Homework(row.id, row.question, row.answer, row.state, row.score, row.fk_iduser));
                resolve(homeworks);
            }
        });
    });
}

//insert an answer for a homework
export const insertAnswer = (id, answer) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE homework SET answer = ? WHERE id = ? AND state = "open"';
        db.run(sql, [answer, id], function (err) {
            if (err) reject(err);
            else resolve(this.changes); // this.changes sarà 0 se il compito non è più open
        });
    });
};

export const calculateWeightedAverageForHomeworks = (homeworks) => {
    return new Promise((resolve, reject) => {
        if (!homeworks || homeworks.length === 0) {
            resolve(0);
            return;
        }

        const homeworkIds = homeworks.map(hw => hw.id);
        const placeholders = homeworkIds.map(() => '?').join(',');

        const sql = `
            SELECT fk_homework, COUNT(fk_user) AS participants_count
            FROM student_homework
            WHERE fk_homework IN (${placeholders})
            GROUP BY fk_homework;
        `;

        db.all(sql, homeworkIds, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            // Mappa id homework -> numero partecipanti
            const participantsCounts = {};
            rows.forEach(row => {
                participantsCounts[row.fk_homework] = row.participants_count;
            });

            // Calcolo media pesata
            let weightedSum = 0;
            let totalWeight = 0;

            for (const hw of homeworks) {
                const count = participantsCounts[hw.id] || 1; // nel caso in cui per qualche motivo non si dovesse trovare l'id si mette 1 per non avere divisioni per 0 
                const weight = 1 / count;
                weightedSum += hw.score * weight;
                totalWeight += weight;
            }
            //Se la somma totale dei pesi è maggiore di zero (cioè ci sono dati validi), calcola la media pesata dividendo la somma pesata per la somma dei pesi.
            //Se non ci sono dati (totalWeight è zero), restituisce 0 per evitare errori.

            let weightedAverage = totalWeight > 0 ? weightedSum / totalWeight : 0;
            weightedAverage = Number(weightedAverage.toFixed(2));
            resolve(weightedAverage);
        });
    });
}





// count homeworks by state
export const countHomeworksByState = (studentId, state, teacherId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT COUNT(*) AS count
            FROM student_homework sh
            JOIN homework h ON sh.fk_homework = h.id
            WHERE sh.fk_user = ? AND h.state = ? AND h.fk_iduser = ?;
        `;
        db.get(sql, [studentId, state, teacherId], (err, row) => {
            if (err) reject(err);
            else resolve(row ? row.count : 0);
        });
    });
}

export const getAllStudentsStatisticsOfaTeacher = async (fakeTeacherId) => {
  const students = await getAllStudents();
    
  const stats = await Promise.all(students.map(async (student) => {
    const [openHomeworks, closedHomeworks] = await Promise.all([
      countHomeworksByState(student.id, 'open', fakeTeacherId),
      countHomeworksByState(student.id, 'closed', fakeTeacherId),
    ]);

    const closedHomeworkList = await getStudentClosedHomeworks(student.id, fakeTeacherId);
    const averageScore = await calculateWeightedAverageForHomeworks(closedHomeworkList);

    return {
      name: student.name,
      surname: student.surname,
      openHomeworks,
      closedHomeworks,
      averageScore: Number(averageScore.toFixed(2)),
    };
  }));
    return stats;
};