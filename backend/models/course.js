const mongoose = require('mongoose');

/**
 * Course Schema
 * @description Schéma pour les cours, incluant le titre, la description, l'enseignant, l'espace de cours, les étudiants, les sections, les commentaires et les avis.
 */
const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true // Le titre est requis
    },
    description: {
        type: String,
        required: true // La description est requise
    },
    imageUrl: {
        type: String, // Champ pour l'URL de l'image
        required: false // L'URL de l'image n'est pas requise, donc false
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher', // Référence au modèle Teacher
        required: true // L'enseignant est requis
    },
    courseSpace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CourseSpace' // Référence au modèle CourseSpace
    },
    students: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' // Référence au modèle User pour les apprenants inscrits
    }],
    sections: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic' // Référence au modèle Topic pour les sections du cours
    }],
    commentaires: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Commentaire' // Référence au modèle Commentaire
    }],
    avis: [{  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Avis' // Référence au modèle Avis
    }],
});

// Création du modèle Course à partir du schéma
const Course = mongoose.model('Course', courseSchema);

// Exportation du modèle Course
module.exports = Course;