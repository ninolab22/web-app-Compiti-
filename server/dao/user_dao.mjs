"use strict";

import sqlite from 'sqlite3';
import crypto from 'crypto';
import { User } from '../model/user.mjs';


const db = new sqlite.Database("./db/database.sqlite", (err) => {
    if (err) throw err;
  });




// get all the students
export const getAllStudents = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, name, surname,mail FROM User  WHERE role = 'student' `;
    db.all(sql, [], (err, rows) => {
      if (err)
        reject(err);
      else {
        const students = rows.map((s) => new User(s.id, s.name, s.surname, s.email,  s.role,""));
        resolve(students);
      }
    });
  });
}

// get a teacher by its id
export const getTeacherById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM user WHERE id = ? AND role = "teacher"';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({ error: "Teacher not available, check the inserted id." });
            } else {
                resolve(new User(row.id, row.name, row.surname, row.email, row.password, row.role));
            }
        });
    });
};

// check pair of student in a group
export const checkPairsInGroup = async (studentIds, teacherId) => {
    const pairs = [];
    //crea tutte le coppie di studenti nel gruppo 
    for(let i = 0; i<studentIds.length; i++){
        for(let j = i + 1; j < studentIds.length; j++){
            pairs.push([studentIds[i],studentIds[j]]);
        }
    }
    //seleziono le righe in cui uno studente delle coppia ha partecipato al compito 
    //solo per i compiti assegnati da questa professoressa
    const sql = 
        `SELECT
            COUNT(fk_user) as numStudents,
            sh.fk_homework 
        FROM student_homework sh
        JOIN homework h ON sh.fk_homework = h.id
        WHERE (sh.fk_user = ? OR sh.fk_user = ?)
        AND h.fk_iduser = ?
        GROUP BY sh.fk_homework
        HAVING COUNT(fk_user) >= 2`
    ;

    for (const [id1, id2] of pairs) {
        const rows = await new Promise((resolve, reject) => {
            db.all(sql, [id1, id2, teacherId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });

        if (rows.length >= 2) {
            return { isValid: false, error: "Invalid combination of students" };
        }
    }

    return { isValid: true };
};


//get user by username and password
export const getUserByUsernameAndPassword = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM user WHERE mail = ?';
    db.get(sql, [username], (err, row) => {
      if (err) return reject(err);
      if (!row) return resolve(null);

      // Verifica password con scrypt e salt 
      crypto.scrypt(password, row.salt, 16, (err, hashedPassword) => {
        if (err) return reject(err);
        const hashBuffer = Buffer.from(row.password, 'hex');
        if (crypto.timingSafeEqual(hashBuffer, hashedPassword)) {
          resolve(row); 
        } else {
          resolve(null); 
        }
      });
    });
  });
};

//getuser by id
export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM user WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};