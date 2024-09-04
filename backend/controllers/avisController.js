const Avis = require('../models/avis');
const Course = require('../models/course');

/**
 * @async
 * @function addAvisToCourse
 * @description Ajoute un avis à un cours.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.addAvisToCourse = async (req, res) => {
    try {
        const { stars, tooltip, courseId } = req.body;
        const userId = req.user.userId;

        console.log('Données reçues:', { stars, tooltip, courseId, userId });

        const newAvis = new Avis({
            stars,
            tooltip,
            user: userId,
            course: courseId
        });

        await newAvis.save();
        console.log('Nouvel avis sauvegardé:', newAvis);

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId, 
            { $push: { avis: newAvis._id } },
            { new: true }
        );

        if (!updatedCourse) {
            console.error('Cours non trouvé pour la mise à jour:', courseId);
            return res.status(404).json({ success: false, message: 'Cours non trouvé' });
        }

        console.log('Cours mis à jour:', updatedCourse);

        res.status(201).json({ success: true, message: 'Avis ajouté avec succès', avis: newAvis });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'avis :', error);
        res.status(500).json({ success: false, message: 'Erreur lors de l\'ajout de l\'avis' });
    }
};
/**
 * @async
 * @function getAvisForCourse
 * @description Récupère les avis d'un cours.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getAvisForCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        console.log('Récupération des avis pour le cours:', courseId);

        const course = await Course.findById(courseId).populate({
            path: 'avis',
            populate: {
                path: 'user',
                select: 'fullname'
            }
        });

        if (!course) {
            console.error('Cours non trouvé:', courseId);
            return res.status(404).json({ message: 'Cours non trouvé' });
        }

        const totalStars = course.avis.reduce((sum, avis) => sum + avis.stars, 0);
        const averageRating = (totalStars / course.avis.length).toFixed(2);

        console.log('Avis trouvés:', course.avis);
        console.log('Total des étoiles:', totalStars, 'Note moyenne:', averageRating);

        res.status(200).json({
            success: true,
            totalStars,
            averageRating,
            avis: course.avis
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des avis :', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des avis' });
    }
};
/**
 * @async
 * @function getStarRatings
 * @description Récupère les statistiques de vote par étoile pour un cours.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getStarRatings = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        console.log('Récupération des statistiques de vote pour le cours:', courseId);

        const course = await Course.findById(courseId).populate('avis');

        if (!course) {
            console.error('Cours non trouvé:', courseId);
            return res.status(404).json({ message: 'Cours non trouvé' });
        }

        const starVotes = [0, 0, 0, 0, 0];

        course.avis.forEach(avis => {
            // Incrémentez le nombre de votes pour le niveau d'étoiles correspondant dans starVotes
            starVotes[avis.stars - 1]++;
        });

        console.log('Statistiques de vote par étoile:', starVotes);

        res.status(200).json({ success: true, starVotes });
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques de vote par étoile:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des statistiques de vote par étoile' });
    }
};
