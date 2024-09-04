const ChatRoom = require('../models/chatRoom');
const Message = require('../models/message');
const mongoose = require('mongoose');
const multer = require('multer');
const { transcribeAudio } = require('../controllers/chatbotVoiceMssg');

// Configuration de Multer pour stocker les fichiers audio dans le dossier 'uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });
  
  exports.upload = upload;
  
  /**
 * @async
 * @function createMessage
 * @description Crée un nouveau message dans une salle de chat.
 * @param {Object} req - La requête HTTP.
 * @param {Object} req.body - Le corps de la requête.
 * @param {string} req.body.chatId - L'ID de la salle de chat.
 * @param {string} req.body.senderId - L'ID de l'expéditeur du message.
 * @param {string} req.body.text - Le texte du message.
 * @param {string} req.body.voiceMessageUrl - L'URL du message vocal.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
  exports.createMessage = async (req, res) => {
    const { chatId, senderId, text, voiceMessageUrl } = req.body;
  
    const newMessage = new Message({
      chatId,
      senderId,
      text,
      voiceMessageUrl,
      read: false
    });
  
    try {
      const savedMessage = await newMessage.save();
  
      const chatroom = await ChatRoom.findById(chatId);
      chatroom.messages.push(savedMessage);
      await chatroom.save();

      const io = req.app.get('io');
      io.to(chatId).emit('message', savedMessage);

      console.log('Message émis via WebSocket:', savedMessage);
  
      res.status(200).json(savedMessage);
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ message: 'Failed to create message' });
    }
};
/**
 * @async
 * @function getMessages
 * @description Récupère tous les messages pour une salle de chat donnée.
 * @param {Object} req - La requête HTTP.
 * @param {Object} req.params - Les paramètres de la requête.
 * @param {string} req.params.chatId - L'ID de la salle de chat.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */  
exports.getMessages = async (req, res) => {
    const { chatId } = req.params;
  
    try {
      // Utilisez le modèle de message pour trouver les messages associés à la conversation
      const messages = await Message.find({ chatId });
  
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching messages for chat:', error);
      res.status(500).json({ message: 'Failed to fetch messages for chat' });
    }
};
/**
 * @async
 * @function uploadVoiceMessage
 * @description Télécharge un message vocal et l'ajoute à la salle de chat.
 * @param {Object} req - La requête HTTP.
 * @param {Object} req.body - Le corps de la requête.
 * @param {string} req.body.chatId - L'ID de la salle de chat.
 * @param {string} req.body.senderId - L'ID de l'expéditeur du message.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */  
exports.uploadVoiceMessage = async (req, res) => {
  try {
    const { chatId, senderId } = req.body;
    const voiceMessageUrl = `/uploads/${req.file.filename}`;
      
    const newMessage = new Message({
      chatId,
      senderId,
      voiceMessageUrl,
      read: false
    });

    const savedMessage = await newMessage.save();

    const chatroom = await ChatRoom.findById(chatId);
    chatroom.messages.push(savedMessage);
    await chatroom.save();

    const io = req.app.get('io');
    io.to(chatId).emit('voiceMessage', savedMessage);

    console.log('Message vocal émis via WebSocket:', savedMessage);

    res.status(200).json(savedMessage);
  } catch (error) {
    console.error('Error uploading voice message:', error);
    res.status(500).json({ message: 'Failed to upload voice message' });
  }
};
/**
 * @async
 * @function markMessagesAsRead
 * @description Marque les messages comme lus pour un utilisateur donné dans une salle de chat.
 * @param {Object} req - La requête HTTP.
 * @param {Object} req.body - Le corps de la requête.
 * @param {string} req.body.chatId - L'ID de la salle de chat.
 * @param {string} req.body.userId - L'ID de l'utilisateur.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.markMessagesAsRead = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
      // Récupérer tous les messages du chat
      const messages = await Message.find({ chatId });
      console.log('Messages found:', messages);

      // Filtrer les messages non lus où l'utilisateur actuel est le destinataire
      const userMessages = messages.filter(message => message.senderId !== userId && !message.read);
      console.log('User messages found:', userMessages);

      if (userMessages.length === 0) {
          return res.status(200).json({ message: 'No unread messages found', result: { matchedCount: 0, modifiedCount: 0 } });
      }

      // Mettre à jour les messages comme lus
      const result = await Message.updateMany(
          { _id: { $in: userMessages.map(msg => msg._id) } },
          { $set: { read: true } }
      );

      res.status(200).json({ message: 'Messages marked as read', result });
  } catch (error) {
      console.error('Error marking messages as read:', error);
      res.status(500).json({ message: 'Failed to mark messages as read' });
  }
};
