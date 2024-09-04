const Quiz = require('../models/quiz');
const Question = require('../models/question');
const Topic = require('../models/topic');
const QuizScore = require('../models/quizScore');
const mongoose = require('mongoose');

/**
 * Crée un quiz associé à un topic.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>} - Une promesse qui résout le quiz créé.
 */
exports.createQuiz = async (req, res) => {
    try {
        const { topicId } = req.params;
        const { name, summary, questions, timing } = req.body;

        if (!name || !summary || !questions || !timing) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        console.log('Received timing:', timing);

        // Créer et enregistrer toutes les questions du quiz 
        const createdQuestions = await Promise.all(questions.map(async (questionData) => { 
            const { question, type, options, correctAnswer } = questionData; 
            const createdQuestion = await Question.create({ question, type, options, correctAnswer }); 
            return createdQuestion._id; 
        }));

        // Créer le quiz avec les IDs des questions créées et l'associer au topic 
        const quiz = await Quiz.create({ name, summary, questions: createdQuestions, timing });

        console.log('Quiz created:', quiz);

        // Associer le quiz au sujet
        const topic = await Topic.findById(topicId);
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }
        topic.quizzes.push(quiz._id);
        await topic.save();

        // Populate the quiz with question details
        const populatedQuiz = await Quiz.findById(quiz._id).populate('questions');

        // Envoyer la réponse avec le quiz créé et les détails des questions
        res.status(201).json(populatedQuiz);

    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ message: 'Error creating quiz' });
    }
};

/**
 * @async
 * @function updateQuiz
 * @description Met à jour un quiz.
 * @param {Object} req - La requête HTTP.
 * @param {Object} req.params - Les paramètres de la requête.
 * @param {string} req.params.quizId - L'ID du quiz.
 * @param {Object} req.body - Le corps de la requête.
 * @param {string} req.body.name - Le nom du quiz.
 * @param {string} req.body.summary - Le résumé du quiz.
 * @param {Array} req.body.questions - Les questions du quiz.
 * @param {number} req.body.timing - Le temps alloué pour le quiz.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.updateQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { name, summary, questions, timing } = req.body;

        console.log('Updating quiz with ID:', quizId);
        console.log('Quiz data received:', { name, summary, questions, timing });

        // Mettre à jour ou créer toutes les questions du quiz
        const updatedQuestions = await Promise.all(questions.map(async (questionData) => {
            const { _id, question, type, options, correctAnswer } = questionData;
            console.log('Updating/Creating question:', questionData);

            // Validation des types de question
            if (type === 'multiple choice' && !Array.isArray(correctAnswer)) {
                throw new Error('Correct answer must be an array for multiple choice questions');
            } else if (type === 'short answer' && typeof correctAnswer !== 'string') {
                throw new Error('Correct answer must be a string for short answer questions');
            }

            let updatedQuestion;
            if (_id) {
                updatedQuestion = await Question.findByIdAndUpdate(
                    _id,
                    { question, type, options, correctAnswer },
                    { new: true }
                );
            } else {
                updatedQuestion = new Question({ question, type, options, correctAnswer });
                await updatedQuestion.save();
            }

            console.log('Updated/Created question:', updatedQuestion);
            return updatedQuestion._id;
        }));

        // Mettre à jour le quiz avec les nouvelles données et les IDs des questions mises à jour
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            quizId,
            { name, summary, questions: updatedQuestions, timing },
            { new: true }
        ).populate('questions');

        console.log('Updated quiz:', updatedQuiz);

        res.status(200).json(updatedQuiz);
    } catch (error) {
        console.error('Error updating quiz:', error);
        res.status(500).json({ message: 'Error updating quiz' });
    }
};

/**
 * Récupère les quizzes d'un sujet.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>} - Une promesse qui résout les quizzes d'un sujet.
 */
exports.getQuizzesByTopic = async (req, res) => {
    try {
        const { topicId } = req.params;

        // Récupérer le sujet avec les quizzes associés
        const topic = await Topic.findById(topicId).populate('quizzes');

        // Vérifier si le sujet existe
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        // Extraire les quizzes du sujet
        const quizzes = topic.quizzes;
        console.log('Quiz created:', quiz);

        res.status(200).json(quizzes);
    } catch (error) {
        console.error('Error retrieving quizzes by topic:', error);
        res.status(500).json({ message: 'Error retrieving quizzes by topic' });
    }
};

/**
 * @async
 * @function getQuizById
 * @description Récupère un quiz par son ID.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getQuizById = async (req, res) => {
    try {
        const { quizId } = req.params;
        const quiz = await Quiz.findById(quizId).populate('questions');
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json(quiz);
    } catch (error) {
        console.error('Error fetching quiz by ID:', error);
        res.status(500).json({ message: 'Error fetching quiz by ID' });
    }
};

/**
 * Récupère la liste des questions d'un quiz.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>} - Une promesse qui résout la liste des questions.
 */
