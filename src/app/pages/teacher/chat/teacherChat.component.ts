import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'src/app/models/message.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { ChatComponent } from '../../shared/chat/chat.component';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-teacher-chat',
  templateUrl: './teacherChat.component.html',
  styleUrls: ['./teacherChat.component.css']
})
export class TeacherChatComponent implements OnInit{
  
  showChatRoom: boolean = false;
  @ViewChild(ChatComponent) chatComponent!: ChatComponent; // Déclaration de la référence à ChatComponent

  students: any[] = [];
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
        console.log('Current user:', user); // Vérifier les données de l'utilisateur
        if (user && user._id) {
          this.userId = user._id; // Assigner l'ID de l'utilisateur
          console.log('User ID:', this.userId); // Vérifier l'ID de l'utilisateur
          this.initializeSocketConnection(); // Initialiser la connexion socket
          this.getStudents(); // Appeler getStudents une fois que l'ID est récupéré
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
    this.socket.on('message', (message: Message) => {
      console.log('Message received:', message);
      this.messages.push(message);
  });

  this.socket.on('voiceMessage', (message: Message) => {
      console.log('Voice message received:', message);
      this.messages.push(message);
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
  

  getUnreadMessageCountForStudent(studentId: string): number {
    return this.unreadMessagesCountByUser[studentId] || 0;
  }

  hasUnreadMessages(studentId: string): boolean {
    return this.getUnreadMessageCountForStudent(studentId) > 0;
  }

  resetUnreadMessagesCount(studentId: string): void {
    if (this.unreadMessagesCountByUser[studentId]) {
      this.unreadMessagesCountByUser[studentId] = 0;
      this.cdr.markForCheck();
    }
  }
  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  getStudents(): void {
    if (this.userId) { // Vérifier si l'ID de l'utilisateur est défini
      this.chatService.getEnrolledStudents(this.userId).subscribe(
        (data: any[]) => {
          const uniqueStudents = new Set();
          data.forEach(student => {
            uniqueStudents.add(student._id); // Ajouter l'ID de l'étudiant à l'ensemble
          });
  
          this.students = Array.from(uniqueStudents).map(studentId => {
            return data.find(student => student._id === studentId);
          });
        },
        (error: any) => {
          console.error('Error fetching enrolled students:', error);
        }
      );
    } else {
      console.error('Teacher ID not found or invalid');
    }
  }

  openChatRoomWithStudent(studentId: string): void {
    this.chatComponent.openChatWindowWithStudent(studentId);
    this.resetUnreadMessagesCount(studentId);
  }











  
// Méthode pour ouvrir une chatroom avec un utilisateur donné
/*openChatRoom(studentId: string): void {
  const teacherId = this.userId;
  if (studentId) {
    this.chatService.createChatRoom(teacherId, studentId).subscribe(
      (chatRoom: any) => {
        console.log('Chat room created:', chatRoom);
        if (chatRoom && chatRoom._id) {
          this.router.navigate(['/teacher/chat/room', chatRoom._id]);
        } else {
          console.error('Chat room ID not found');
        }
      },
      (error: any) => {
        console.error('Error creating chat room:', error);
      }
    );
  } else {
    console.error('teacher ID not found or invalid');
  }
  this.openChat.emit(studentId);
  }  
     // Méthode pour afficher le chat room
     onOpenChatRoom(studentId: string): void {
      // Afficher le chat room
      this.showChatRoom = true;
  }*/


}





