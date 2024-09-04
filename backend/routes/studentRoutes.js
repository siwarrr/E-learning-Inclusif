const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authenticate = require('../middleware/authenticate');

router.get('/profil', authenticate, studentController.getProfil);

/**
 * @route GET /:studentId/teachers
 * @description Récupère la liste des enseignants dont l'étudiant est inscrit dans les cours.
 * @access Private
 */
router.get('/:studentId/teachers', authenticate, studentController.getListTeachers);

/**
 * @route GET /:studentId/courses
 * @description Récupère la liste des cours où l'étudiant est inscrit.
 * @access Private
 */
router.get('/:studentId/courses', authenticate, studentController.getEnrolledCourses);

module.exports = router;