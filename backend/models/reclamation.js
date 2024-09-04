const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Reclamation Schema
 * @description Schéma pour les réclamations, incluant l'utilisateur, le message, la date et la réponse.
 */
const reclamationSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Référence à l'utilisateur qui a fait la réclamation
        required: true
    },
    fullname: {
        type: String, // Nom complet de l'utilisateur
        required: true
    },
    message: {
        type: String, // Message de la réclamation
        required: true
    },
    date: {
        type: Date, // Date de la réclamation
        default: Date.now
    },
    response: {
        type: String // Réponse à la réclamation
    }
});

// Création du modèle Reclamation à partir du schéma
const reclamation = mongoose.model("Reclamation",reclamationSchema);

// Exportation du modèle Reclamation
module.exports = reclamation;