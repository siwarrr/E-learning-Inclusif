const Course = require('../models/course');
const Lesson = require('../models/lesson');
const User = require('../models/user');
const mongoose = require('mongoose');
const Commentaire = require('../models/commentaire');
const Topic = require('../models/topic');
const Quiz = require('../models/quiz');
const Student = require('../models/Student');
const CourseSpace = require('../models/courseSpace');
const QuizScore = require('../models/quizScore');
const { createTopic } = require('./topicController');


/**
 * @async
 * @function submitCourseForm
 * @description Soumet le formulaire du cours en fusionnant les sections.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */                             
exports.submitCourseForm = async (req, res) => {
    try {
        const { title, description, courseSpace, sections, imageUrl  } = req.body;
        const teacherId = req.user.userId;

        // Vérifier si courseSpace est défini
        if (!courseSpace) {
            return res.status(400).json({ message: 'Course space ID is required' });
        }

        // Enregistrer le cours pour la première fois
        const createdCourse = await Course.create({
            title,
            description,
            courseSpace,
            sections,
            enableComments: true, // Activation par défaut des commentaires
            enableRatings: true, // Activation par défaut des avis
            teacher: teacherId,
            imageUrl 
        });
        await CourseSpace.findByIdAndUpdate(courseSpace, { $push: { courses: createdCourse._id } });

        res.status(200).json(createdCourse); // Renvoyer le cours créé
        console.log("cours crée:", createdCourse)
    } catch (error) {
        console.error('Error submitting course form:', error);
        res.status(500).json({ message: 'Error submitting course form' }); // Gérer les erreurs
    }
};
/**
 * @async
 * @function updateCourse
 * @description Met à jour un cours.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, courseSpace, sections, imageUrl } = req.body;

        // Mettre à jour les détails du cours avec les données fournies
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { title, description, courseSpace, sections, imageUrl },
            { new: true } // Pour renvoyer le document mis à jour
        );

        res.status(200).json(updatedCourse); // Renvoyer le cours mis à jour
        console.log("cours modifé:", updatedCourse)
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Error updating course' }); // Gérer les erreurs
    }
};
/**
 * @async
 * @function getTeacherCourses
 * @description Récupère tous les cours d'un enseignant.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getTeacherCourses = async (req, res) => {
    try {
      const teacherId = req.user.userId; // Récupérez l'ID de l'enseignant à partir de l'utilisateur authentifié
      const courses = await Course.find({ teacher: teacherId });
      res.status(200).json(courses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
 /**
 * @async
 * @function getAllCourses
 * @description Récupère tous les cours.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */ 
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
/**
 * @async
 * @function getCourseById
 * @description Récupère un cours par son ID.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        console.error('Error fetching course by ID:', error);
        res.status(500).json({ message: 'Error fetching course by ID' });
    }
};
/**
 * @async
 * @function getTeacherNameByCourseId
 * @description Récupère le nom de l'enseignant pour un cours donné.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getTeacherNameByCourseId = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Trouver le cours par son ID pour obtenir l'ID de l'enseignant
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Trouver l'utilisateur (enseignant) par son ID
        const teacher = await User.findById(course.teacher);

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Extraire le nom complet de l'enseignant
        const teacherName = teacher.fullname;
        res.status(200).json({ teacherName });
    } catch (error) {
        console.error('Error fetching teacher name by course ID:', error);
        res.status(500).json({ message: 'Error fetching teacher name by course ID' });
    }
};

/**
 * @async
 * @function registerCourse
 * @description Inscrit un utilisateur à un cours.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.registerCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.userId;

        // Vérifier si le cours existe
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Vérifier si l'utilisateur est déjà inscrit dans le cours
        const isUserRegistered = course.students.includes(userId);
        if (isUserRegistered) {
            return res.status(400).json({ message: 'User is already registered in this course' });
        }

        // Enregistrer l'inscription dans le cours
        course.students.push(userId);
        await course.save();

        // Mettre à jour la liste des cours dans laquelle l'utilisateur est inscrit
        const user = await Student.findByIdAndUpdate(userId, { $push: { enrolledCourses: courseId } }, { new: true });

        res.status(200).json({ message: 'User registered in the course successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
/**
 * @async
 * @function getInitialVideo
 * @description Récupère la première vidéo d'un cours ou la dernière vidéo regardée par l'utilisateur.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getInitialVideo = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const userId = req.user.userId;

        // Vérifier si l'utilisateur a déjà regardé des vidéos dans ce cours
        const user = await User.findById(userId).populate('watchedVideos');
        const watchedVideosInCourse = user.watchedVideos.filter(video => video.courseId.toString() === courseId);

        if (watchedVideosInCourse.length === 0) {
            // Si l'utilisateur n'a pas encore regardé de vidéos dans ce cours, récupérer la première vidéo de la première leçon du premier sujet
            const course = await Course.findById(courseId).populate({
                path: 'sections',
                populate: {
                    path: 'lessons',
                    model: 'Lesson'
                }
            });

            // Vérifiez s'il y a des sections dans le cours
            if (course.sections.length === 0 || course.sections[0].lessons.length === 0) {
                return res.status(404).json({ message: 'No lessons found in the course' });
            }

            const firstLesson = course.sections[0].lessons[0]; // Première leçon du premier sujet
            const firstVideo = firstLesson.videoUrl; // URL de la première vidéo

            // Ajouter la vidéo regardée par l'utilisateur dans la liste des vidéos regardées
            user.watchedVideos.push({ courseId: courseId, lessonId: firstLesson._id });
            await user.save();

            res.status(200).json({ videoUrl: firstVideo });
        } else {
            // Si l'utilisateur a déjà regardé des vidéos dans ce cours, récupérer la dernière vidéo vue dans ce cours
            const lastWatchedVideo = watchedVideosInCourse[watchedVideosInCourse.length - 1];
            const lastWatchedLesson = await Lesson.findById(lastWatchedVideo.lessonId);

            res.status(200).json({ videoUrl: lastWatchedLesson.videoUrl });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
/**
 * @async
 * @function getEnrolledStudents
 * @description Récupère les étudiants inscrits à un cours.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getEnrolledStudents = async (req, res) => {
    try {
        // Récupérer l'ID du cours à partir des paramètres de la requête
        const courseId = req.params.courseId;

        // Recherchez le cours par ID et populez les détails des étudiants inscrits
        const course = await Course.findById(courseId).populate('students');

        // Vérifiez si le cours existe
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Extraire la liste des apprenants inscrits
        const enrolledStudents = course.students;

        res.status(200).json(enrolledStudents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
/**
 * @async
 * @function getCourseSections
 * @description Récupère les sections d'un cours.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getCourseSections = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        // Validation de l'ID du cours
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: 'Invalid course ID' });
        }

        // Recherche du cours avec les sections peuplées
        const course = await Course.findById(courseId).populate('sections');

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json(course.sections);
    } catch (error) {
        console.error('Error retrieving course sections:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
/**
 * @async
 * @function getCourseWithComments
 * @description Récupère un cours avec ses commentaires.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getCourseWithComments = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        // Récupérer le cours avec les IDs des commentaires associés
        const course = await Course.findById(courseId).populate('commentaires');

        // Si le cours n'existe pas
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Renvoyer le cours avec les commentaires associés
        res.status(200).json(course);
    } catch (error) {
        console.error('Error retrieving course with comments:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
async function getStudentScoreForQuiz(studentId, quizId) {
    try {
        console.log(`Fetching score for student ID: ${studentId}, Quiz ID: ${quizId}`);

        // Recherchez le score de l'étudiant pour ce quiz dans la collection quizscore
        const quizScore = await QuizScore.findOne({ studentId: studentId, quizId: quizId });
        console.log('Quiz score details:', quizScore);

        if (quizScore) {
            return { score: quizScore.score, performance: quizScore.performance }; // Retournez le score et la performance
        } else {
            console.log('Quiz score not found');
            return null;
        }
    } catch (error) {
        console.error('Error fetching student score for quiz:', error);
        return null;
    }
}
/**
 * @async
 * @function getQuizScoresForCourse
 * @description Récupère les scores des quizzes pour un cours.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getQuizScoresForCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        // Recherchez tous les quizzes associés au cours
        const course = await Course.findById(courseId).populate('sections');

        // Si aucun cours n'est trouvé pour cet ID
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        let quizScores = [];

        // Itérer sur chaque section pour récupérer les quizzes
        for (const section of course.sections) {
            if (section.quizzes && section.quizzes.length > 0) {
                for (const quizId of section.quizzes) {
                    const quiz = await Quiz.findById(quizId);
                    if (quiz) {
                        // Récupérer les scores des étudiants pour ce quiz
                        const studentsWithScores = await getStudentsWithScores(courseId, quizId);
                        quizScores.push({ quiz, students: studentsWithScores });
                    }
                }
            }
        }

        res.status(200).json(quizScores);
    } catch (error) {
        console.error('Error fetching quiz scores for course:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Fonction pour récupérer les scores des étudiants pour un quiz donné
async function getStudentsWithScores(courseId, quizId) {
    try {
        console.log('Fetching students and their scores for quiz:', quizId);

        // Récupérer les étudiants inscrits au cours
        const course = await Course.findById(courseId).populate('students');
        console.log('Students enrolled in the course:', course.students);

        // Récupérer le quiz spécifique
        const quiz = await Quiz.findById(quizId);
        console.log('Quiz details:', quiz);

        let studentsWithScores = [];

        // Itérer sur chaque étudiant pour récupérer son score et sa performance dans le quiz
        for (const student of course.students) {
            // Recherchez le score et la performance de l'étudiant pour ce quiz dans la base de données
            const studentScore = await getStudentScoreForQuiz(student._id, quizId);
            console.log(`Student ID: ${student._id}, Score: ${studentScore}`);

            // Vérifier si le score de l'étudiant est null
            if (studentScore !== null) {
                studentsWithScores.push({ student, score: studentScore.score, performance: studentScore.performance });
            } else {
                console.log(`Score not found for student ID: ${student._id}`);
            }
        }

        return studentsWithScores;
    } catch (error) {
        console.error('Error fetching students with scores for quiz:', error);
        return [];
    }
};
/**
 * @async
 * @function deleteCourse
 * @description Supprime un cours par son ID.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Récupérer le cours avec les sections
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Cours non trouvé!" });
        }

        // Supprimer les sections associées
        await Topic.deleteMany({ _id: { $in: course.sections } });

        // Supprimer le cours
        await Course.findByIdAndDelete(courseId);

        res.status(204).json({ message: "Cours et sections supprimés!" });
    } catch (error) {
        console.error("Error deleting course and sections:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * @async
 * @function getPopularCourses
 * @description Récupère les cours populaires en fonction du nombre d'inscriptions.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getPopularCourses = async (req, res) => {
    try {
        // Utiliser l'agrégation pour trier les cours par le nombre d'inscriptions (taille du tableau students)
        const popularCourses = await Course.aggregate([
            {
                $project: {
                    title: 1,
                    description: 1,
                    teacher: 1,
                    courseSpace: 1,
                    students: 1,
                    sections: 1,
                    commentaires: 1,
                    avis: 1,
                    imageUrl: 1,
                    numberOfStudents: { $size: "$students" }
                }
            },
            { $sort: { numberOfStudents: -1 } }, // Trier par le nombre d'étudiants en ordre décroissant
            { $limit: 10 } // Limiter à 10 cours
        ]);

        // Récupérer les IDs des enseignants
        const teacherIds = popularCourses.map(course => course.teacher);

        // Récupérer les noms des enseignants
        const teachers = await User.find({ _id: { $in: teacherIds } }, 'fullname');

        // Créer un dictionnaire pour accéder aux noms des enseignants rapidement
        const teacherNameMap = teachers.reduce((acc, teacher) => {
            acc[teacher._id] = teacher.fullname;
            return acc;
        }, {});

        // Ajouter le nom complet de l'enseignant à chaque cours
        const coursesWithTeacherNames = popularCourses.map(course => ({
            ...course,
            teacherFullName: teacherNameMap[course.teacher]
        }));

        res.status(200).json(coursesWithTeacherNames);
    } catch (error) {
        console.error('Error fetching popular courses:', error);
        res.status(500).json({ message: 'Error fetching popular courses', error });
    }
};

exports.getStudentScore = async (quizId, studentId) => {
    try {
        const quizScore = await QuizScore.findOne({ quizId, studentId });
        return quizScore ? quizScore.score : null;
    } catch (error) {
        throw new Error(error);
    }
};
/**
 * @async
 * @function getStudentQuizScores
 * @description Récupère les scores des quizzes pour un apprenant dans un cours.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getStudentQuizScores = async (req, res) => {
    try {
        const { courseId, userId } = req.params;

        console.log('Course ID:', courseId); // Log to check courseId
        console.log('User ID:', userId); // Log to check userId

        // Retrieve the course by its ID and populate sections and quizzes
        const course = await Course.findById(courseId).populate({
            path: 'sections',
            populate: {
                path: 'lessons quizzes'
            }
        }).exec();

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Retrieve quiz IDs directly from the course sections
        const quizIds = course.sections.reduce((acc, section) => {
            section.quizzes.forEach(quiz => {
                acc.push(quiz._id);
            });
            return acc;
        }, []);

        console.log('Quiz IDs:', quizIds); // Log to check retrieved quizIds

        // Retrieve all quiz scores for the student in one query
        const quizScores = await QuizScore.find({ 
            studentId: userId, 
            quizId: { $in: quizIds }, 
            completed: true 
        }).exec();

        console.log('Quiz Scores:', quizScores); // Log to check retrieved quizScores

        // Create a map of quizId to its score for easy lookup
        const quizScoreMap = quizScores.reduce((acc, score) => {
            acc[score.quizId] = score;
            return acc;
        }, {});

        // Generate the response with quiz scores
        const studentQuizScores = quizIds.map(quizId => {
            const quizScore = quizScoreMap[quizId];
            return {
                quizId,
                userId,
                score: quizScore ? quizScore.score : null,
                performance: quizScore ? quizScore.performance : null
            };
        });

        res.json(studentQuizScores);
        console.log("Student results:", studentQuizScores);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @async
 * @function getStudentProgress
 * @description Récupère la progression d'un étudiant dans un cours.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getStudentProgress = async (req, res) => {
    const { courseId, userId } = req.params;

    try {
        // Récupérer le cours avec ses sections, leçons et quizzes
        const course = await Course.findById(courseId).populate({
            path: 'sections',
            populate: {
                path: 'lessons quizzes'
            }
        });

        if (!course) {
            return res.status(404).json({ message: 'Cours non trouvé' });
        }

        console.log("Course sections:", course.sections);

        // Compter le nombre total de vidéos dans le cours
        const totalVideos = course.sections.reduce((count, section) => count + section.lessons.length, 0);
        console.log("Total videos:", totalVideos);

        // Récupérer les informations de l'utilisateur
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        console.log("User watched videos:", user.watchedVideos);

        // Récupérer tous les quizzes de ce cours
        const quizzes = course.sections.flatMap(section => section.quizzes);
        console.log("Total quizzes:", quizzes.length);

        // Récupérer les résultats de l'utilisateur pour ces quizzes
        const userQuizResults = await QuizScore.find({
            studentId: userId,
            quizId: { $in: quizzes.map(quiz => quiz._id) },
            completed: true
        });

        console.log("User quiz results:", userQuizResults);

        // Suivre les vidéos et quizzes uniques complétés par l'utilisateur
        const uniqueWatchedVideos = new Set(
            user.watchedVideos
                .filter(video => video.courseId?.toString() === courseId)
                .map(video => video.videoId?.toString())
                .filter(videoId => videoId !== undefined)
        );

        const uniquePassedQuizzes = new Set(
            userQuizResults
                .map(result => result.quizId?.toString())
                .filter(quizId => quizId !== undefined)
        );

        console.log("Unique watched videos:", uniqueWatchedVideos.size);
        console.log("Unique passed quizzes:", uniquePassedQuizzes.size);

        // Compter les éléments complétés
        const completedVideos = uniqueWatchedVideos.size;
        const completedQuizzes = uniquePassedQuizzes.size;

        // Calculer le pourcentage de progression basé sur les vidéos et les quizzes
        const totalQuizzes = quizzes.length;
        const totalItems = totalVideos + totalQuizzes;
        const completedItems = completedVideos + completedQuizzes;
        const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

        console.log("Total items:", totalItems);
        console.log("Completed items:", completedItems);
        console.log("Progress percentage:", progressPercentage);

        res.json({ progress: progressPercentage.toFixed(2) });
    } catch (error) {
        console.error("Error in getStudentProgress:", error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};





/*/**
 * @async
 * @function createCourse
 * @description Crée un nouveau cours.
 * @param {Object} req - La requête HTTP.
 * @param {Object} req.body - Le corps de la requête.
 * @param {string} req.body.title - Le titre du cours.
 * @param {string} req.body.description - La description du cours.
 * @param {string} req.body.courseSpace - L'ID de l'espace de cours.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
