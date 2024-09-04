import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lesson } from '../models/lesson.model';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  private apiUrl = 'http://localhost:3000/api/lesson';

  constructor(private http: HttpClient) { }
  
  createLesson(topicId: string, lessonData: any): Observable<Lesson> {
    return this.http.post<Lesson>(`${this.apiUrl}/${topicId}/lessons`, lessonData);
  }
  getLessonById(topicId: string, lessonId: string): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.apiUrl}/${topicId}/${lessonId}`);
  }
  updateLesson(topicId: string, lessonId: string, lessonData: any): Observable<Lesson> {
    return this.http.post<Lesson>(`${this.apiUrl}/${topicId}/${lessonId}`, lessonData);
  }
  markLessonCompleted(studentId: string, lessonId: string, watchedDuration: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/completed`, { studentId, lessonId, watchedDuration });
  }
  deleteLesson(topicId: string, lessonId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${topicId}/${lessonId}`);
  }
}