exports.getQuestionsByQuizId = async (req, res) => {
    try {
        const { quizId } = req.params;
        
        // Récupérer le quiz correspondant à l'ID donné et peupler les questions
        const quiz = await Quiz.findById(quizId).populate('questions');
        
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        
        const questions = quiz.questions; 
        res.status(200).json(questions);
    } catch (error) {
        console.error('Error retrieving questions by quiz ID:', error);
        res.status(500).json({ message: 'Error retrieving questions by quiz ID' });
    }
};
/**
 * Récupère le nombre de questions dans un quiz.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>} - Une promesse qui résout le nombre de questions dans un quiz.
 */
exports.getNumberOfQuestionsInQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        // Récupérer le quiz correspondant à l'ID donné
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        // Compter le nombre de questions dans le quiz
        const numberOfQuestions = quiz.questions.length;

        res.status(200).json({ numberOfQuestions });
    } catch (error) {
        console.error('Error retrieving number of questions in quiz:', error);
        res.status(500).json({ message: 'Error retrieving number of questions in quiz' });
    }
};
/**
 * Soumet un quiz et calcule le score de l'étudiant.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>} - Une promesse qui résout le score du quiz soumis.
 */
exports.submitQuiz = async (req, res) => {
    try {
        const { quizId, studentId, answers } = req.body;

        // Récupérez le quiz par son ID
        const quiz = await Quiz.findById(quizId).populate('questions');

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Vérifiez si le quiz a déjà été terminé par l'utilisateur
        const existingQuizScore = await QuizScore.findOne({
            studentId: studentId,
            quizId: quizId,
            completed: true
        });

       /* if (existingQuizScore) {
            return res.status(400).json({ message: "Quiz already completed" });
        }*/

        // Calculez le score en comparant les réponses soumises avec les réponses correctes des questions
        let score = 0;
        const correctAnswers = quiz.questions.map((question, index) => {
            const correctAnswer = question.correctAnswer;
            const submittedAnswer = answers[index];

            let isCorrect = false;
            if (Array.isArray(correctAnswer)) {
                // Multiple choice question
                const correctAnswerLowerCase = correctAnswer.map(ans => ans.toLowerCase());
                const submittedAnswerLowerCase = Array.isArray(submittedAnswer) ? submittedAnswer.map(ans => ans.toLowerCase()) : [];
                isCorrect = correctAnswerLowerCase.length === submittedAnswerLowerCase.length &&
                            correctAnswerLowerCase.every(ans => submittedAnswerLowerCase.includes(ans));
            } else {
                // Single answer question
                isCorrect = submittedAnswer?.toLowerCase() === correctAnswer.toLowerCase();
            }

            if (isCorrect) {
                score++;
            }
            return { question: question.question, correctAnswer: correctAnswer };
        });

        // Calculez le score en pourcentage
        const totalQuestions = quiz.questions.length;
        const scorePercentage = (score / totalQuestions) * 100;

        // Déterminez la performance de l'étudiant en fonction du pourcentage de score
        let performance = "";
        if (scorePercentage >= 90) {
            performance = "Excellent!";
        } else if (scorePercentage >= 80) {
            performance = "Great";
        } else if (scorePercentage >= 70) {
            performance = "Good";
        } else if (scorePercentage >= 60) {
            performance = "Satisfactory";
        } else if (scorePercentage >= 50) {
            performance = "Fair";
        } else {
            performance = "Poor";
        }
        
        // Enregistrez le score dans le modèle QuizScore
        const newQuizScore = new QuizScore({
            studentId: studentId,
            quizId: quizId,
            score: score,
            performance: performance,
            completed: true // Marquer le quiz comme terminé ici
        });
        await newQuizScore.save();

        // Répondre avec les détails du score et les réponses correctes
        res.status(200).json({ 
            score: score, 
            totalQuestions: totalQuestions,
            scoreString: `${score}/${totalQuestions}`,
            percentage:  Math.round(scorePercentage) + "%",
            performance: performance,
            correctAnswers: correctAnswers
        });
    } catch (error) {
        console.error("Error submitting quiz:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @async
 * @function deleteQuiz
 * @description Supprime un quiz et toutes les questions associées.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.deleteQuiz = async (req, res) => {
    try {
        const { quizId, topicId } = req.params;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        await Question.deleteMany({ _id: { $in: quiz.questions } });

        // Supprimer le quiz de la liste des quizzes du topic
        const topicUpdateResult = await Topic.updateOne(
            { _id: topicId },
            { $pull: { quizzes: quizId } }
        );

        console.log('Topic update result:', topicUpdateResult);

        if (topicUpdateResult.modifiedCount === 0) {
            return res.status(404).json({ message: 'Topic not found or quiz not associated with this topic' });
        }

        const deletedQuiz = await Quiz.findByIdAndDelete(quizId);

        console.log('Deleted quiz:', deletedQuiz);

        res.status(200).json({
            acknowledged: true,
            insertedId: null,
            matchedCount: topicUpdateResult.matchedCount,
            modifiedCount: topicUpdateResult.modifiedCount,
            upsertedCount: 0
        });
    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ message: 'Error deleting quiz' });
    }
};