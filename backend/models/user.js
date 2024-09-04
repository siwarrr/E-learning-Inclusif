const mongoose = require('mongoose');
const Course = require('../models/course');
const Lesson = require('../models/lesson');
const Schema = mongoose.Schema;

/**
 * User Schema
 * @description Schema de l'utilisateur contenant les informations de base et les relations avec les cours et les leçons.
 */
const UserSchema = new Schema({
    fullname: {
        type: String,
        required: true// Le nom complet est requis
    },
    email: {
        type: String,
        required: true,
        unique: true // L'e-mail doit être unique
    },
    password: {
        type: String,
        required: true// Le mot de passe est requis
    },
    role: {
        type: String,
        enum: ['teacher', 'student', 'admin'], // Les rôles autorisés
        required: true // L'utilisateur doit choisir un rôle
    },
    handicapType: {
        type: String 
    },
    watchedVideos: [{
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course' // Référence à un cours
        },
        lessonId: {
            type: Schema.Types.ObjectId,
            ref: 'Lesson' // Référence à une leçon
        }
    }],
    resetPasswordToken: String, // Token de réinitialisation de mot de passe
    resetPasswordExpires: Date // Date d'expiration du token de réinitialisation
});

// Hook avant sauvegarde pour exclure watchedVideos pour les utilisateurs avec le rôle "admin"
UserSchema.pre('save', function(next) {
    if (this.role === 'admin') {
        this.watchedVideos = undefined; // Supprimer watchedVideos si l'utilisateur est admin
    }
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;