const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const authenticate = require('../middleware/authenticate');


router.get('/', teacherController.getAllTeachers);
router.get('/:teacherId/quizs', teacherController.getQuizsByTeacher);

/**
 * @route GET /:teacherId/students
 * @description Récupère la liste des étudiants inscrits dans les cours de l'enseignant.
 * @access Private
 */
router.get('/:teacherId/students',authenticate, teacherController.getEnrolledStudents);

module.exports = router;