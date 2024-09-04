const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authenticate = require('../middleware/authenticate');

/**
 * @route GET /popular
 * @description Récupérer les cours populaires.
 * @access Public
 */
router.get('/popular', courseController.getPopularCourses);

/*/**
 * @route POST /create
 * @description Créer un nouveau cours.
 * @access Private
 */
/*router.post('/create', authenticate, courseController.createCourse);*/

/**
 * @route PUT /:courseId/update
 * @description Mettre à jour un cours spécifique.
 * @access Private
 */
router.put('/:courseId/update', authenticate, courseController.updateCourse); 

/*/**
 * @route PUT /:courseId/update-sections
 * @description Mettre à jour les sections d'un cours.
 * @access Private
 */
/*router.put('/:courseId/update-sections', authenticate, courseController.saveSecondSection); */

/**
 * @route POST /submit-form
 * @description Soumettre le formulaire de création de cours.
 * @access Private
 */
router.post('/submit-form', authenticate, courseController.submitCourseForm); 

/**
 * @route GET /teacher/:id
 * @description Récupérer les cours d'un enseignant spécifique.
 * @access Private
 */
router.get('/teacher/:id', authenticate, courseController.getTeacherCourses);

/**
 * @route GET /
 * @description Récupérer tous les cours.
 * @access Private
 */
router.get('/', authenticate, courseController.getAllCourses);

/**
 * @route GET /:courseId
 * @description Récupérer un cours spécifique par ID.
 * @access Private
 */
router.get('/:courseId', authenticate, courseController.getCourseById);

/**
 * @route GET /:courseId
 * @description Récupérer l'enseignant d'un cours.
 * @access Private
 */
router.get('/courses/:courseId/teacher-name', courseController.getTeacherNameByCourseId);

/**
 * @route POST /:courseId/register
 * @description Inscrire un utilisateur à un cours spécifique.
 * @access Private
 */
router.post('/:courseId/register', authenticate, courseController.registerCourse);

/**
 * @route GET /:courseId/initialVideo
 * @description Récupérer la vidéo initiale d'un cours pour un utilisateur.
 * @access Private
 */
router.get('/:courseId/initialVideo', authenticate, courseController.getInitialVideo);

/**
 * @route GET /:courseId/students
 * @description Récupérer les étudiants inscrits à un cours spécifique.
 * @access Private
 */
router.get('/:courseId/students', authenticate, courseController.getEnrolledStudents);

/**
 * @route GET /:courseId/sections
 * @description Récupérer les sections d'un cours spécifique.
 * @access Private
 */
router.get('/:courseId/sections', authenticate, courseController.getCourseSections); 

/**
 * @route GET /:courseId/quizzes
 * @description Récupérer les scores des quiz pour un cours spécifique.
 * @access Private
 */
router.get('/:courseId/quizzes', authenticate, courseController.getQuizScoresForCourse);

/**
 * @route GET /quiz-scores/:courseId/:userId
 * @description Récupérer les scores des quiz d'un étudiant pour un cours spécifique.
 * @access Private
 */
router.get('/quiz-scores/:courseId/:userId', authenticate, courseController.getStudentQuizScores);

/**
 * @route GET /progress/:courseId/:userId
 * @description Récupérer la progression d'un étudiant pour un cours spécifique.
 * @access Private
 */
router.get('/progress/:courseId/:userId', authenticate, courseController.getStudentProgress);

/**
 * @route DELETE /courses/:courseId
 * @description Supprimer un cours spécifique.
 * @access Private
 */
router.delete('/courses/:courseId', authenticate, courseController.deleteCourse);

module.exports = router;
