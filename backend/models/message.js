const mongoose = require("mongoose");

/**
 * Message Schema
 * @description Schéma pour les messages, incluant l'ID du chat, l'expéditeur, le destinataire, le texte, l'URL du message vocal, le statut de lecture et les timestamps.
 */
const messageSchema = new mongoose.Schema(
    {   
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ChatRoom' // Référence à la salle de chat associée
        },
        senderId: String, // ID de l'expéditeur du message
        receiverId: String, // ID du destinataire du message
        voiceMessageUrl: String, // URL du message vocal
        text: String, // Texte du message
        read: {
            type: Boolean, // Indicateur si le message a été lu
            default: false
        }
    },
    {
        timestamps: true, // Timestamps pour createdAt et updatedAt
    }
);

// Création du modèle Message à partir du schéma
const Message = mongoose.model("Message",messageSchema);

// Exportation du modèle Message
module.exports = Message;