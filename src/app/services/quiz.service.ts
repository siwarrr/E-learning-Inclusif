import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Quiz } from '../models/quiz.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:3000/api/quizzes';

  constructor(private http: HttpClient) { }

  createQuiz(topicId: string, quizData: any) {
    return this.http.post(`/api/quizzes/${topicId}/quiz`, quizData);
  }
  getQuizById(topicId: string, quizId: string): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/${topicId}/${quizId}`);
  }
  updateQuiz(topicId: string, quizId: string, quizData: any): Observable<Quiz> {
    return this.http.post<Quiz>(`${this.apiUrl}/${topicId}/${quizId}`, quizData);
  }
  getQuestionsByQuizId(topicId: string, quizId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${topicId}/${quizId}/questions`);
  }  
  getNumberOfQuestionsInQuiz(topicId: string, quizId: string): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/${topicId}/${quizId}/quiz`);
  }

  submitQuiz(quizId: string, studentId: string, answers: string[]): Observable<any> {
    const body = { quizId: quizId, studentId: studentId, answers: answers };
    return this.http.post<any>(`${this.apiUrl}/submit`, body);
  }
  deleteQuiz(topicId: string,quizId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${topicId}/${quizId}`);
  }
}
