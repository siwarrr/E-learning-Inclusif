import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { User } from '../models/user.model';
import { CourseSpace } from '../models/course-space.model';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private apiUrl = 'http://localhost:3000/api/courseSpaces';

  constructor(private http: HttpClient) { }

  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`http://localhost:3000/api/user/${userId}`);
  }

  getCourseSpace(courseSpaceId: string): Observable<CourseSpace> {
    return this.http.get<CourseSpace>(`http://localhost:3000/api/courseSpaces/${courseSpaceId}`);
  }

  getAllCoursesInSpace(spaceId: string): Observable<Course[]> {
    return this.http.get<Course[]>(`http://localhost:3000/api/courseSpaces/${spaceId}`).pipe(
      catchError((error: any) => {
        console.error('An error occurred:', error);
        throw error; // Rethrow the error or return a default value
      })
    );
  }
}