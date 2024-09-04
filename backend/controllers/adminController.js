const Admin = require('../models/admin');
const User = require('../models/user');
const CourseSpace = require('../models/courseSpace')
const Course = require('../models/course');
const Reclamation = require('../models/reclamation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @async
 * @function signupAdmin
 * @description Inscrit un nouvel administrateur.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.signupAdmin = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        const Admin = new User({
            fullname,
            email,
            password: hashedPassword,
            role: 'admin', 
        });

         //Generate token
         const token = jwt.sign({ userId: Admin._id}, process.env.JWT_SECRET_KEY, {
         expiresIn: process.env.JWT_EXPIRE_TIME,
        });

        await Admin.save();
        res.status(201).json({ message: 'Admin registered successfully', user: Admin, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
/**
 * @async
 * @function loginAdmin
 * @description Connecte un administrateur existant.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Rechercher l'utilisateur dans la base de données
      const admin = await User.findOne({ email });
  
      // Vérifier si l'utilisateur existe
      if (!admin) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Vérifier si le mot de passe est correct
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Créer un token JWT avec l'ID de l'utilisateur et son rôle
      const token = jwt.sign({ userId: admin._id, fullName: admin.fullname, role: admin.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  
      // Envoyer le token et le rôle de l'utilisateur dans la réponse
      console.log('User Role:', admin.role); // Ajouter cette ligne pour afficher le rôle renvoyé
      res.status(200).json({ token, role: admin.role }); // Make sure user.role is set correctly
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
};
/**
 * @async
 * @function getListTeachers
 * @description Récupère la liste de tous les enseignants.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getListTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher' }).populate('user', 'fullname email');
        res.status(200).json(teachers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
/**
 * @async
 * @function getCoursesCountByTeacher
 * @description Récupère le nombre de cours créés par un enseignant.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getCoursesCountByTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;

        const count = await Course.countDocuments({ teacher: teacherId });

        res.status(200).json({ courseCount: count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
/**
 * @async
 * @function getListLearners
 * @description Récupère la liste de tous les apprenants.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getListLearners = async (req, res) => {
    try {
        const learners = await User.find({ role: 'student' }).populate('user', 'fullname email');
        res.status(200).json(learners);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
/**
 * @async
 * @function getLearnersCoursesCount
 * @description Récupère le nombre de cours suivis par chaque apprenant.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getLearnersCoursesCount = async (req, res) => {
    try {
        // Utiliser l'agrégation MongoDB pour compter le nombre de cours par étudiant
        const studentsCoursesCount = await User.aggregate([
            // Filtre les utilisateurs ayant le rôle "student"
            { $match: { role: 'student' } },
            // Effectue une jointure avec la collection Course pour récupérer les cours auxquels chaque étudiant est inscrit
            {
                $lookup: {
                    from: 'courses',
                    localField: '_id',
                    foreignField: 'students',
                    as: 'courses'
                }
            },
            // Projection pour obtenir uniquement l'ID de l'utilisateur et le nombre de cours
            {
                $project: {
                    _id: 1,
                    fullname: 1,
                    email: 1,
                    coursesCount: { $size: '$courses' }
                }
            }
        ]);

        res.status(200).json(studentsCoursesCount);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
/**
 * @async
 * @function deleteTeacher
 * @description Supprime un enseignant.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.deleteTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        await User.findByIdAndDelete(teacherId);
        res.status(204).json({ message: "Teacher supprimé!"})
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
/**
 * @async
 * @function deleteLearner
 * @description Supprime un apprenant.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.deleteLearner = async (req, res) => {
    try {
        const { studentId } = req.params;
        await User.findByIdAndDelete(studentId);
        res.status(204).json({ message: "Student supprimé!"})
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
/**
 * @async
 * @function deleteCourse
 * @description Supprime un cours.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        await Course.findByIdAndDelete(courseId);
        res.status(204).json({ message: "Cours supprimé!"})
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
/**
 * @async
 * @function getPlatformStatistics
 * @description Récupère les statistiques de la plateforme.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getPlatformStatistics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalTeachers = await User.countDocuments({ role: 'teacher' });
        const totalStudents = await User.countDocuments({ role: 'student' });

        let teacherPercentage = 0;
        let studentPercentage = 0;

        if (totalUsers > 0) {
            teacherPercentage = ((totalTeachers / totalUsers) * 100).toFixed(2);
            studentPercentage = (100 - teacherPercentage).toFixed(2);
        }

        res.status(200).json({
            totalUsers,
            totalTeachers,
            totalStudents,
            teacherPercentage,
            studentPercentage,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
/**
 * @async
 * @function getAllReclamations
 * @description Récupère toutes les réclamations.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getAllReclamations = async (req, res) => {
    try {
        const reclamations = await Reclamation.find().populate('user', 'handicapType');
        res.status(200).json(reclamations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
/**
 * @async
 * @function respondToReclamation
 * @description Répond à une réclamation spécifique.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.respondToReclamation = async (req, res) => {
    try {
        const { reclamationId } = req.params;
        const { response } = req.body;

        // Vérifier si la réclamation existe
        const reclamation = await Reclamation.findById(reclamationId);
        if (!reclamation) {
            return res.status(404).json({ message: 'Réclamation introuvable.' });
        }

        // Mettre à jour la réclamation avec la réponse
        reclamation.response = response;
        await reclamation.save();

        res.status(200).json({ message: 'Réponse envoyée avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

