const mongoose = require("mongoose");

/**
 * ChatRoom Schema
 * @description Schéma pour les salles de chat, incluant les membres, les messages et les timestamps.
 */
const chatRoomSchema = new mongoose.Schema(
    {
        members: Array, // Liste des membres de la salle de chat
        messages: [{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message' // Références aux messages associés à la salle de chat
         }] 
    },
    {
        timestamps: true, // Timestamps pour createdAt et updatedAt
    }
);

// Création du modèle ChatRoom à partir du schéma
const ChatRoom = mongoose.model("ChatRoom",chatRoomSchema);

// Exportation du modèle ChatRoom
module.exports = ChatRoom;