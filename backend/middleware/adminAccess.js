/**
 * Middleware pour vérifier si l'utilisateur a un accès administrateur.
 * 
 * @param {Object} req - L'objet de la requête.
 * @param {Object} res - L'objet de la réponse.
 * @param {Function} next - La fonction middleware suivante.
 * 
 * @returns {void} Si l'utilisateur est un administrateur, la requête passe au middleware suivant. Sinon, une réponse 403 Forbidden est envoyée.
 */

const adminAccess = (req, res, next) => {
    // Vérifiez si le rôle de l'utilisateur est défini et égal à "admin"
    if (req.user && req.user.role === 'admin') {
        // Si l'utilisateur a le rôle "admin", passez à la prochaine étape
        next();
    } else {
        // Sinon, renvoyez un message d'erreur d'accès refusé
        return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
};

module.exports = adminAccess;
