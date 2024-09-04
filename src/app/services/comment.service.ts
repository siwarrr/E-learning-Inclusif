import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Commentaire } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl = 'http://localhost:3000/api/comment';

  constructor(private http: HttpClient) { }

  createComment(userId: string, courseId: string, text: string): Observable<Commentaire> {
    return this.http.post<Commentaire>(`${this.apiUrl}/${courseId}/comments`, { userId, courseId, text });
  }

  replyToComment(courseId: string, commentId: string, replyData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/${commentId}/reply`, replyData);
  }  

  addReactionToComment(commentId: string, reactionData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${commentId}/reactions`, reactionData);
  }  

  getComments(courseId: string): Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(`${this.apiUrl}/${courseId}`);
  }
  getReplies(commentId: string): Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(`${this.apiUrl}/replies/${commentId}`);
  }
  deleteComment(commentId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${commentId}`);
  }
  
}
