import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'src/app/models/message.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  showChatWindow: boolean = false;
  @Output() openChat: EventEmitter<string> = new EventEmitter<string>();

  students: any[] = [];
  teachers: any[] = [];
  userId: string = '';
  receiverName: string = '';

  messages: Message[] = [];
  messageText: string = '';
  senderId: string = '';
  receiverId: string = '';
  chatId: string = '';
  yourEmojiSet: any;
  showEmojiPicker: boolean = false;
  audioFile: File | null = null; 
  isRecording: boolean = false;
  mediaRecorder: any;
  audioChunks: any[] = [];
  baseUrl: string = 'http://localhost:3000'
  isContactSelected: boolean = false; 
  private socket!: Socket;

  constructor(private router: Router,
              private chatService: ChatService,
              private authService: AuthService) {
    this.yourEmojiSet = 'apple';
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      (user: any) => {
        console.log('Current user:', user); // Vérifier les données de l'utilisateur
        if (user && user._id) {
          this.userId = user._id; // Assigner l'ID de l'utilisateur
          console.log('User ID:', this.userId); // Vérifier l'ID de l'utilisateur
          this.initializeSocketConnection(); // Initialiser la connexion socket après avoir récupéré l'utilisateur
        } else {
          console.error('User ID not found');
        }
      },
      (error: any) => {
        console.error('Error getting current user:', error);
      }
    );
  }
  initializeSocketConnection(): void {
    console.log('Initializing socket connection...');
    this.socket = io(this.baseUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.socket.emit('login', this.userId);
    });

    this.socket.on('message', (message: any) => {
      if (message.receiverId === this.userId && message.chatId === this.chatId) {
        console.log('Message received:', message);
        this.messages.push(message);
        this.markMessagesAsRead();
      }
    });

    this.socket.on('voiceMessage', (message: any) => {
      if (message.receiverId === this.userId && message.chatId === this.chatId) {
        console.log('Voice message received:', message);
        this.messages.push(message);
        this.markMessagesAsRead();
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
    this.socket.on('connect_error', (error: any) => {});
    this.socket.on('error', (error: any) => {});
  }

  markMessagesAsRead(): void {
    if (this.chatId && this.userId) {
      this.chatService.markMessagesAsRead(this.chatId, this.userId).subscribe(
        (response) => {
          console.log('Messages marked as read:', response);
        },
        (error) => {
          console.error('Error marking messages as read:', error);
        }
      );
    }
  }

  openChatWindowWithStudent(studentId: string): void {
    // Appelez la méthode pour créer une nouvelle salle de chat entre le professeur et l'étudiant
    this.chatService.createChat(this.userId, studentId).subscribe(
      (chatRoom: any) => {
        // Vérifiez si la salle de chat a été créée avec succès
        if (chatRoom && chatRoom._id) {
          // Récupérez l'ID de la salle de chat créée
          const chatId = chatRoom._id;
  
          // Mettez à jour les propriétés nécessaires pour afficher la fenêtre de chat
          this.chatId = chatId;
          this.showChatWindow = true;
          console.log('user ID:', this.userId); 
          console.log('student ID:', studentId); 

          this.isContactSelected = true; 
          this.getReceiverName(studentId);

          // Mettez à jour les autres informations nécessaires, par exemple, l'ID du destinataire
          // this.receiverId = studentId;
  
          // Récupérez les messages associés à cette salle de chat
          this.getMessages();
        } else {
          console.error('Chat room ID not found');
        }
      },
      (error: any) => {
        console.error('Error creating chat room:', error);
      }
    );
  }
  openChatWindowWithTeacher(teacherId: string): void{
  // Appelez la méthode pour créer une nouvelle salle de chat entre le professeur et l'étudiant
  this.chatService.createChat(this.userId, teacherId).subscribe(
    (chatRoom: any) => {
      // Vérifiez si la salle de chat a été créée avec succès
      if (chatRoom && chatRoom._id) {
        // Récupérez l'ID de la salle de chat créée
        const chatId = chatRoom._id;

        // Mettez à jour les propriétés nécessaires pour afficher la fenêtre de chat
        this.chatId = chatId;
        console.log('user ID:', this.userId); 
        console.log('teacher ID:', teacherId); 
        this.getReceiverName(teacherId);

        // Mettez à jour les autres informations nécessaires, par exemple, l'ID du destinataire
        // this.receiverId = studentId;
        this.isContactSelected = true; // Mettez à jour cette propriété
        // Récupérez les messages associés à cette salle de chat
        this.getMessages();
      } else {
        console.error('Chat room ID not found');
      }
    },
    (error: any) => {
      console.error('Error creating chat room:', error);
    }
  );
  }
  getReceiverName(receiverId: string): void {
    this.chatService.getReceiverInfo(receiverId).subscribe(
      (response: any) => {
        this.receiverName = response.fullname; // Assignez le nom du receiver à la variable receiverName
      },
      (error: any) => {
        console.error('Error getting receiver name:', error);
      }
    );
  }

sendMessage(): void {
  if (this.messageText.trim() !== '') {
    this.chatService.createMessage(this.chatId, this.userId, this.messageText.trim()).subscribe(
      () => {
        this.messageText = '';
        this.getMessages();
      },
      error => {
        console.error('Error sending message:', error);
      }
    );
  }
}

addEmoji(event: any) {
  this.messageText += event.emoji.native;
}

toggleEmojiPicker(): void {
  this.showEmojiPicker = !this.showEmojiPicker;
}
getMessages(): void {
  // Récupérer l'ID de la conversation (chatId)
  // Puis appeler la méthode getMessages du service ChatService en passant chatId et senderId
  this.chatService.getMessages(this.chatId, this.senderId).subscribe(
    (response: Message[]) => {
      this.messages = response;
      console.log('Received messages:', this.messages);
      this.markMessagesAsRead();
    },
    error => {
      console.error('Error getting messages:', error);
    }
  );
}

// Méthode pour démarrer l'enregistrement audio
startRecording(): void {
  // Vérifie si le navigateur prend en charge l'accès au microphone
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Demande l'accès au microphone de l'utilisateur
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      // Initialise MediaRecorder pour enregistrer le flux audio du microphone
      this.mediaRecorder = new MediaRecorder(stream);
      this.isRecording = true; // Indique que l'enregistrement est en cours

      // Capture les chunks de données audio lorsque ceux-ci sont disponibles
      this.mediaRecorder.ondataavailable = (event: any) => {
        this.audioChunks.push(event.data); // Stocke chaque chunk dans un tableau
      };

      // Actions à effectuer lorsque l'enregistrement est arrêté
      this.mediaRecorder.onstop = () => {
        // Combine les chunks audio en un seul Blob (fichier audio)
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        
        // Envoie le fichier audio au serveur
        this.sendAudioMessage(audioBlob);
        
        // Réinitialise le tableau des chunks pour le prochain enregistrement
        this.audioChunks = [];
      };

      // Démarre l'enregistrement audio
      this.mediaRecorder.start();
    }).catch(error => {
      // Gère les erreurs en cas de problème avec l'accès au microphone
      console.error('Error accessing microphone:', error);
    });
  }
}

// Méthode pour arrêter l'enregistrement audio
stopRecording(): void {
  // Vérifie si l'enregistrement est en cours
  if (this.mediaRecorder) {
    // Arrête l'enregistrement
    this.mediaRecorder.stop();
    this.isRecording = false; // Indique que l'enregistrement est terminé
  }
}

// Méthode pour envoyer le fichier audio au serveur
sendAudioMessage(audioBlob: Blob): void {
  // Utilise le service de chat pour télécharger le message vocal
  this.chatService.uploadVoiceMessage(this.chatId, this.userId, audioBlob).subscribe(
    () => {
      // Rafraîchit la liste des messages après l'envoi réussi du message vocal
      this.getMessages();
    },
    error => {
      // Gère les erreurs lors de l'envoi du message vocal
      console.error('Error sending audio message:', error);
    }
  );
}

// Méthode pour lire un message vocal
playVoiceMessage(url: string): void {
  // Crée un nouvel objet Audio avec l'URL du fichier audio
  const audio = new Audio(url);
  
  // Joue le fichier audio
  audio.play();
}

}





