import { createHomework, gradeHomework } from '../dao/homework_dao.mjs';
import express from 'express';
import { check, validationResult } from 'express-validator';
import { checkPairsInGroup } from '../dao/user_dao.mjs';
import { Homework } from '../model/homework.mjs';
import { insertAnswer } from '../dao/homework_dao.mjs';
import { isLoggedIn } from '../middleware/auth.mjs';
import { getAllHomeworksOfATeacher } from '../dao/homework_dao.mjs';

const router = express.Router();

/* ROUTES */

// POST /api/homeworks
router.post('/homeworks', isLoggedIn,[

  check('question')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Question must contain at least one non-space character'),
  
 
  check('studentIds')
    .isArray({ min: 2, max: 6 })
    .withMessage('Student group must contain between 2 and 6 students'),
  
  
  check('studentIds.*')
    .isInt()
    .withMessage('Each student ID must be a positive integer')

], async (req, res) => {
  
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { question, studentIds } = req.body;
  const teacherId = req.user.id;

  
  const { isValid, error } = await checkPairsInGroup(studentIds,teacherId);

  if (!isValid) {
    return res.status(422).json({ error: error });
  }

  const homework = new Homework(null, question, "", "", "", teacherId);

  try {
    const homeworkId = await createHomework(homework, studentIds);
    return res.status(200).json({ id: homeworkId });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// GET /api/homeworks

router.get('/homeworks', isLoggedIn,   async (req, res) => {
  try {

    const teacherId = req.user.id; 
    const homeworks = await getAllHomeworksOfATeacher(teacherId);
    res.status(200).json(homeworks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// PATCH /api/homeworks/:id/score

router.patch('/homeworks/:id/score', isLoggedIn, [
  
  check('score')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Score must not be empty'),
  check('score')
    .toInt() 
    .isInt({ min: 0, max: 30 })
    .withMessage('Score must be an integer between 0 and 30')
  
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  
  const score = parseInt(req.body.score);

  try {
    const changes = await gradeHomework(req.params.id, score);

    if (changes === 0) {
      return res.status(404).json({ error: 'Homework not found or no answer provided' });
    }

    return res.status(200).end();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});



// PATCH /api/homeworks/<id>/answer
router.patch('/homeworks/:id/answer', isLoggedIn, [
  
  check('answer')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Answer must contain at least one non-space character')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const answer = req.body.answer;
    const changes = await insertAnswer(req.params.id, answer);

   
if (changes === 0) {
  return res.status(409).json({ error: 'Homework is already closed and cannot be modified.' });
}

    return res.status(200).end();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;