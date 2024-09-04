const User = require('../models/user');
const Lesson = require('../models/lesson');
const Reclamation = require('../models/reclamation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Récupérer tous les utilisateurs.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Object} Réponse HTTP avec la liste de tous les utilisateurs.
 */
exports.getAllUsers = async (req, res)=>{
    try{
        const users = await User.find();
        res.json(users);

    } catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
/**
 * Enregistrer un nouvel apprenant.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Object} Réponse HTTP avec les informations de l'apprenant enregistré et le token JWT.
 */
exports.registerStudent = async (req, res) => {
    try {
        const { fullname, email, password, handicapType } = req.body;

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        const newStudent = new User({
            fullname,
            email,
            password: hashedPassword,
            role: 'student', // Rôle étudiant
            handicapType: handicapType
        });

        //Generate token
        const token = jwt.sign({ userId: newStudent._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRE_TIME,
        });

        await newStudent.save();
        res.status(201).json({ message: 'Student registered successfully', user: newStudent, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
/**
 * Enregistrer un nouvel enseignant.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Object} Réponse HTTP avec les informations de l'enseignant enregistré et le token JWT.
 */
exports.registerTeacher = async (req, res) => {
    try {
        const { fullname, email, password, handicapType } = req.body;

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        const newTeacher = new User({
            fullname,
            email,
            password: hashedPassword,
            role: 'teacher', // Rôle enseignant
            handicapType: handicapType
        });

         //Generate token
         const token = jwt.sign({ userId: newTeacher._id}, process.env.JWT_SECRET_KEY, {
         expiresIn: process.env.JWT_EXPIRE_TIME,
        });

        await newTeacher.save();
        res.status(201).json({ message: 'Teacher registered successfully', user: newTeacher, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
/**
 * Connecter un utilisateur.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Object} Réponse HTTP avec le token JWT et le rôle de l'utilisateur.
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Rechercher l'utilisateur dans la base de données
      const user = await User.findOne({ email });
  
      // Vérifier si l'utilisateur existe
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Vérifier si le mot de passe est correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Créer un token JWT avec l'ID de l'utilisateur et son rôle
      const token = jwt.sign({ userId: user._id, fullName: user.fullname, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  
      // Envoyer le token et le rôle de l'utilisateur dans la réponse
      console.log('User Role:', user.role); // Ajouter cette ligne pour afficher le rôle renvoyé
      console.log('Generated Token:', token);  // Log the generated token
      res.status(200).json({ token, role: user.role });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
/**
 * Déconnecter un utilisateur.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Object} Réponse HTTP confirmant la déconnexion de l'utilisateur.
 */
  exports.logout = async (req, res) => {
    try {
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
/**
 * Récupérer un utilisateur par son ID.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Object} Réponse HTTP avec les informations de l'utilisateur.
 */
  exports.getUserById = async (req, res) => {
    try {
        const userId = req.user.userId; // Récupérer l'ID de l'utilisateur à partir du token JWT
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
/**
 * Mettre à jour un utilisateur.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Object} Réponse HTTP avec les informations de l'utilisateur mis à jour.
 */
exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { fullname , email, password,  } = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, { 
            fullname,
            email,
            password 
        }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
/**
 * Supprimer un utilisateur.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Object} Réponse HTTP confirmant la suppression de l'utilisateur.
 */
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
/**
 * Récupérer les informations de l'utilisateur actuel.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Object} Réponse HTTP avec les informations de l'utilisateur actuel.
 */
exports.getCurrentUser = async (req, res) => {
    try {
        // Récupérer l'ID de l'utilisateur à partir du token JWT
        const userId = req.user.userId;

        // Rechercher l'utilisateur dans la base de données
        const user = await User.findById(userId);

        // Vérifier si l'utilisateur existe
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Renvoyer les informations de l'utilisateur
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
/**
 * Marquer une vidéo comme regardée.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Object} Réponse HTTP confirmant que la vidéo a été regardée.
 */
exports.watchVideo = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { courseId, lessonId } = req.body;

        // Ajouter la vidéo vue par l'utilisateur dans le cours spécifié
        await User.findByIdAndUpdate(userId, {
            $addToSet: { watchedVideos: { courseId, lessonId } }
        });

        // Ajouter l'utilisateur à la liste des utilisateurs ayant regardé cette leçon
        await Lesson.findByIdAndUpdate(lessonId, {
            $addToSet: { watchedBy: userId }
        });

        res.status(200).json({ message: 'Video watched successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
/**
 * Envoyer une réclamation.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Object} Réponse HTTP confirmant l'envoi de la réclamation.
 */
exports.sendReclamation = async (req, res) => {
    try {
        const { userId, message } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        // Créer une nouvelle réclamation
        const newReclamation = new Reclamation({
            user: userId,
            fullname: user.fullname,
            message: message,
        });

        // Enregistrer la réclamation dans la base de données
        const savedReclamation = await newReclamation.save();

        res.status(201).json({ message: "Réclamation envoyée avec succès.", reclamation: savedReclamation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de l'envoi de la réclamation." });
    }
};
/**
 * Envoyer un token de réinitialisation de mot de passe.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Object} Réponse HTTP confirmant l'envoi du token de réinitialisation.
 */
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Générer un token unique pour la réinitialisation du mot de passe
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h' // Le token expirera après 1 heure
        });

        // Enregistrer le token et sa date d'expiration dans la base de données pour cet utilisateur
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 heure d'expiration

        await user.save();

        // Envoyer le token par un canal sécurisé (par exemple, par e-mail ou dans une notification dans l'application)
        // Vous devez implémenter cette partie en fonction de votre canal préféré

        res.status(200).json({ message: 'Password reset token sent', token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
/**
 * Réinitialiser le mot de passe de l'utilisateur.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Object} Réponse HTTP confirmant la réinitialisation du mot de passe.
 */
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        // Vérifier et décoder le token JWT
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Trouver l'utilisateur correspondant au token
        const user = await User.findById(decodedToken.userId);

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid' });
        }

        // Mettre à jour le mot de passe de l'utilisateur
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password has been reset' });
    } catch (error) {
        console.error(error);
        // Gérer les erreurs spécifiques aux tokens expirés ou invalides
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};
