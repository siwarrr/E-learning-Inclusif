const CourseSpace = require('../models/courseSpace');
const Course = require('../models/course');

/**
 * @async
 * @function getAllCourseSpaces
 * @description Récupère tous les espaces de cours.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getAllCourseSpaces = async (req, res) => {
    try {
        const courseSpaces = await CourseSpace.find();
        res.json(courseSpaces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
/**
 * @async
 * @function getAllCoursesInSpace
 * @description Récupère tous les cours dans un espace de cours spécifié.
 * @param {Object} req - La requête HTTP.
 * @param {Object} req.params - Les paramètres de la requête.
 * @param {string} req.params.spaceId - L'ID de l'espace de cours.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getAllCoursesInSpace = async (req, res) => {
    try {
        const spaceId = req.params.spaceId;

        // Recherchez les cours associés à l'espace de cours donné
        const courses = await Course.find({ courseSpace: spaceId }).populate('courseSpace'); // Utilisez populate pour remplacer l'ID de l'espace de cours par le document réel de l'espace de cours

        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: "Aucun cours trouvé dans cet espace." });
        }

        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
/**
 * @async
 * @function createCourseSpace
 * @description Crée un nouvel espace de cours.
 * @param {Object} req - La requête HTTP.
 * @param {Object} req.body - Le corps de la requête.
 * @param {string} req.body.title - Le titre de l'espace de cours.
 * @param {string} req.body.description - La description de l'espace de cours.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.createCourseSpace = async (req, res) => {
    const { title, description } = req.body; // Assurez-vous que les données sont correctement extraites du corps de la demande

    const courseSpace = new CourseSpace({
        title,
        description
    });

    try {
        const newCourseSpace = await courseSpace.save();
        res.status(201).json(newCourseSpace);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @async
 * @function getCourseSpaceById
 * @description Récupère un espace de cours par son ID.
 * @param {Object} req - La requête HTTP.
 * @param {Object} req.params - Les paramètres de la requête.
 * @param {string} req.params.id - L'ID de l'espace de cours.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getCourseSpaceById = async (req, res) => {
    try {
        const courseSpace = await CourseSpace.findById(req.params.id);
        if (!courseSpace) {
            return res.status(404).json({ message: "Espace de cours non trouvé" });
        }
        res.json(courseSpace);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @async
 * @function updateCourseSpace
 * @description Met à jour un espace de cours.
 * @param {Object} req - La requête HTTP.
 * @param {Object} req.params - Les paramètres de la requête.
 * @param {string} req.params.id - L'ID de l'espace de cours.
 * @param {Object} req.body - Le corps de la requête contenant les mises à jour.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.updateCourseSpace = async (req, res) => {
    try {
        const updatedCourseSpace = await CourseSpace.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCourseSpace);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @async
 * @function deleteCourseSpace
 * @description Supprime un espace de cours.
 * @param {Object} req - La requête HTTP.
 * @param {Object} req.params - Les paramètres de la requête.
 * @param {string} req.params.id - L'ID de l'espace de cours.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.deleteCourseSpace = async (req, res) => {
    try {
        await CourseSpace.findByIdAndDelete(req.params.id);
        res.json({ message: "Espace de cours supprimé" });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};
