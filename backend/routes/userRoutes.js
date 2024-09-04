const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');

/**
 * @route GET /
 * @description Récupère tous les utilisateurs.
 * @access Public
 */
router.get('/', userController.getAllUsers);

/**
 * @route POST /registerStudent
 * @description Inscrit un nouvel étudiant.
 * @access Public
 */
router.post('/registerStudent', userController.registerStudent);

/**
 * @route POST /registerTeacher
 * @description Inscrit un nouvel enseignant.
 * @access Public
 */
router.post('/registerTeacher', userController.registerTeacher);

/**
 * @route POST /login
 * @description Connecte un utilisateur.
 * @access Public
 */
router.post('/login', userController.login);

/**
 * @route GET /logout
 * @description Déconnecte un utilisateur.
 * @access Private
 */
router.get('/logout', authenticate, userController.logout);

/**
 * @route POST /forgotPassword
 * @description Envoie un email pour réinitialiser le mot de passe.
 * @access Public
 */
router.post('/forgotPassword', userController.forgotPassword);

/**
 * @route POST /reset/:token
 * @description Réinitialise le mot de passe avec le token fourni.
 * @access Public
 */
router.post('/reset/:token', userController.resetPassword);

/**
 * @route GET /:userId
 * @description Récupère les informations d'un utilisateur par son ID.
 * @access Private
 */
router.get('/:userId', authenticate, userController.getUserById);

router.put('/:userId', userController.updateUser);
router.delete('/:userId', userController.deleteUser);

/**
 * @route POST /:courseId/:lessonId/watch
 * @description Marque une vidéo comme regardée par un utilisateur.
 * @access Private
 */
router.post('/:courseId/:lessonId/watch', authenticate, userController.watchVideo);

/**
 * @route POST /:userId/reclam
 * @description Envoie une réclamation pour un utilisateur.
 * @access Private
 */
router.post('/:userId/reclam', authenticate, userController.sendReclamation);

/**
 * @route GET /current
 * @description Récupère les informations de l'utilisateur actuel.
 * @access Public
 */
router.route('/current')
  .get(userController.getCurrentUser)
  .post(userController.getCurrentUser);

module.exports = router;
