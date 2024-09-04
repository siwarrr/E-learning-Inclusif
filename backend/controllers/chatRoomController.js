const mongoose = require('mongoose');
const ChatRoom = require('../models/chatRoom');
const Course = require('../models/course');
const User = require('../models/user');
const Message = require('../models/message');

/**
 * @async
 * @function createChatRoom
 * @description Crée une nouvelle salle de chat entre deux utilisateurs.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.createChatRoom = async (req, res) => {
    const { firstId, secondId } = req.body;

    try {
        const existingChatRoom = await ChatRoom.findOne({ members: { $all: [firstId, secondId] } });

        if (existingChatRoom) {
            return res.status(200).json(existingChatRoom); // Utiliser la chatroom existante
        }

        const canOpenChatRoom = await checkChatRoomEligibility(firstId, secondId);

        if (canOpenChatRoom) {
            const newChatRoom = new ChatRoom({
                members: [firstId, secondId],
                messages: [] // Initialiser avec une liste vide de messages
            });
            const savedChatRoom = await newChatRoom.save();
            res.status(200).json(savedChatRoom);
        } else {
            res.status(403).json({ message: 'Users are not eligible to open a chat room' });
        }
    } catch (error) {
        console.error('Error creating chat room:', error);
        res.status(500).json({ message: 'Failed to create chat room' });
    }
};
/**
 * @async
 * @function checkChatRoomEligibility
 * @description Vérifie si deux utilisateurs sont éligibles pour ouvrir une salle de chat.
 * @param {String} firstId - ID du premier utilisateur.
 * @param {String} secondId - ID du deuxième utilisateur.
 * @returns {Promise<boolean>}
 */
async function checkChatRoomEligibility(firstId, secondId) {
    try {
        console.log('First user ID:', firstId);
        console.log('Second user ID:', secondId);

        if (!firstId || !secondId) {
            console.error('Invalid user ID');
            return false;
        }

        // Vérifier le rôle de chaque utilisateur
        const firstUser = await User.findById(firstId);
        const secondUser = await User.findById(secondId);

        // Vérifier si l'utilisateur est un enseignant
        if (firstUser.role === 'teacher') {
            // Si le premier utilisateur est un enseignant, vérifier si le deuxième utilisateur est inscrit à ses cours
            const coursesTaughtByTeacher = await Course.find({ teacher: firstId });
            const isStudentEnrolled = coursesTaughtByTeacher.some(course => course.students.includes(secondId));
            return isStudentEnrolled;
        } else if (secondUser.role === 'teacher') {
            // Si le deuxième utilisateur est un enseignant, vérifier si le premier utilisateur est inscrit à ses cours
            const coursesTaughtByTeacher = await Course.find({ teacher: secondId });
            const isStudentEnrolled = coursesTaughtByTeacher.some(course => course.students.includes(firstId));
            return isStudentEnrolled;
        } else {
            // Ni le premier ni le deuxième utilisateur n'est un enseignant, donc ils ne peuvent pas initier de chat
            return false;
        }
    } catch (error) {
        console.error('Error checking chat room eligibility:', error);
        return false;
    }
};
/**
 * @async
 * @function getMessagesForChat
 * @description Récupère les messages pour une salle de chat spécifiée.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getMessagesForChat = async (req, res) => {
    const { chatId } = req.params;
  
    try {
      // Use the Message model to find the messages associated with the chat
      const messages = await Message.find({ chatId });
  
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching messages for chat:', error);
      res.status(500).json({ message: 'Failed to fetch messages for chat' });
    }
  };
  /**
 * @async
 * @function getReceiverInfo
 * @description Récupère les informations sur le destinataire.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
  exports.getReceiverInfo = async (req, res) => {
    const receiverId = req.params.receiverId;

    try {
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found' });
        }
        res.status(200).json({ fullname: receiver.fullname });
    } catch (error) {
        console.error('Error getting receiver info:', error);
        res.status(500).json({ message: 'Failed to get receiver info' });
    }
};
/**
 * @async
 * @function findUserChats
 * @description Trouve toutes les salles de chat d'un utilisateur.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.findUserChats = async(req, res) => {
    const userId = req.params.userId;
    try {
        const chats = await ChatRoom.find({ members: { $in: [userId] } });
        if (!chats || chats.length === 0) {
            return res.status(404).json({ message: 'No chats found for this user' });
        }
        res.status(200).json(chats);
    } catch (error) {
        console.error('Error finding user chats:', error);
        res.status(500).json({ message: 'Failed to find user chats' });
    }
};
/**
 * @async
 * @function findChats
 * @description Trouve une salle de chat entre deux utilisateurs.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.findChats = async(req, res) => {
    const { firstId, secondId } = req.params;
    try {
        const chat = await ChatRoom.find({ members: { $all: [firstId, secondId] } });
        if (!chat || chat.length === 0) {
            return res.status(404).json({ message: 'No chat found between these users' });
        }
        res.status(200).json(chat);
    } catch (error) {
        console.error('Error finding chats:', error);
        res.status(500).json({ message: 'Failed to find chats' });
    }
};
/**
 * @async
 * @function getUnreadMessagesCountByUser
 * @description Récupère le nombre de messages non lus pour un utilisateur.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getUnreadMessagesCountByUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        // Trouver toutes les conversations impliquant l'utilisateur actuel
        const chatRooms = await ChatRoom.find({ members: { $in: [userId] } });

        // Compter les messages non lus pour chaque utilisateur dans chaque conversation
        const unreadMessagesCountByUser = {};
        for (const chatRoom of chatRooms) {
            const unreadMessages = await Message.find({ chatId: chatRoom._id, senderId: { $ne: userId }, read: false });
            for (const message of unreadMessages) {
                if (!unreadMessagesCountByUser[message.senderId]) {
                    unreadMessagesCountByUser[message.senderId] = 0;
                }
                unreadMessagesCountByUser[message.senderId]++;
            }
        }

        res.status(200).json(unreadMessagesCountByUser);
    } catch (error) {
        console.error('Error counting unread messages by user:', error);
        res.status(500).json({ message: 'Failed to count unread messages by user' });
    }
};



