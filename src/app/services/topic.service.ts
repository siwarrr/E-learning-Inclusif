import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Topic } from '../models/topic.model';
import { Lesson } from '../models/lesson.model';
import { Quiz } from '../models/quiz.model';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  
  private apiUrl = 'http://localhost:3000/api/topic';

  constructor(private http: HttpClient) { }

  createTopic(courseId: string, topicData: { name: string, summary: string }): Observable<any> {
    // Inclure le courseId dans le corps de la requête
    const body = {
        name: topicData.name,
        summary: topicData.summary
    };

    // Envoyer une requête POST vers le backend
    return this.http.post<any>(`${this.apiUrl}/${courseId}`, body);
}
  
  updateTopic(courseId: string, topicId: string, topicData: any): Observable<Topic> {
    return this.http.post<Topic>(`${this.apiUrl}/${courseId}/${topicId}`, topicData);
  }

  getTopicById(courseId: string, topicId: string): Observable<Topic> {
    return this.http.get<Topic>(`/${courseId}/${topicId}`);
  }

  getLessons(courseId: string, topicId: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.apiUrl}/${courseId}/${topicId}/lessons`);
  }

  getQuizzes(courseId: string, topicId: string): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.apiUrl}/${courseId}/${topicId}/quizzes`);
  }
  deleteTopic(topicId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${topicId}`);
  }
}
