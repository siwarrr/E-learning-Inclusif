const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authenticate = require('../middleware/authenticate');

/**
 * @route POST /:courseId/comments
 * @description Créer un commentaire sur un cours.
 * @access Private
 */
router.post('/:courseId/comments', authenticate, commentController.createComment);

/**
 * @route POST /:courseId/:commentId/reply
 * @description Répondre à un commentaire.
 * @access Private
 */
router.post('/:courseId/:commentId/reply', authenticate, commentController.replyToComment);

/**
 * @route POST /:commentId/reactions
 * @description Ajouter une réaction à un commentaire.
 * @access Private
 */
router.post('/:commentId/reactions', authenticate, commentController.addReactionToComment);

/**
 * @route GET /:courseId
 * @description Récupérer les commentaires d'un cours spécifique.
 * @access Private
 */
router.get('/:courseId', authenticate, commentController.getComments);

/**
 * @route GET /replies/:commentId
 * @description Récupérer les réponses à un commentaire spécifique.
 * @access Private
 */
router.get('/replies/:commentId', authenticate, commentController.getReplies);

/**
 * @route DELETE /:commentId
 * @description Supprimer un commentaire.
 * @access Private
 */
router.delete('/:commentId', authenticate, commentController.deleteComment);

module.exports = router;