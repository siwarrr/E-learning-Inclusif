const Topic = require('../models/topic');
const Course = require('../models/course');
const Lesson = require('../models/lesson');
const Quiz = require('../models/quiz');
const Question = require('../models/question');
const mongoose = require('mongoose');

/**
 * Crée un nouveau sujet et l'associe à un cours.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 */
exports.createTopic = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { name, summary, lessons, quizzes } = req.body;
        console.log('Received data:', { name, summary, lessons, quizzes }); // Ajoutez cette ligne pour vérifier les données reçues

        // Vérifier si le cours existe
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Créer un nouveau sujet
        const newTopic = new Topic({
            name,
            summary
        });

        // Sauvegarder le nouveau sujet dans la base de données
        await newTopic.save();

        // Associer les leçons au sujet (topic) et les sauvegarder dans la base de données
        if (lessons && lessons.length > 0) {
            const lessonIds = await Lesson.insertMany(lessons);
            newTopic.lessons = lessonIds.map(lesson => lesson._id);
            Topic.lessons.push(lessons._id);
            await Topic.save();
        }

        // Associer les quiz au sujet (topic) et les sauvegarder dans la base de données
        if (quizzes && quizzes.length > 0) {
            const quizIds = await Quiz.insertMany(quizzes);
            newTopic.quizzes = quizIds.map(quiz => quiz._id);
            Topic.quizzes.push(quizzes._id);
            await Topic.save();
        }

        // Sauvegarder le sujet mis à jour avec les leçons et les quiz associés
        await newTopic.save();

        // Ajouter le nouveau sujet à la liste des sections du cours
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $push: { sections: newTopic._id } },
            { new: true }
        );

        res.status(201).json({ newTopic, updatedCourse });
    } catch (error) {
        console.error('Error creating topic:', error);
        res.status(500).json({ message: 'Error creating topic' });
    }
};
/**
 * Récupère un sujet par son ID.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 */
exports.getTopicById = async (req, res) => {
    try {
        const { topicId } = req.params;
        const topic = await Topic.findById(topicId);
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }
        res.status(200).json(topic);
    } catch (error) {
        console.error('Error fetching topic by ID:', error);
        res.status(500).json({ message: 'Error fetching topic by ID' });
    }
};
/**
 * Récupère les leçons associées à un sujet par l'ID du sujet.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 */
exports.getLessonsByTopicId = async (req, res) => {
    try {
        const { topicId } = req.params;

        // Trouver le sujet (topic) par son ID
        const topic = await Topic.findById(topicId);

        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        // Récupérer les IDs des leçons associées au sujet
        const lessonIds = topic.lessons;

        // Trouver les leçons par leurs IDs
        const lessons = await Lesson.find({ _id: { $in: lessonIds } });

        // Retourner la liste des leçons
        res.status(200).json(lessons);
    } catch (error) {
        console.error('Error fetching lessons by topic ID:', error);
        res.status(500).json({ message: 'Error fetching lessons by topic ID' });
    }
};
/**
 * Récupère les quizzes associés à un sujet par l'ID du sujet.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 */
exports.getQuizzesByTopicId = async (req, res) => {
    try {
        const { topicId } = req.params;

        // Trouver le sujet (topic) par son ID
        const topic = await Topic.findById(topicId);

        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        // Récupérer les IDs des quizzes associés au sujet
        const quizIds = topic.quizzes;

        // Trouver les quizzes par leurs IDs
        const quizzes = await Quiz.find({ _id: { $in: quizIds } });

        // Retourner la liste des quizzes
        res.status(200).json(quizzes);
    } catch (error) {
        console.error('Error fetching quizzes by topic ID:', error);
        res.status(500).json({ message: 'Error fetching quizzes by topic ID' });
    }
};
/**
 * Met à jour un sujet par son ID.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 */
exports.updateTopic = async (req, res) => {
    try {
        const { topicId } = req.params;
        const { name, summary } = req.body;

        // Update the topic with the new data
        const updatedTopic = await Topic.findByIdAndUpdate(
            topicId,
            { name, summary },
            { new: true }
        );

        res.status(200).json(updatedTopic);
    } catch (error) {
        console.error('Error updating topic:', error);
        res.status(500).json({ message: 'Error updating topic' });
    }
};

/**
 * @async
 * @function deleteTopic
 * @description Supprime un topic et toutes les leçons et quizzes associés.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.deleteTopic = async (req, res) => {
    try {
        const { topicId, courseId } = req.params;

        const topic = await Topic.findById(topicId).populate('lessons quizzes');
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        await Lesson.deleteMany({ _id: { $in: topic.lessons } });

        const quizIds = topic.quizzes.map(quiz => quiz._id);
        await Question.deleteMany({ _id: { $in: quizIds } });
        await Quiz.deleteMany({ _id: { $in: topic.quizzes } });

        // Supprimer le topic de la liste des sections du cours
        const courseUpdateResult = await Course.updateOne(
            { _id: courseId },
            { $pull: { sections: topicId } }
        );

        console.log('Course update result:', courseUpdateResult);

        if (courseUpdateResult.nModified === 0) {
            return res.status(404).json({ message: 'Course not found or topic not associated with this course' });
        }

        const deletedTopic = await Topic.findByIdAndDelete(topicId);

        console.log('Deleted topic:', deletedTopic);

        res.status(200).json({
            acknowledged: true,
            insertedId: null,
            matchedCount: courseUpdateResult.n,
            modifiedCount: courseUpdateResult.nModified,
            upsertedCount: 0
        });
    } catch (error) {
        console.error('Error deleting topic:', error);
        res.status(500).json({ message: 'Error deleting topic' });
    }
};