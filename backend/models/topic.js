const mongoose = require('mongoose');

/**
 * Topic Schema
 * @description Schéma pour les sujets (topics), incluant le nom, la description, les leçons et les quiz associés.
 */
const topicSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true // Le nom du sujet est requis
    },
    description: {
        type: String
    },
    lessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson' //Référence au modèle Lesson
    }],
    quizzes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz' //Référence au modèle Quiz
    }]
});

// Création du modèle Topic à partir du schéma
const Topic = mongoose.model('Topic', topicSchema);

// Exportation du modèle Topic
module.exports = Topic;