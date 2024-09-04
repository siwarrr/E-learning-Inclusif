const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const adminAccess = require('../middleware/adminAccess');
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const teacherController = require('../controllers/teacherController');

/**
 * @route POST /signup
 * @description Inscription d'un nouvel admin.
 * @access Public
 */
router.post('/signup', adminController.signupAdmin);

/**
 * @route POST /login
 * @description Connexion d'un admin.
 * @access Public
 */
router.post('/login', adminController.loginAdmin);

router.use(authenticate);

/**
 * @route GET /users
 * @description Récupérer tous les utilisateurs.
 * @access Private (Admin only)
 */
router.get('/users',adminAccess, userController.getAllUsers);
router.get('/users/:userId', userController.getUserById);
router.put('/users/:userId', userController.updateUser);
router.delete('/users/:userId', userController.deleteUser);

/**
 * @route GET /teachers
 * @description Récupérer la liste des enseignants.
 * @access Private (Admin only)
 */
router.get('/teachers', adminAccess, adminController.getListTeachers);

/**
 * @route GET /teachers/:teacherId/courses
 * @description Récupérer le nombre de cours d'un enseignant.
 * @access Private (Admin only)
 */
router.get('/teachers/:teacherId/courses', adminAccess, adminController.getCoursesCountByTeacher);

/**
 * @route GET /learners
 * @description Récupérer la liste des apprenants.
 * @access Private (Admin only)
 */
router.get('/learners', adminAccess, adminController.getListLearners);

/**
 * @route GET /learners/courses
 * @description Récupérer le nombre de cours par apprenant.
 * @access Private (Admin only)
 */
router.get('/learners/courses', adminAccess, adminController.getLearnersCoursesCount);

/**
 * @route DELETE /teachers/:teacherId
 * @description Supprimer un enseignant par ID.
 * @access Private (Admin only)
 */
router.delete('/teachers/:teacherId', adminAccess, adminController.deleteTeacher);

/**
 * @route DELETE /learners/:learnerId
 * @description Supprimer un apprenant par ID.
 * @access Private (Admin only)
 */
router.delete('/learners/:learnerId', adminAccess, adminController.deleteLearner);

/**
 * @route DELETE /courses/:courseId
 * @description Supprimer un cours par ID.
 * @access Private (Admin only)
 */
router.delete('/courses/:courseId', adminAccess, adminController.deleteCourse);

/**
 * @route GET /statistics
 * @description Récupérer les statistiques de la plateforme.
 * @access Private (Admin only)
 */
router.get('/statistics', adminAccess, adminController.getPlatformStatistics);

/**
 * @route GET /reclamations
 * @description Récupérer toutes les réclamations.
 * @access Private (Admin only)
 */
router.get('/reclamations', adminAccess, adminController.getAllReclamations);

/**
 * @route POST /reclamations/:reclamationId/respond
 * @description Répondre à une réclamation.
 * @access Private (Admin only)
 */
router.post('/reclamations/:reclamationId/respond', adminAccess, adminController.respondToReclamation);

module.exports = router;