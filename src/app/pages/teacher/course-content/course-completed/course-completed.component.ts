import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Topic } from 'src/app/models/topic.model';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/course.service';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-course-completed',
  templateUrl: './course-completed.component.html',
  styleUrls: ['./course-completed.component.css']
})
export class CourseCompletedComponent implements OnInit{

  userId: string = '';
  fullname: string = '';
  courseId: string = '';
  title: string = '';
  isVisible = false;
  quizResults: any[] = [];
  loadingResults: boolean = false;
  error: string | null = null;
  sections: Topic[] = [];
  quizzes: any[] = []; // Initialisez quizzes à un tableau vide

  constructor (private authService: AuthService,
               private courseService: CourseService,
               private route: ActivatedRoute,
               private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = params['courseId'];
      this.getCourse(this.courseId);
      this.courseService.getCourseSections(this.courseId).subscribe(
        (sections) => {
          this.sections = sections;
  
          // Extraire les quizzes de chaque section et les stocker dans this.quizzes
          this.sections.forEach(section => {
            this.quizzes.push(...section.quizzes);
          });
  
          console.log('Quizzes du cours:', this.quizzes);
        },
        (error) => {
          console.error('Erreur lors de la récupération des sections du cours:', error);
        }
      );
    });
    this.authService.getCurrentUser().subscribe(
      (user: any) => {
        console.log('Current user:', user);
        if (user && user._id) {
          this.userId = user._id;
          console.log('User ID:', this.userId);
          this.getUserName(this.userId);
          this.getStudentQuizScores(this.courseId, this.userId);
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
  getCourse(courseId: string): void {
    this.courseService.getCourseById(courseId).subscribe(
      (response: any) => {
        this.title = response.title; // Modifier l'accès à la propriété fullname
        console.log("course title:", this.title);
      },
      (error: any) => {
        console.error('Error getting receiver title:', error);
      }
    );
  }
  getStudentQuizScores(courseId: string, studentId: string): void {
    this.loadingResults = true;
    this.courseService.getStudentQuizScores(courseId, studentId).subscribe(
      (results: any) => {
        this.quizResults = results;
        this.loadingResults = false;
        console.log('Quiz results:', this.quizResults);
      },
      (error: any) => {
        this.error = 'Error fetching quiz results';
        this.loadingResults = false;
        console.error('Error fetching quiz results:', error);
      }
    );
  }
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  return(){
    this.router.navigate(['learner/course-content', this.courseId]);
  }


}
