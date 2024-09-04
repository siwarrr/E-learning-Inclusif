const socketIo = require('socket.io');
/**
 * Initialise le serveur de chat avec Socket.io
 * @param {Object} server - Instance du serveur HTTP
 * @returns {Object} io - Instance de Socket.io
 */
function chatServer(server) {
    const io = socketIo(server, {
        cors: {
            origin: 'http://localhost:4200',
            methods: ['GET', 'POST'],
            credentials: true
        },
        transports: ['websocket', 'polling']
    });

    // Object pour stocker les utilisateurs connectés
    const connectedUsers = {};

    // Gestion des événements de connexion
    io.on('connection', (socket) => {
        console.log('Nouvelle connexion WebSocket:', socket.id);

        /**
         * Événement de login
         * @param {string} userId - ID de l'utilisateur connecté
         */
        socket.on('login', (userId) => {
            console.log('Utilisateur connecté:', userId);
            connectedUsers[userId] = socket;
            io.emit('userOnline', userId);
        });

        /**
         * Événement de message
         * @param {Object} messageData - Données du message
         * @param {string} messageData.senderId - ID de l'expéditeur
         * @param {string} messageData.receiverId - ID du destinataire
         * @param {string} messageData.chatId - ID du chat
         * @param {string} messageData.text - Texte du message
         * @param {string} [messageData.voiceMessageUrl] - URL du message vocal
         */
        socket.on('message', ({ senderId, receiverId, chatId, text, voiceMessageUrl }) => {
            console.log(`Message reçu de ${senderId} à ${receiverId}: ${text}`);
            const recipientSocket = connectedUsers[receiverId];
            if (recipientSocket) {
                recipientSocket.emit('message', { senderId, chatId, text, voiceMessageUrl });
            } else {
                // Gérer le cas où l'utilisateur est déconnecté
                saveUnreadMessage(receiverId, { senderId, chatId, text, voiceMessageUrl });
            }
        });

        // Gestion des événements de déconnexion
        socket.on('disconnect', () => {
            console.log('Déconnexion WebSocket:', socket.id);
            for (const userId in connectedUsers) {
                if (connectedUsers[userId] === socket) {
                    delete connectedUsers[userId];
                    io.emit('userOffline', userId);
                    console.log(`Utilisateur ${userId} déconnecté!`);
                    break;
                }
            }
        });
        
        // Gestion des erreurs de connexion
        socket.on('connect_error', (err) => {
            console.error('Erreur de connexion WebSocket:', err.message);
        });

        // Gestion des erreurs générales
        socket.on('error', (err) => {
            console.error('Erreur WebSocket:', err.message);
        });
    });

    return io;
}

module.exports = chatServer;


/*const socketIo = require('socket.io');

function chatServer(server) {
    const io = socketIo(server);

    //stockage des sockets des utilisateurs connectés
    const connectedUsers = {};

    io.on('connection', (socket) => {
        console.log('Nouvelle connexion WebSocket:', socket.id);

        //gestion de la connexion d'un utilisateur
        socket.on('login', (userId) => {
            console.log('Utilisateur connecté:', userId);
            connectedUsers[userId] = socket;
        });

        //gestion des messages entrants
        socket.on('message', ({senderId, recipientId, message}) => {
            console.log(`Message reçu de ${senderId} à ${recipientId}: ${message}`);
            const recipientSocket = connectedUsers[recipientId];
            if (recipientSocket) {
                recipientSocket.emit('message', { senderId, message});
            }else {
                console.log(`Utilisateur ${recipientId} non trouvé! `);
            }
            //diffuser le message à tous les clients connectés
        });

        //gestion de la déconnexion
        socket.on('disconnect', () => {
            console.log('Déconnexion WebSocket:', socket.id);
            //supprimer l'utilisateur de la liste des utilisateurs connectés
            for (const userId in connectedUsers) {
                if(connectedUsers[userId] === socket) {
                    delete connectedUsers[userId];
                    console.log(`Utilisateur ${userId} déconnecté !`);
                    break;
                }
            }
        });
    });
}

module.exports = chatServer;*/