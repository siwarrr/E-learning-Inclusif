const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const authenticate = require('../middleware/authenticate');

/**
 * @route POST /:topicId/lessons
 * @description Créer une nouvelle leçon pour un sujet spécifique.
 * @access Private
 */
router.post('/:topicId/lessons', authenticate, lessonController.createLesson);

/**
 * @route POST /:topicId/:lessonId
 * @description Mettre à jour une leçon spécifique.
 * @access Private
 */
router.post('/:topicId/:lessonId', authenticate, lessonController.updateLesson);

/**
 * @route DELETE /:lessonId
 * @description Supprimer une leçon spécifique.
 * @access Private
 */
router.delete('/:topicId/:lessonId', authenticate, lessonController.deleteLesson);

/**
 * @route GET /:topicId
 * @description Récupérer toutes les leçons pour un sujet spécifique.
 * @access Private
 */
router.get('/:topicId', authenticate, lessonController.getLessonsByTopic);

/**
 * @route GET /:topicId/:lessonId
 * @description Récupérer une leçon spécifique par ID.
 * @access Private
 */
router.get('/:topicId/:lessonId', authenticate, lessonController.getLessonById);

/**
 * @route PUT /completed
 * @description Marquer une leçon comme terminée pour un étudiant.
 * @access Private
 */
router.put('/completed', authenticate, lessonController.lessonCompleted);

module.exports = router;