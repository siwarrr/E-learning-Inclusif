import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CourseSpaceService } from 'src/app/services/course-space.service';
import { CourseService } from 'src/app/services/course.service'
@Component({
  selector: 'app-teacher-course',
  templateUrl: './teacher-course.component.html',
  styleUrls: ['./teacher-course.component.css']
})
export class TeacherCourseComponent implements OnInit{
  visible = false;
  formData: any = {};
  errorMessage: string = '';
  courseSpaces: any[] = [];
  fileList: any[] = [];
  userId: string = '';
  fullname: string = '';

  constructor(private router: Router, 
              private courseService: CourseService, 
              private courseSpaceService: CourseSpaceService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.getCourseSpaces(); 
    this.authService.getCurrentUser().subscribe(
      (user: any) => {
        console.log('Current user:', user);
        if (user && user._id) {
          this.userId = user._id;
          console.log('User ID:', this.userId);
          this.getUserName(this.userId);
        } else {
          console.error('User ID not found');
        }
      },
      (error: any) => {
        console.error('Error getting current user:', error);
      }
    );
  }

  getUserName(userId: string): void {
    this.authService.getCurrentUser().subscribe(
      (response: any) => {
        this.fullname = response.fullname; // Modifier l'accès à la propriété fullname
        console.log("User Name:", this.fullname);
      },
      (error: any) => {
        console.error('Error getting receiver name:', error);
      }
    );
  }
  // Méthode pour charger les espaces de cours disponibles
  getCourseSpaces(): void {
    this.courseSpaceService.getAllCourseSpaces().subscribe(
      response => {
        this.courseSpaces = response; // Stockez les espaces de cours dans la propriété
      },
      error => {
        console.error('Error fetching course spaces:', error);
      }
    );
  }

  submitForm(courseData: any) {
    // Récupérez l'identifiant ObjectId de l'espace de cours sélectionné
    const selectedSpace = this.courseSpaces.find(space => space.title === courseData.courseSpace);
    if (selectedSpace) {
      courseData.courseSpace = selectedSpace._id; // Utilisez l'identifiant ObjectId pour le champ courseSpace
    }

    this.courseService.createCourse(courseData).subscribe(
      response => {
        console.log('Course created successfully:', response);
        // Traiter la réponse de création de cours
        this.router.navigate(['/teacher/courses']);
      },
      error => {
        console.error('Error creating course:', error);
        // Gérer les erreurs de création de cours
      }
    );
  }
  handleChange(info: any): void {
    let fileList = [...info.fileList];

    // Gérez les modifications de la liste des fichiers téléchargés ici

    this.fileList = fileList;
  }
  navigateToAddCourse(): void {
    this.router.navigate(['/teacher/addCourse']); // Naviguer vers la route 'addCourse'
  }
}