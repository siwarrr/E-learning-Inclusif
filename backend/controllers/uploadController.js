const multer = require('multer');

// Configuration de Multer pour gérer les fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Dossier où les fichiers seront enregistrés
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Nom du fichier original
  }
});

const upload = multer({ storage: storage });

/**
 * Méthode pour gérer le téléchargement du fichier vidéo de la leçon.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Object} Réponse HTTP avec le statut du téléchargement de la vidéo.
 */
const uploadLessonVideo = (req, res) => {
    upload.single('lessonVideo')(req, res, (err) => {
      if (err) {
        console.error('Error uploading video file:', err);
        return res.status(400).json({ error: 'Error uploading video file' });
      }
      console.log('Video file received:', req.file); // Log pour vérifier si la vidéo est reçue correctement
      // Code pour enregistrer le fichier vidéo dans la base de données
      // et renvoyer une réponse appropriée au client
      res.status(200).json({ message: 'Video uploaded successfully' });
    });
  };
  
/**
 * Méthode pour gérer le téléchargement des fichiers d'exercices de la leçon.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Object} Réponse HTTP avec le statut du téléchargement des exercices.
 */
const uploadLessonExercises = (req, res) => {
  upload.array('lessonExercise')(req, res, (err) => {
    if (err) {
      console.error('Error uploading exercise files:', err);
      return res.status(400).json({ error: 'Error uploading exercise files' });
    }
    console.log('Exercise files received:', req.files); // Log pour vérifier si les fichiers d'exercices sont reçus correctement
    // Code pour enregistrer les fichiers d'exercices dans la base de données
    // et renvoyer une réponse appropriée au client
    res.status(200).json({ message: 'Exercises uploaded successfully' });
  });
};

module.exports = {
  uploadLessonVideo,
  uploadLessonExercises
};
