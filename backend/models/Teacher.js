const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

/**
 * Teacher Schema
 * @description Schéma pour les enseignants, qui hérite du schéma utilisateur.
 */
const TeacherSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Référence au modèle User
        required: true // L'utilisateur associé est requis
    },
    courseSpaces: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CourseSpace' // Référence au modèle CourseSpace
    }],
    coursesCreated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course' // Référence au modèle Course
    }],
    quizzesCreated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz' // Référence au modèle Quiz
    }]
});

// Enregistrement du modèle Teacher dans la base de données
const Teacher = User.discriminator('Teacher', TeacherSchema);

// Export du modèle Teacher
module.exports = Teacher;