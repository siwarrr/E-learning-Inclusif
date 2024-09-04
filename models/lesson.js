const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Lesson Schema
 * @description Schéma pour les leçons, incluant le nom, le contenu, les URL des vidéos et des exercices, etc.
 */
const lessonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // Le nom de la leçon est requis
    },
    content: {
        type: String,
        required: true // la description de la leçon est requise
    },
    videoUrl: {
        type: String, 
    },
    transcription: {
        type: String,
    },
    exerciseUrls: [{
        type: String, 
    }],
    watchedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User' //Référence au modèle User
    }],
    videoDuration: {
        type: Number, // Durée de la vidéo en secondes
        default: 0 // Valeur par défaut, peut être mise à jour ultérieurement
    }
});
// Création du modèle Lesson à partir du schéma
const Lesson = mongoose.model('Lesson', lessonSchema);

// Exportation du modèle Lesson
module.exports = Lesson;
