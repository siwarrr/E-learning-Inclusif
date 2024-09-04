import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CourseSpace } from '../models/course-space.model'
import { Observable, catchError, tap } from 'rxjs';
import { Course } from '../models/course.model';


@Injectable({
  providedIn: 'root'
})
export class CourseSpaceService {
  getCourseSpaceById(_id: string | null): Observable<CourseSpace> {
    return this.http.get<CourseSpace>(this.apiUrl)
    .pipe(
      tap(data => console.log('Course space retrieved:', data)),
      catchError(error => {
        console.error('Error fetching course space:', error);
        throw error;
      })
    );  }

  private apiUrl = 'http://localhost:3000/api/courseSpaces';

  constructor(private http: HttpClient) { }

  getAllCourseSpaces(): Observable<CourseSpace[]> {
    return this.http.get<CourseSpace[]>(this.apiUrl)
      .pipe(
        tap(data => console.log('Course spaces retrieved:', data)),
        catchError(error => {
          console.error('Error fetching course spaces:', error);
          throw error;
        })
      );
  }
  // Méthode pour récupérer tous les cours dans un espace de cours spécifié
  getAllCoursesInSpace(spaceId: string): Observable<Course[]> {
    const url = `${this.apiUrl}/${spaceId}/courses`;
    return this.http.get<Course[]>(url)
      .pipe(
        tap(data => console.log('Courses in space retrieved:', data)),
        catchError(error => {
          console.error('Error fetching courses in space:', error);
          throw error;
        })
      );
  }
}
