const Teacher = require('../models/Teacher');
const User = require('../models/user');
const Course = require('../models/course');
const Quiz = require('../models/quiz');
const CourseSpace = require('../models/courseSpace');

/**
 * Récupère tous les enseignants.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 */
exports.getAllTeachers = async(req, res)=>{
    try{
        const teachers = await Teacher.find();
        res.status(200).json({teachers});
    }catch(error){
        res.status(500).json({ message: error.message});    
    }
;}
/**
 * Récupère tous les quizzes créés par un enseignant donné.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 */
exports.getQuizsByTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const quizzes = await Quiz.find({ teacher: teacherId });
        res.status(200).json(quizzes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
/**
 * Récupère tous les étudiants inscrits aux cours d'un enseignant donné.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 */
exports.getEnrolledStudents = async (req, res) => {
    const teacherId = req.params.teacherId;
    try {
        // tous les cours enseignés par cet enseignant
        const coursesTaught = await Course.find({ teacher: teacherId });

        //extraire les apprenants inscrits à ces cours
        let enrolledStudents = [];

        for (const course of coursesTaught) {
            const students = await User.find({ _id: { $in: course.students }});
            enrolledStudents = enrolledStudents.concat(students);
        }

        //supprimer les doublons des apprenants
        enrolledStudents = [...new Set(enrolledStudents)];

        //envoyer liste des apprenants à l'enseignant
        res.status(200).json(enrolledStudents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error'});
    }
};