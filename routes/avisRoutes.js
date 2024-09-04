const express = require('express');
const router = express.Router();
const avisController = require('../controllers/avisController');
const authenticate = require('../middleware/authenticate');

/**
 * @route POST /:courseId
 * @description Ajouter un avis sur un cours.
 * @access Private
 */
router.post('/:courseId', authenticate, avisController.addAvisToCourse);

/**
 * @route GET /:courseId/reviews
 * @description Afficher les avis d'un cours.
 * @access Private
 */
router.get('/:courseId/reviews', authenticate, avisController.getAvisForCourse);

/**
 * @route GET /:courseId/star-ratings
 * @description Récupérer les statistiques de vote par étoile pour un cours.
 * @access Private
 */
router.get('/:courseId/star-ratings', authenticate, avisController.getStarRatings);

module.exports = router;