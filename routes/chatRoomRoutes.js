const express = require('express');
const router = express.Router();
const chatRoomController = require('../controllers/chatRoomController');
const authenticate = require('../middleware/authenticate');

/**
 * @route POST /
 * @description Créer une nouvelle salle de chat.
 * @access Private
 */
router.post('/', authenticate, chatRoomController.createChatRoom);

/**
 * @route GET /:chatId/messages
 * @description Récupérer les messages d'une salle de chat spécifique.
 * @access Private
 */
router.get('/:chatId/messages', authenticate, chatRoomController.getMessagesForChat);

/**
 * @route GET /receiver/:receiverId
 * @description Récupérer les informations du destinataire.
 * @access Private
 */
router.get('/receiver/:receiverId', authenticate, chatRoomController.getReceiverInfo);

/**
 * @route GET /user/:userId
 * @description Trouver les salles de chat d'un utilisateur.
 * @access Private
 */
router.get('/user/:userId', authenticate, chatRoomController.findUserChats);

/**
 * @route GET /:firstId/:secondId
 * @description Trouver les salles de chat entre deux utilisateurs.
 * @access Private
 */
router.get('/:firstId/:secondId', authenticate, chatRoomController.findChats);

/**
 * @route GET /message/unread/count/:userId
 * @description Compter les messages non lus par utilisateur.
 * @access Private
 */
router.get('/message/unread/count/:userId', authenticate, chatRoomController.getUnreadMessagesCountByUser);

module.exports = router;