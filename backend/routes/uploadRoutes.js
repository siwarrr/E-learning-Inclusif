const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// Route pour télécharger le fichier vidéo de la leçon
router.post('/:courseId/sections/video', uploadController.uploadLessonVideo);

// Route pour télécharger les fichiers d'exercices de la leçon
router.post('/:courseId/sections/exercises', uploadController.uploadLessonExercises);

module.exports = router;
