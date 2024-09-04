const Lesson = require('../models/lesson');
const Topic = require('../models/topic');
const fs = require('fs/promises');
const mongoose = require('mongoose');

/**
 * @async
 * @function createLesson
 * @description Crée une nouvelle leçon et l'associe à un sujet.
 * @param {Object} req - La requête HTTP.
 * @param {Object} req.params - Les paramètres de la requête.
 * @param {string} req.params.topicId - L'ID du sujet.
 * @param {Object} req.body - Le corps de la requête.
 * @param {string} req.body.name - Le nom de la leçon.
 * @param {string} req.body.content - Le contenu de la leçon.
 * @param {string} req.body.videoUrl - L'URL de la vidéo de la leçon.
 * @param {number} req.body.videoDuration - La durée de la vidéo de la leçon.
 * @param {string} req.body.transcription - La transcription de la vidéo de la leçon.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.createLesson = async (req, res) => {
    try {
        const { topicId } = req.params;
        const { name, content, videoUrl, videoDuration, transcription} = req.body;

        // Créer une nouvelle leçon avec la transcription combinée
        const newLesson = new Lesson({ 
            name, 
            content, 
            videoUrl, 
            videoDuration, 
            transcription 
        });

        // Enregistrer la nouvelle leçon dans la base de données
        await newLesson.save();

        // Associer la leçon au sujet
        const topic = await Topic.findById(topicId);
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }
        topic.lessons.push(newLesson._id);
        await topic.save();

        res.status(201).json({ message: 'Lesson created successfully', lesson: newLesson });
    } catch (error) {
        console.error('Error creating lesson:', error);
        res.status(500).json({ message: 'Error creating lesson' });
    }
};
  
/**
 * @async
 * @function updateLesson
 * @description Met à jour une leçon.
 * @param {Object} req - La requête HTTP.
 * @param {Object} req.params - Les paramètres de la requête.
 * @param {string} req.params.lessonId - L'ID de la leçon.
 * @param {Object} req.body - Le corps de la requête.
 * @param {string} req.body.name - Le nom de la leçon.
 * @param {string} req.body.content - Le contenu de la leçon.
 * @param {string} req.body.videoUrl - L'URL de la vidéo de la leçon.
 * @param {string} req.body.transcription - La transcription de la vidéo de la leçon.
 * @param {number} req.body.videoDuration - La durée de la vidéo de la leçon.
 * @param {Array<string>} req.body.exerciseUrls - Les URLs des fichiers d'exercices.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.updateLesson = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { name, content, videoUrl,transcription, videoDuration, exerciseUrls } = req.body;

        // Update the lesson with the new data
        const updatedLesson = await Lesson.findByIdAndUpdate(
            lessonId,
            { name, content, videoUrl,transcription, videoDuration, exerciseUrls },
            { new: true }
        );

        res.status(200).json(updatedLesson);
    } catch (error) {
        console.error('Error updating lesson:', error);
        res.status(500).json({ message: 'Error updating lesson' });
    }
};
/**
 * @async
 * @function deleteLesson
 * @description Supprime une leçon et la retire du sujet associé.
 * @param {Object} req - La requête HTTP.
 * @param {Object} req.params - Les paramètres de la requête.
 * @param {string} req.params.lessonId - L'ID de la leçon.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.deleteLesson = async (req, res) => {
    try {
        const { lessonId, topicId } = req.params;

        console.log('Attempting to delete lesson:', lessonId, 'from topic:', topicId);

        // Supprimer la leçon de la liste des leçons du topic
        const topicUpdateResult = await Topic.updateOne(
            { _id: topicId },
            { $pull: { lessons: lessonId } }
        );

        console.log('Topic update result:', topicUpdateResult);

        if (topicUpdateResult.modifiedCount === 0) {
            console.log('Topic not found or lesson not associated with this topic');
            return res.status(404).json({ message: 'Topic not found or lesson not associated with this topic' });
        }

        // Supprimer la leçon
        const deletedLesson = await Lesson.findByIdAndDelete(lessonId);

        if (!deletedLesson) {
            console.log('Lesson not found');
            return res.status(404).json({ message: 'Lesson not found' });
        }

        console.log('Lesson deleted successfully:', deletedLesson);

        res.status(200).json({
            acknowledged: true,
            insertedId: null,
            matchedCount: topicUpdateResult.matchedCount,
            modifiedCount: topicUpdateResult.modifiedCount,
            upsertedCount: 0
        });
    } catch (error) {
        console.error('Error deleting lesson:', error);
        res.status(500).json({ message: 'Error deleting lesson' });
    }
};


/**
 * @async
 * @function getLessonsByTopic
 * @description Récupère les leçons d'un sujet.
 * @param {Object} req - La requête HTTP.
 * @param {Object} req.params - Les paramètres de la requête.
 * @param {string} req.params.topicId - L'ID du sujet.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getLessonsByTopic = async (req, res) => {
    try {
        const { topicId } = req.params;

        // Récupérer le sujet avec les leçons associées
        const topic = await Topic.findById(topicId).populate('lessons');

        // Vérifier si le sujet existe
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        // Extraire les leçons du sujet
        const lessons = topic.lessons;

        res.status(200).json(lessons);
    } catch (error) {
        console.error('Error retrieving lessons by topic:', error);
        res.status(500).json({ message: 'Error retrieving lessons by topic' });
    }
};
/**
 * @async
 * @function getLessonById
 * @description Récupère une leçon par son ID.
 * @param {Object} req - La requête HTTP.
 * @param {Object} req.params - Les paramètres de la requête.
 * @param {string} req.params.lessonId - L'ID de la leçon.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getLessonById = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        res.status(200).json(lesson);
    } catch (error) {
        console.error('Error fetching lesson by ID:', error);
        res.status(500).json({ message: 'Error fetching lesson by ID' });
    }
};
/**
 * @async
 * @function lessonCompleted
 * @description Marque une leçon comme complétée pour un apprenant.
 * @param {Object} req - La requête HTTP.
 * @param {Object} req.body - Le corps de la requête.
 * @param {string} req.body.studentId - L'ID de l'apprenant.
 * @param {string} req.body.lessonId - L'ID de la leçon.
 * @param {number} req.body.watchedDuration - La durée de visionnage de la leçon.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.lessonCompleted = async (req, res) => {
    try {
        const { studentId, lessonId, watchedDuration } = req.body;

        // Call the function to update student progress
        await updateStudentProgress(studentId, lessonId, watchedDuration);

        res.status(200).json({ message: 'Student progress updated successfully' });
    } catch (error) {
        console.error('Error updating student progress:', error);
        res.status(500).json({ message: 'Error updating student progress' });
    }
};
/**
 * @async
 * @function updateStudentProgress
 * @description Met à jour la progression d'un apprenant pour une leçon.
 * @param {string} studentId - L'ID de l'apprenant.
 * @param {string} lessonId - L'ID de la leçon.
 * @param {number} watchedDuration - La durée de visionnage de la leçon.
 * @returns {Promise<void>}
 */
async function updateStudentProgress(studentId, lessonId, watchedDuration) {
    try {
        // Récupérer la leçon à partir de son ID
        const lesson = await Lesson.findById(lessonId);

        if (!lesson) {
            console.error('Lesson not found');
            return;
        }

        // Récupérer la durée totale de la vidéo de la leçon
        const totalVideoDuration = lesson.videoDuration;

        // Vérifier si l'apprenant a regardé toute la vidéo
        if (watchedDuration >= totalVideoDuration) {
            // Marquer la leçon comme terminée
            lesson.completed = true;
            await lesson.save();

            console.log('Lesson marked as completed for student:', studentId);
        } else {
            console.log('Student watched only a portion of the video');
        }

    } catch (error) {
        console.error('Error updating student progress:', error);
    }
}
