// Importation des modules nécessaires
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const axios = require('axios');
const chatServer = require('./chatServer');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const messageController = require('./controllers/messageController');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authenticate = require('./middleware/authenticate');
require('./config/connect');

// Importation des routes
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const adminRoutes = require('./routes/adminRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const courseSpaceRoutes = require('./routes/courseSpaceRoutes');
const courseRoutes = require('./routes/courseRoutes');
const quizRoutes = require('./routes/quizRoutes');
const questionRoutes = require('./routes/questionRoutes');
const learningResourceRoutes = require('./routes/learningResourceRoutes');
const chatRoomRoutes = require('./routes/chatRoomRoutes');
const messageRoutes = require('./routes/messageRoutes');
const commentRoutes = require('./routes/commentRoutes');
const avisRoutes = require('./routes/avisRoutes');
const topicRoutes = require('./routes/topicRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const searchRoutes = require('./routes/searchRoutes');

// Chargement des variables d'environnement
require('dotenv').config();

// Initialisation de l'application Express
const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Serve static files
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}, express.static(path.join(__dirname, 'uploads')));


app.options('*', cors(corsOptions));


app.use(express.json());// Parsing des requêtes JSON

app.use(cookieParser());// Parsing des cookies

// Documentation de l'API pour générer et envoyer un token dans un cookie
/**
 * @route GET /sign-token
 * @desc Generate and send a token in a cookie
 * @access Public
 */
app.get('/sign-token', (req, res) => {
  const payload = { userId: 123 };
  const secretKey = process.env.JWT_SECRET_KEY;
  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // Désactiver temporairement pour le développement local
    sameSite: 'Strict'
  });  

  // Inspecter la création du cookie côté serveur
  console.log('Cookie créé :', res.getHeader('Set-Cookie'));

  res.json({ message: 'Token has been set in a cookie' });
});

// Définir les routes de l'application
app.use('/user', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courseSpaces', courseSpaceRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
//app.use('/api/questions', questionRoutes);
app.use('/api/learning-resource', learningResourceRoutes);
app.use('/api/chat', chatRoomRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/avis', avisRoutes);
app.use('/api/topic', topicRoutes);
app.use('/api/lesson', lessonRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/search', searchRoutes);

// Endpoint pour communiquer avec Rasa
/**
 * @route POST /send-message
 * @desc Send a message to Rasa chatbot
 * @access Public
 */
app.post('/send-message', async (req, res) => {
  const { message_text, user_id } = req.body;

  console.log(`Received message: ${message_text} from user: ${user_id}`);

  try {
    const rasaResponse = await axios.post('http://127.0.0.1:5005/webhooks/rest/webhook', {
      sender: user_id, // Use the user_id as the sender
      message: message_text
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Transform the response to match the expected format in Angular
    const transformedResponse = {
      responses: rasaResponse.data.map((msg) => ({ text: msg.text }))
    };

    res.json(transformedResponse);
  } catch (error) {
    console.error('Error sending message to Rasa:', error);
    res.status(500).json({ error: 'Failed to send message to Rasa' });
  }
});

//créer une instance de serveur HTTP
const server = http.createServer(app);
//serveur de chat 
const io = chatServer(server);
app.set('io', io);
// Démarrer le serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('WebSocket server is listening...');
});