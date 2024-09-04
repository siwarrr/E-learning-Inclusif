import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Topic } from '../models/topic.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl = 'http://localhost:3000/api/courses';
  private Url = 'http://localhost:3000/api/students';
  private avisUrl = 'http://localhost:3000/api/avis';
  private UrlResource = 'http://localhost:3000/api/learning-resource';
  apiUploadUrl = environment.apiUploadUrl;

  private teacherId: string = '';
  private studentId: string = '';
  private courseToEdit: any;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.extractTeacherIdFromToken().subscribe(
      teacherId => {
        this.teacherId = teacherId;
        // Une fois que l'ID de l'enseignant est extrait, vous pouvez appeler la méthode getTeacherCourses
        this.getTeacherCourses(this.teacherId);
      },
      error => {
        console.error('Error extracting teacher ID:', error);
      }
    );

    this.authService.extractStudentIdFromToken().subscribe(
      studentId => {
        this.studentId = studentId;
        // Une fois que l'ID de l'apprenant est extrait, vous pouvez appeler la méthode getTeacherCourses
        this.getEnrolledCourses(this.studentId);
      },
      error => {
        console.error('Error extracting student ID:', error);
      }
    );
   }

  getTeacherCourses(teacherId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/teacher/${teacherId}`);
  }
  
  getTeacherNameByCourseId(courseId: string): Observable<any> {
    return this.http.get<{ teacherName: string }>(`${this.apiUrl}/courses/${courseId}/teacher-name`);
  }
  
  registerForCourse(courseId: string, userId: string): Observable<any> {
    const body = { courseId, userId };
    return this.http.post<any>('http://localhost:3000/api/courses/' + courseId + '/register', body);
}

getEnrolledStudents(courseId: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${courseId}/students`);
}
  

  createCourse(courseData: any): Observable<any> {
    console.log('Données du cours avant envoi au backend :', courseData); // Ajoutez ce console.log() pour vérifier les données
    return this.http.post<any>('http://localhost:3000/api/courses/submit-form', courseData);
  }
  updateCourseSections(courseId: string, sectionData: any): Observable<any> {
    // Construisez l'URL pour l'API d'update des sections du cours
    const url = `${this.apiUrl}/${courseId}/update-sections`;

    // Faites la requête HTTP POST pour mettre à jour les sections du cours
    return this.http.put<any>(url, { courseId, sectionData }
      
    ).pipe(
        catchError((error: any) => {
            console.error('Error updating course sections:', error);
            return throwError('Unable to update course sections. Please try again later.');
        })
    );
}
  getCourseById(courseId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${courseId}`);
  }
  updateCourse(courseId: string, formData: any): Observable<any> {
    const updateUrl = `${this.apiUrl}/${courseId}/update`; // URL de mise à jour du cours
    return this.http.put<any>(updateUrl, formData); // Utilisation de la méthode HTTP PUT pour la mise à jour
  }
  deleteCourse(courseId: string): Observable<any> {
    const deleteUrl = `${this.apiUrl}/courses/${courseId}`; // URL de suppression du cours
    return this.http.delete<any>(deleteUrl); // Utilisation de la méthode HTTP DELETE pour la suppression
  }
  getCourseSections(courseId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${courseId}/sections`);
  }
  setCourseToEdit(course: any): void {
    this.courseToEdit = course;
  }

  getCourseToEdit(): any {
    return this.courseToEdit;
  }
  getInitialVideo(courseId: string): Observable<any> {
    return this.http.get<any>(`/api/courses/${courseId}/initialVideo`);
  }
  
getEnrolledCourses(studentId: string): Observable<any> {
  return this.http.get<any>(`${this.Url}/${studentId}/courses`).pipe(
    catchError((error: any) => {
      console.error('Error fetching enrolled courses:', error);
      return throwError('Unable to fetch enrolled courses. Please try again later.');
    })
  );
}
getQuizScoresForCourse(courseId: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/${courseId}/quizzes`);
}
addAvisToCourse(courseId: string, userId: string, stars: string, tooltip: string): Observable<any> {
  const url = `${this.avisUrl}/${courseId}`;
  const body = { courseId, userId, stars, tooltip };
  return this.http.post<any>(url, body);
}

// Nouvelle méthode pour obtenir le total des avis
getTotalReviews(courseId: string): Observable<any> {
  return this.http.get<any>(`${this.avisUrl}/${courseId}/reviews`).pipe(
    catchError((error: any) => {
      console.error('Error fetching total reviews:', error);
      return throwError('Unable to fetch total reviews. Please try again later.');
    })
  );
}
getStarVotes(courseId: string): Observable<number[]> {
  return this.http.get<number[]>(`${this.avisUrl}/${courseId}/star-ratings`).pipe(
    catchError((error: any) => {
      console.error('Error fetching star votes:', error);
      return throwError('Unable to fetch star votes. Please try again later.');
    })
  );
}
getPopularCourses(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/popular`).pipe(
    catchError((error: any) => {
      console.error('Error fetching popular courses:', error);
      return throwError('Unable to fetch popular courses. Please try again later.');
    })
  );
}
getStudentQuizScores(courseId: string, studentId: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/quiz-scores/${courseId}/${studentId}`);
}
getStudentProgress(courseId: string, studentId: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/progress/${courseId}/${studentId}`);
}
/*addResourceToCourse(courseId: string, resource: any): Observable<any> {
  console.log('Adding resource to course:', courseId, resource);

  const url = `${this.UrlResource}/${courseId}/resources`; // Ajoutez sectionId à l'URL
  return this.http.post<any>(url, resource).pipe(
    tap(
      (response) => {

        console.log('Response from adding resource to section:', response);
      },
      (error) => {
        console.error('Error adding resource to section:', error);
      }
    )
  );
}*/




/*getCurrentCourseId(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}`);
}*/

}

