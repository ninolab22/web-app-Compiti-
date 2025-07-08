import express from 'express';
import { check, validationResult } from 'express-validator';
import { getAllStudents } from '../dao/user_dao.mjs';
import { getAllStudentsStatisticsOfaTeacher } from '../dao/homework_dao.mjs';
import { getStudentOpenHomeworks, getStudentClosedHomeworks, calculateWeightedAverageForHomeworks } from '../dao/homework_dao.mjs';
import { getTeacherById } from '../dao/user_dao.mjs';
import { isLoggedIn } from '../middleware/auth.mjs';

const router = express.Router();

// GET /api/students 
router.get('/students', isLoggedIn, async (req, res) => {
  try {
    const students = await getAllStudents();

  
    const publicStudents = students.map(s => ({
      id: s.id,
      name: s.name,
      surname: s.surname,
      email: s.email
    }));

    res.status(200).json(publicStudents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/students/stats 
router.get('/students/stats', isLoggedIn, async (req, res) => {
  try {
    const teacherId = req.user.id;
    const stats = await getAllStudentsStatisticsOfaTeacher(teacherId);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/students/<id>/homeworks 
router.get('/students/:id/homeworks', isLoggedIn, [
  check('id')
    .isInt({ min: 1 })
    .withMessage('Student ID must be a positive integer')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const studentId = req.params.id;
    const homeworks = await getStudentOpenHomeworks(studentId);
    
    const homework_teacher = await Promise.all(homeworks.map(async (hw) => {
    const teacher = await getTeacherById(hw.fk_iduser);
      return {
        id: hw.id,
        question: hw.question,
        answer: hw.answer,
        nameTeacher: teacher.name,
        surnameTeacher: teacher.surname,
      };
    }));

    res.status(200).json(homework_teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/students/<id>/stats 
router.get('/students/:id/stats', isLoggedIn, [
  
  check('id')
    .isInt({ min: 1 })
    .withMessage('Student ID must be a positive integer')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const studentId = req.params.id;
    const homeworks = await getStudentClosedHomeworks(studentId, null);
    const weightedAverage = await calculateWeightedAverageForHomeworks(homeworks);

    const simplifiedHomeworks = homeworks.map(hw => ({
      question: hw.question,
      answer: hw.answer,
      score: hw.score
    }));

    res.status(200).json({
      closed_homeworks: simplifiedHomeworks,
      average: weightedAverage
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;