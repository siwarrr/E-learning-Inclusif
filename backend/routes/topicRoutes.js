const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
const authenticate = require('../middleware/authenticate');

/**
 * @route POST /:courseId
 * @description Crée un nouveau sujet dans un cours.
 * @access Private
 */
router.post('/:courseId', authenticate, topicController.createTopic);

/**
 * @route POST /:courseId/:topicId
 * @description Met à jour un sujet existant dans un cours.
 * @access Private
 */
router.post('/:courseId/:topicId', authenticate, topicController.updateTopic);

/**
 * @route GET /:courseId/:topicId
 * @description Récupère un sujet par son ID dans un cours.
 * @access Private
 */
router.get('/:courseId/:topicId', authenticate, topicController.getTopicById);

/**
 * @route GET /:courseId/:topicId/lessons
 * @description Récupère les leçons d'un sujet par son ID dans un cours.
 * @access Private
 */
router.get('/:courseId/:topicId/lessons', authenticate, topicController.getLessonsByTopicId); 

/**
 * @route GET /:courseId/:topicId/quizzes
 * @description Récupère les quiz d'un sujet par son ID dans un cours.
 * @access Private
 */
router.get('/:courseId/:topicId/quizzes', authenticate, topicController.getQuizzesByTopicId); 

/**
 * @route DELETE /:topicId
 * @description Supprimer un sujet spécifique.
 * @access Private
 */
router.delete('/:topicId', authenticate, topicController.deleteTopic);

module.exports = router;