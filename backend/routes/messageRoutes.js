const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authenticate = require('../middleware/authenticate');

/**
 * @route POST /
 * @description Créer un nouveau message.
 * @access Private
 */
router.post('/', authenticate, messageController.createMessage);

/**
 * @route POST /upload
 * @description Télécharger et créer un nouveau message vocal.
 * @access Private
 */
router.post('/upload', authenticate, messageController.upload.single('audio'), messageController.uploadVoiceMessage);

/**
 * @route GET /:chatId
 * @description Récupérer tous les messages pour un chat spécifique.
 * @access Private
 */
router.get('/:chatId',authenticate, messageController.getMessages);

/**
 * @route POST /markMessagesAsRead
 * @description Marquer les messages comme lus pour un utilisateur spécifique.
 * @access Private
 */
router.post('/markMessagesAsRead', authenticate, messageController.markMessagesAsRead);

module.exports = router;