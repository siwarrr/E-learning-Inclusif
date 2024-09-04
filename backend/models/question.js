const mongoose = require('mongoose');

/**
 * Question Schema
 * @description Schéma pour les questions de quiz, incluant la question, le type, les options et la réponse correcte.
 */
const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true // La question posée est requise 
    },
    type: {
        type: String,
        enum: ['true/false', 'single choice', 'multiple choice', 'short answer'],
        required: true
    },
    options: [{
        value: String, // Les options de réponse pour la question
        label: String
    }],
    correctAnswer: {
        type: mongoose.Schema.Types.Mixed, 
        required: true // La réponse correcte à la question est requise
    }
});

// Création du modèle Question à partir du schéma
const Question = mongoose.model('Question', questionSchema);

// Exportation du modèle Question
module.exports = Question;