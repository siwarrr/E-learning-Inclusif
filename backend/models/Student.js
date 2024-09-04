const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

/**
 * Student Schema
 * @description Schéma pour les étudiants, qui hérite du schéma utilisateur.
 */
const StudentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Référence au modèle User
        required: true // L'utilisateur associé est requis
    },
    handicapType: {
        type: String,
        enum: ['aucun', 'visuel', 'auditif'], // Types de handicap autorisés
        required: function () {
            return this.user.role === 'student'; // L'handicap est requis uniquement pour les étudiants
        }
    },
    score: {
        type: Number,
        default: 0 // Score par défaut est 0
    },
    progress: {
        type: Number,
        default: 0 // Progression par défaut est 0, 100 signifie que tous les sujets sont terminés
    }
});

// Enregistrement du modèle Student dans la base de données
const Student = User.discriminator('Student', StudentSchema);

// Export du modèle Student
module.exports = Student;
