const mongoose = require('mongoose');

/**
 * CourseSpace Schema
 * @description Schéma pour les espaces de cours, incluant le titre, la description et les cours associés.
 */
const courseSpaceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // Le titre est requis
    },
    description: {
        type: String,
        required: true, // La description est requise
    },
    courses: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course' // Référence au modèle Course
    }]
});

// Création du modèle CourseSpace à partir du schéma
const CourseSpace = mongoose.model('CourseSpace', courseSpaceSchema);

// Exportation du modèle CourseSpace
module.exports = CourseSpace;
