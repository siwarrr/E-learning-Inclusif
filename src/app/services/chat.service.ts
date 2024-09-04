import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private Url = 'http://localhost:3000/api';
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient,
              private authService: AuthService) { }

              
  createChat(firstId: string, secondId: string): Observable<any> {
    const body = { firstId, secondId };
    return this.http.post<any>(`${this.Url}/chat`, body);
  }
  findUserChats(userId: string): Observable<any> {
    return this.http.get(`${this.Url}/chat/user/${userId}`);
  }

  findChats(firstId: string, secondId: string): Observable<any> {
    return this.http.get(`${this.Url}/chat/${firstId}/${secondId}`);
  }
  getReceiverInfo(receiverId: string) {
    return this.http.get<any>(`${this.Url}/chat/receiver/${receiverId}`); 
  }
  createMessage(chatId: string, senderId: string, text: string): Observable<any> {
    const body = { chatId, senderId, text };
    return this.http.post<any>(`${this.Url}/message`, body);
  }
  
  getMessages(chatId: string, userId: string): Observable<any> {
    console.log('Fetching messages for chat ID:', chatId);
    return this.http.get(`${this.Url}/message/${chatId}`);
  }  

  getEnrolledStudents(teacherId: string): Observable<any> {
    return this.http.get(`${this.Url}/teachers/${teacherId}/students`);
  }

  getListTeachers(studentId: string): Observable<any> {
    return this.http.get(`${this.Url}/students/${studentId}/teachers`);
  }

  uploadVoiceMessage(chatId: string, senderId: string, audioBlob: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('chatId', chatId);
    formData.append('senderId', senderId);
    formData.append('audio', audioBlob, 'voiceMessage.webm');
  
    return this.http.post<any>(`${this.baseUrl}/api/message/upload`, formData, {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    }).pipe(
      catchError(this.handleError)
    );
  }  

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  getUnreadMessagesCountByUser(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/chat/message/unread/count/${userId}`);
  }
  
  countUnreadMessagesForChatRoom(chatId: string, userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/message/unread/count/${userId}`);
  }   
  markMessagesAsRead(chatId: string, userId: string): Observable<any> {
    return this.http.post(`${this.Url}/message/markMessagesAsRead`, { chatId, userId });
  }
  
}
/*createChatRoom(studentId: string, teacherId: string): Observable<any> {
                const body = { studentId, teacherId };
                return this.http.post<any>(`${this.Url}/chat`, body, this.getHeaders()).pipe(
                  catchError(this.handleError)
                );
              }
            
              // Autres méthodes du service...
            
              private getHeaders(): { headers: HttpHeaders } {
                const token = this.authService.getToken();
                return {
                  headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                  })
                };
              }
            
              private handleError(error: HttpErrorResponse): Observable<never> {
                let errorMessage = 'An error occurred';
                if (error.error instanceof ErrorEvent) {
                  // Erreur côté client
                  errorMessage = `Error: ${error.error.message}`;
                } else {
                  // Erreur côté serveur
                  errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                }
                console.error(errorMessage);
                return throwError(errorMessage);
              }
              
    createMessage(chatId: string, text: string): Observable<any> {
    return this.authService.extractTeacherIdFromToken().pipe(
      switchMap((teacherId: string) => {
        return this.authService.extractStudentIdFromToken().pipe(
          switchMap((studentId: string) => {
            const userId = teacherId || studentId; // Utiliser l'ID de l'enseignant s'il est disponible, sinon utiliser l'ID de l'étudiant
            const data = { chatId, senderId: userId, text };
            return this.http.post<any>(`${this.Url}/message`, data).pipe(
              catchError(error => {
                console.error('Error creating message:', error);
                return throwError(error);
              })
            );
          })
        );
      })
    );
  }*/