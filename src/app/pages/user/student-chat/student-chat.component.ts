import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'src/app/models/message.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { ChatComponent } from '../../shared/chat/chat.component';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-student-chat',
  templateUrl: './student-chat.component.html',
  styleUrls: ['./student-chat.component.css']
})
export class StudentChatComponent implements OnInit{
  @Output() openChat: EventEmitter<string> = new EventEmitter<string>();

  showChatRoom: boolean = false;
  @ViewChild(ChatComponent) chatComponent!: ChatComponent; // Déclaration de la référence à ChatComponent

  teachers: any[] = [];
  userId: string = '';

  messages: Message[] = [];
  messageText: string = '';
  senderId: string = '';
  receiverId: string = '';
  chatId: string = '';

  onlineUsers: Set<string> = new Set(); // Suivre les utilisateurs en ligne
  unreadMessagesCountByUser: { [key: string]: number } = {};

  constructor(private router: Router,
              private chatService: ChatService,
              private authService: AuthService,
              private cdr: ChangeDetectorRef
            ) {}

  private socket!: Socket;

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      (user: any) => {
        console.log('Current user:', user);
        if (user && user._id) {
          this.userId = user._id;
          console.log('User ID:', this.userId);
          this.initializeSocketConnection(); // Initialiser la connexion socket
          this.getTeachers();
          this.getUnreadMessagesCountByUser();
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
    this.socket = io('http://localhost:3000', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.socket.emit('login', this.userId);
    });

    this.socket.on('userOnline', (userId: string) => {
      this.onlineUsers.add(userId);
    });

    this.socket.on('userOffline', (userId: string) => {
      this.onlineUsers.delete(userId);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('WebSocket connection error:', error);
    });

    this.socket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
    });
  }

  isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId);
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
  getUnreadMessagesCountByUser(): void {
    console.log("Calling getUnreadMessagesCountByUser");
    this.chatService.getUnreadMessagesCountByUser(this.userId).subscribe(
      (data: any) => {
        console.log("Data received from API:", data);
        this.unreadMessagesCountByUser = data;
        console.log("Unread messages count after assignment:", this.unreadMessagesCountByUser);
        this.cdr.markForCheck(); 
      },
      (error: any) => {
        console.error('Error fetching unread messages count by user:', error);
      }
    );
  }
  

  getUnreadMessageCountForTeacher(teacherId: string): number {
    return this.unreadMessagesCountByUser[teacherId] || 0;
  }

  hasUnreadMessages(teacherId: string): boolean {
    return this.getUnreadMessageCountForTeacher(teacherId) > 0;
  }

  resetUnreadMessagesCount(teacherId: string): void {
    if (this.unreadMessagesCountByUser[teacherId]) {
      this.unreadMessagesCountByUser[teacherId] = 0;
      this.cdr.markForCheck();
    }
  }
  getTeachers(): void {
    if (this.userId) {
      this.chatService.getListTeachers(this.userId).subscribe(
        (data: any[]) => {
          const uniqueTeachers = new Set();
          data.forEach(teacher => {
            uniqueTeachers.add(teacher._id);
          });

          this.teachers = Array.from(uniqueTeachers).map(teacherId => {
            return data.find(teacher => teacher._id === teacherId);
          });
        },
        (error: any) => {
          console.error('Error fetching teachers list:', error);
        }
      );
    } else {
      console.error('Student ID not found or invalid');
    }
  }
  openChatRoomWithTeacher(teacherId: string): void {
    // Ouvrir la fenêtre de chat avec l'enseignant sélectionné en appelant une méthode dans ChatComponent
    this.chatComponent.openChatWindowWithTeacher(teacherId);
    this.resetUnreadMessagesCount(teacherId);
  }
/*  createChatRoomWithTeacher(teacherId: string) {
    // Assurez-vous que l'ID de l'utilisateur est correctement récupéré avant de créer la salle de chat
    if (!this.userId) {
      console.error('User ID not found');
      return;
    }

    // Appel à la méthode de création de salle de chat du service Chat
    this.chatService.createChatRoom(this.userId, teacherId).subscribe(
      (response) => {
        
        console.log('Chat room created successfully:', response);
        // Traitez la réponse de l'API en conséquence
        const chatId = response._id; // Assurez-vous de récupérer l'ID de la salle de chat à partir de la réponse de l'API
        if (chatId) {
          // Utilisez l'ID de la salle de chat
          console.log('Chat ID:', chatId);
        } else {
          console.error('Chat ID not found !!!!!!!!!!!!!!!!!!!!!!corriger pourquoi pas trouvé l\'id de chat !');
        }
      },
      (error) => {
        console.error('Error creating chat room:', error);
        // Gérez les erreurs d'API ici
      }
    );
  }
  sendMessage(): void {
    if (this.messageText.trim() !== '') {
      this.chatService.createMessage(this.chatId, this.messageText.trim()).subscribe(
        () => {
          this.messageText = '';
          this.getMessages(); // Récupérer les messages après l'envoi d'un nouveau message
        },
        error => {
          console.error('Error sending message:', error);
        }
      );
    }
  }

  getMessages(): void {
    // Vérifier que chatId est défini avant de récupérer les messages
    if (this.chatId) {
      this.chatService.getMessages(this.chatId, this.senderId).subscribe(
        (response: Message[]) => {
          this.messages = response;
          console.log('Received messages:', this.messages);
        },
        error => {
          console.error('Error getting messages:', error);
        }
      );
    } else {
      console.error('Chat ID not found');
    }
  }*/
}