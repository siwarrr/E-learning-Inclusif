const mongoose = require("mongoose");

/**
 * Comment Schema
 * @description Schéma pour les commentaires des cours, incluant le texte, l'auteur, les réponses, les réactions, la date de création, les likes et les dislikes.
 */
const commentSchema = new mongoose.Schema({
      writer: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' // Référence à l'utilisateur qui a écrit le commentaire
      },
      text: {
        type: String, // Le texte du commentaire
      },
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // Référence au cours associé au commentaire
        required: true
    },
      replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Commentaire' // Références aux réponses du commentaire
    }],
    reactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reaction' // Références aux réactions associées au commentaire
    }],
    createdAt: {
      type: Date, // Date de création du commentaire
      default: Date.now
    },
    likes: {
      type: Number, // Nombre de likes sur le commentaire
      default: 0
    },
    dislikes: {
      type: Number, // Nombre de dislikes sur le commentaire
      default: 0
    }
});

// Création du modèle Commentaire à partir du schéma
const commentaire = mongoose.model("Commentaire",commentSchema);

// Exportation du modèle Commentaire
module.exports = commentaire;