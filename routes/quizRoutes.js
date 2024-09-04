const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authenticate = require('../middleware/authenticate');

/**
 * @route POST /:topicId/quiz
 * @description Créer un quiz pour un sujet spécifique.
 * @access Private
 */
router.post('/:topicId/quiz', authenticate, quizController.createQuiz);

/**
 * @route POST /:topicId/:QuizId
 * @description Mettre à jour un quiz spécifique.
 * @access Private
 */
router.post('/:topicId/:quizId', authenticate, quizController.updateQuiz);

/**
 * @route GET /:topicId
 * @description Récupérer tous les quizzes pour un sujet spécifique.
 * @access Private
 */
router.get('/:topicId', authenticate, quizController.getQuizzesByTopic);

/**
 * @route GET /:topicId/:quizId
 * @description Récupérer un quiz spécifique par son ID.
 * @access Private
 */
router.get('/:topicId/:quizId', authenticate, quizController.getQuizById);

/**
 * @route GET /:topicId/:quizId/questions
 * @description Récupérer les questions d'un quiz spécifique.
 * @access Private
 */
router.get('/:topicId/:quizId/questions', authenticate, quizController.getQuestionsByQuizId);

/**
 * @route GET /:topicId/:quizId/quiz
 * @description Récupérer le nombre de questions dans un quiz spécifique.
 * @access Private
 */
router.get('/:topicId/:quizId/quiz', authenticate, quizController.getNumberOfQuestionsInQuiz);

/**
 * @route POST /submit
 * @description Soumettre les réponses d'un quiz.
 * @access Private
 */
router.post('/submit', authenticate, quizController.submitQuiz);

/**
 * @route DELETE /:quizId
 * @description Supprimer un quiz spécifique.
 * @access Private
 */
router.delete('/:topicId/:quizId', authenticate, quizController.deleteQuiz);

module.exports = router;