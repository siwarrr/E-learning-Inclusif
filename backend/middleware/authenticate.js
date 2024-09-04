const jwt = require('jsonwebtoken');

/**
 * Middleware pour authentifier les utilisateurs en vérifiant le jeton JWT.
 *
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @param {Function} next - La fonction suivante à appeler pour passer au middleware suivant.
 * @returns {Object} Réponse HTTP avec un code de statut approprié si le jeton est manquant, invalide ou expiré.
 */

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Missing or invalid token');
    return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token :', token);

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log('Error verifying token :', err);
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Unauthorized: Token expired' });
      }
      // Gérer d'autres erreurs si nécessaire
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    console.log('Decoded user:', decoded); // Log des informations utilisateur décodées
    req.user = decoded;
    console.log('User ID:', req.user.userId); // Log de l'ID utilisateur extrait du jeton
    next();
  });
};

module.exports = authenticate;
