const mongoose = require("mongoose");

/**
 * Avis Schema
 * @description Schéma pour les avis des utilisateurs, incluant le nombre d'étoiles, une description et une référence à l'utilisateur.
 */
const avisSchema = new mongoose.Schema({
    stars: {
        type: Number, // Évaluation en étoiles (1 à 5)
        enum: [1, 2, 3, 4, 5],
        required: true
    },
    tooltip: {
        type: String, // Évaluation descriptive
        enum: ['terrible', 'bad', 'normal', 'good', 'wonderful'],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Référence à l'utilisateur qui a donné l'avis
        required: true
    }
});

// Création du modèle Avis à partir du schéma
const Avis = mongoose.model("Avis", avisSchema);

// Exportation du modèle Avis
module.exports = Avis;
