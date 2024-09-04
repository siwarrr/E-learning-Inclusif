import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reclamation } from '../models/reclam.model';

@Injectable({
  providedIn: 'root'
})
export class AdminApisService {
  
  private url = 'http://127.0.0.1:3000/api/admins';

  constructor(private http: HttpClient) { }

  getListTeachers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/teachers`);
  }

  getCoursesCountByTeacher(teacherId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/teachers/${teacherId}/courses`);
  }
  getListLearners(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/learners`);
  }
  getLearnersCoursesCount(): Observable<any> {
    return this.http.get<any>(`${this.url}/learners/courses`);
  }
  deleteTeacher(teacherId: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/teachers/${teacherId}`);
  }
  deleteLearner(studentId: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/learners/${studentId}`);
  }
  deleteCourse(courseId: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/courses/${courseId}`);
  }
  getPlatformStatistics(): Observable<any> {
    return this.http.get<any>(`${this.url}/statistics`);
  }
  getAllReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.url}/reclamations`);
  }
  respondToReclamation(reclamationId: string, response: string): Observable<any> {
    const body = { response };
    return this.http.post<any>(`${this.url}/reclamations/${reclamationId}/respond`, body);
  }
}
