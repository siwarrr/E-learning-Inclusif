const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * QuizScore Schema
 * @description Schéma pour les scores des quiz, incluant l'étudiant, le quiz, le score, la performance et l'état de complétion.
 */
const QuizScoreSchema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Référence au modéle User (apprenant)
        required: true
    },
    quizId: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz', // Référence au modéle Quiz
        required: true
    },
    score: {
        type: Number, // Score obtenu par l'apprenant
        required: true
    },
    performance: {
        type: String, // Performance de l'apprenant
        required: true
    },
    completed: {
        type: Boolean, // Indique si le quiz est terminé
        default: false 
    }
});

// Création du modèle QuizScore à partir du schéma
const QuizScore = mongoose.model('QuizScore', QuizScoreSchema);

// Exportation du modèle QuizScore
module.exports = QuizScore;