/*exports.createCourse = async (req, res) => {
    try {
        const { title, description, courseSpace, imageUrl } = req.body;
        const teacherId = req.user.userId;

        // Vérifier si courseSpace est défini
        if (!courseSpace) {
            return res.status(400).json({ message: 'Course space ID is required' });
        }

        // Créez le cours en utilisant les données fournies
        const course = await Course.create({
            title,
            description,
            courseSpace,
            sections: [], // Initialiser la liste des sections à vide
            enableComments: true, // Activation par défaut des commentaires
            enableRatings: true, // Activation par défaut des avis
            teacher: teacherId,
            imageUrl 
        });

        // Mettre à jour le champ "courses" de l'espace de cours correspondant
        await CourseSpace.findByIdAndUpdate(courseSpace, { $push: { courses: course._id } });

        // Envoyer la réponse avec le cours créé
        res.status(201).json(course);
    } catch (error) {
        // Gérer les erreurs
        console.error('Error creating course:', error);
        res.status(400).json({ message: error.message });
    }
};*/

/*/**
 * @async
 * @function saveSecondSection
 * @description Met à jour les sections d'un cours.
 * @param {Object} req - La requête HTTP.
 * @param {Object} req.body - Le corps de la requête.
 * @param {string} req.body.courseId - L'ID du cours.
 * @param {Object} req.body.sectionData - Les données de la section.
 * @param {boolean} req.body.isEditing - Indique si c'est une édition.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
/*exports.saveSecondSection = async (req, res) => {
    try {
        const { courseId, sectionData, isEditing } = req.body; // Récupérer les données du corps de la requête

        // Vérifier si sectionData et sectionData.sections sont définis
        if (!sectionData || !sectionData.sections) {
            console.error('Error: sectionData or sectionData.sections is undefined.');
            return res.status(400).json({ error: 'Section data is missing or incorrect' });
        }

        // Créez une liste pour stocker les IDs des topics
        let topicIds = [];

        // Parcourez chaque section de sectionData pour créer et enregistrer les topics
        for (const section of sectionData.sections) {
            const { name, description } = section; // Récupérer les détails de la section

            // Créez le topic en utilisant les données fournies
            const topic = await Topic.create({ name, description });

            // Ajoutez l'ID du topic à la liste
            topicIds.push(topic._id);
        }

        // Mettez à jour le champ "sections" du cours avec la liste des IDs des topics
        if (!isEditing) {
            // Si ce n'est pas une édition, mettez à jour le champ "sections" du cours
            const updatedCourse = await Course.findByIdAndUpdate(courseId, { sections: topicIds }, { new: true });

            // Envoyer une réponse avec le cours mis à jour
            res.status(200).json({ message: 'Course sections updated successfully', course: updatedCourse });
        } else {
            // Si c'est une édition, ne mettez pas à jour le champ "sections" du cours
            res.status(200).json({ message: 'Topics created successfully', topicIds });
        }
    } catch (error) {
        console.error('Error updating course sections:', error);
        res.status(500).json({ error: 'Error updating course sections' });
    }
};*/