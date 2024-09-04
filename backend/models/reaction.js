const mongoose = require("mongoose");

/**
 * Reaction Schema
 * @description Schéma pour les réactions, incluant l'utilisateur, le commentaire associé et le type de la réaction.
 */
const reactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Référence à l'utilisateur qui a réagi
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Commentaire' // Référence au commentaire auquel la réaction est associée
    },
    type: {
        type: String, 
        enum: ['like', 'dislike', 'love', 'haha', 'wow', 'sad', 'angry'] // Type de la réaction
    }
});

// Création du modèle Reaction à partir du schéma
const Reaction = mongoose .model('Reaction', reactionSchema);

// Exportation du modèle Reaction
module.exports = Reaction;