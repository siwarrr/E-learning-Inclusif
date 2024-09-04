const Commentaire = require('../models/commentaire');
const Course = require('../models/course');
const Reaction = require('../models/reaction');
const User = require('../models/user');

/**
 * @async
 * @function createComment
 * @description Crée un commentaire sur un cours.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.createComment = async (req, res) => {
    try {
        // Extraire les données de la requête
        const { userId, courseId, text } = req.body;

        // Créer un nouveau commentaire
        const newComment = new Commentaire({
            writer: userId,
            text: text,
            courseId: courseId // Assurez-vous d'inclure le courseId ici
        });

        // Sauvegarder le commentaire dans la base de données
        await newComment.save();

        // Ajouter l'ID du commentaire au cours spécifié
        const course = await Course.findByIdAndUpdate(courseId, {
            $push: { commentaires: newComment._id }
        });

        // Répondre avec succès
        return res.status(201).json({ success: true, message: 'Commentaire créé avec succès', commentaire: newComment });
    } catch (error) {
        console.error('Erreur lors de la création du commentaire :', error);
        return res.status(500).json({ success: false, message: 'Erreur lors de la création du commentaire' });
    }
};

/**
 * @async
 * @function replyToComment
 * @description Répond à un commentaire sur un cours.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.replyToComment = async (req, res) => {
    try {
        const { userId, text } = req.body;
        const { courseId, commentId } = req.params;

        // Créer un nouveau commentaire pour la réponse
        const newComment = new Commentaire({
            writer: userId,
            text: text,
            courseId: courseId
        });

        // Sauvegarder le commentaire dans la base de données
        await newComment.save();

        // Trouver le commentaire auquel répondre et le mettre à jour avec la réponse
        const parentComment = await Commentaire.findById(commentId).populate('writer');

        if (!parentComment) {
            return res.status(404).json({ message: 'Parent comment not found' });
        }

        // Ajouter la réponse au commentaire parent
        parentComment.replies.push(newComment._id);
        await parentComment.save();

        // Mettre à jour la liste des réponses du commentaire parent
        const updatedParentComment = await Commentaire.findById(commentId)
            .populate({
                path: 'replies',
                populate: { path: 'writer' }
            })
            .populate('writer');

        // Répondre avec succès
        return res.status(201).json({
            success: true,
            message: 'Reply added successfully',
            reply: newComment,
            parentComment: updatedParentComment
        });
    } catch (error) {
        console.error('Error replying to comment:', error);
        return res.status(500).json({ success: false, message: 'Error replying to comment' });
    }
};

/**
 * @async
 * @function addReactionToComment
 * @description Ajoute une réaction à un commentaire.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.addReactionToComment = async (req, res) => {
    try {
        const { userId, commentId, reactionType } = req.body;

        // Vérifier si la réaction existe déjà pour cet utilisateur et ce commentaire
        const existingReaction = await Reaction.findOne({ user: userId, comment: commentId });

        if (existingReaction) {
            // Si la réaction existe déjà, mettre à jour le type de réaction
            existingReaction.type = reactionType;
            await existingReaction.save();
        } else {
            // Si la réaction n'existe pas, créer une nouvelle réaction
            const newReaction = new Reaction({
                user: userId,
                comment: commentId,
                type: reactionType
            });
            await newReaction.save();

            // Ajouter l'ID de la reaction au commentaire spécifié
            const commentaire = await Commentaire.findById(commentId);
            commentaire.reactions.push(newReaction._id);
            if (reactionType === 'like') {
                commentaire.likes += 1;
            } else if (reactionType === 'dislike') {
                commentaire.dislikes += 1;
            }
            await commentaire.save();
        }

        return res.status(201).json({ success: true, message: 'Reaction added successfully' });
    } catch (error) {
        console.error('Error adding reaction to comment:', error);
        return res.status(500).json({ success: false, message: 'Error adding reaction to comment' });
    }
};
/**
 * @async
 * @function getComments
 * @description Récupère les commentaires pour un cours.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getComments = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        // Récupérer le cours avec ses commentaires associés
        const course = await Course.findById(courseId).populate({
            path: 'commentaires',
            populate: { path: 'writer' }  // Populer les writers des commentaires
        });

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Récupérer toutes les réactions pour tous les commentaires
        const commentIds = course.commentaires.map(comment => comment._id);
        const reactions = await Reaction.find({ comment: { $in: commentIds } });

        // Associer les réactions à leurs commentaires correspondants
        course.commentaires.forEach(comment => {
            comment.reactions = reactions.filter(reaction => reaction.comment.equals(comment._id));
        });

        // Répondre avec les commentaires et leurs réactions associées
        return res.status(200).json({ success: true, comments: course.commentaires });
    } catch (error) {
        console.error('Error getting comments:', error);
        return res.status(500).json({ success: false, message: 'Error getting comments' });
    }
};
/**
 * @async
 * @function getReplies
 * @description Récupère les réponses d'un commentaire.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getReplies = async (req, res) => {
    try {
        const { commentId } = req.params;

        // Trouver le commentaire et peupler les réponses ainsi que les writers des réponses
        const comment = await Commentaire.findById(commentId)
            .populate({
                path: 'replies',
                populate: {
                    path: 'writer',
                    model: User,
                    select: 'fullname avatarUrl', // sélectionnez les champs que vous voulez retourner
                }
            });

        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        // Répondre avec les réponses du commentaire
        return res.status(200).json({ success: true, replies: comment.replies });
    } catch (error) {
        console.error('Error getting replies:', error);
        return res.status(500).json({ success: false, message: 'Error getting replies' });
    }
};
/**
 * @async
 * @function deleteComment
 * @description Supprime un commentaire.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        // Supprimer le commentaire de la base de données
        await Commentaire.findByIdAndDelete(commentId);

        return res.status(200).json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ success: false, message: 'Error deleting comment' });
    }
};