const Course = require('../models/course');
const CourseSpace = require('../models/courseSpace');
const User = require('../models/user');

/**
 * Effectue une recherche de cours, d'espaces de cours et d'utilisateurs en fonction des données fournies.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>} - Une promesse qui résout les résultats de la recherche.
 */
exports.searchCourses = async (req, res) => {
    const data = req.body.data; // Récupérez les données de la requête
    if (!data) {
        return res.status(400).json({ message: 'No query provided' });
    }

    try {
        // Recherche dans les cours par titre ou description
        const courseResults = await Course.find({
            $or: [
                { title: { $regex: data, $options: 'i' } },
                { description: { $regex: data, $options: 'i' } }
            ]
        });

        // Recherche dans les espaces de cours par titre ou description
        const courseSpaceResults = await CourseSpace.find({
            $or: [
                { title: { $regex: data, $options: 'i' } },
                { description: { $regex: data, $options: 'i' } }
            ]
        }).populate('courses');

        // Recherche dans les utilisateurs par nom
        const userResults = await User.find({ fullname: { $regex: data, $options: 'i' } });

        // Pour chaque utilisateur trouvé
        for (const user of userResults) {
            // Vérifier si l'utilisateur est un enseignant
            if (user.role === 'teacher') {
                // Récupérer les cours associés à cet enseignant
                const courses = await Course.find({ teacher: user._id });
                // Ajouter les cours récupérés à l'utilisateur
                user.coursesCreated = courses;
            }
        }

        res.status(200).json({ courseResults, courseSpaceResults, userResults });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

