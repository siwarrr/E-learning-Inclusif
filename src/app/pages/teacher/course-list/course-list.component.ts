import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { Course } from 'src/app/models/course.model';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit{
[x: string]: any;
  @Output() courseSelected = new EventEmitter<string>();

  loading = false;
  courses: any[] = [];
  participants: { [key: string]: any[] | undefined } = {};
  userId$!: Observable<string>; // Utilisation de l'opérateur de non-null assertion
  visible: { [key: string]: boolean } = {}; 
  size: NzButtonSize = 'small';
  courseId: string = ''; 
  teacherId: string = '';
  isLoadingParticipants = false; // Variable pour suivre si les participants sont en cours de chargement
  confirmModal?: NzModalRef; // For testing by now

  constructor(private router: Router, 
              private authService: AuthService ,
              private courseService: CourseService,
              private route: ActivatedRoute, 
              private modal: NzModalService,
            ) {}

  ngOnInit(): void {

    this.userId$ = this.authService.getCurrentUser(); // Affectez la valeur de l'observable à userId$

    // Souscrivez à l'observable pour extraire la valeur de l'ID de l'utilisateur
    this.userId$.subscribe(
      (userId: string) => {
        this.getTeacherCourses(userId); // Passez l'ID de l'utilisateur à la méthode getTeacherCourses
      },
      (error: any) => {
        console.error('Error getting current user ID:', error);
      }
    );
  }

// Méthode pour charger les cours spécifiques à l'enseignant actuellement connecté
getTeacherCourses(teacherId: string): void {
  this.courseService.getTeacherCourses(teacherId).subscribe(
    (response: Course[]) => {
      this.courses = response; // Stockez les cours dans la propriété
      this.courses.forEach(course => {
        this.participants[course._id] = course.students; // Initialisez participants avec la liste d'étudiants pour chaque cours
        this.getEnrolledStudentsList(course._id); // Vous pouvez choisir de récupérer les étudiants ici aussi, selon vos besoins
      });
    },
    (error: any) => {
      console.error('Error fetching teacher courses:', error);
    }
  );
}

getEnrolledStudentsList(courseId: string): void {
  this.isLoadingParticipants = true; // Indique que les participants sont en cours de chargement
  this.courseService.getEnrolledStudents(courseId).subscribe(
    response => {
      this.participants[courseId] = response;
      console.log('Liste des participants pour le cours ' + courseId + ':', response);
      this.isLoadingParticipants = false; // Indique que les participants ont été chargés
    },
    error => {
      console.error('Error fetching students list:', error);
      this.isLoadingParticipants = false; // Indique que les participants n'ont pas pu être chargés
    }
  );
}

open(courseId: string): void {
  this.visible[courseId] = true;
  console.log('Participants modal opened for course:', courseId);
  console.log('Participants data:', this.participants[courseId]); // Ajoutez cette ligne
  // Charger la liste des participants pour le cours spécifié
  this.getEnrolledStudentsList(courseId);
}

close(courseId: string): void {
  this.visible[courseId] = false;
}


editCourse(courseId: string): void {
  this.courseService.getCourseById(courseId).subscribe(
    course => {
      // Traitez les détails du cours récupérés, par exemple, remplissez le formulaire de modification
      console.log('Détails du cours récupérés:', course);
      // Redirigez l'utilisateur vers le formulaire de modification du cours
      this.router.navigate(['/teacher/edit-course', courseId]);
    },
    error => {
      console.error('Erreur lors de la récupération des détails du cours:', error);
      // Gérer l'erreur, par exemple, afficher un message à l'utilisateur
    }
  );
}
deleteCourse(courseId: string): void {
  this.courseService.deleteCourse(courseId).subscribe(
    () => {
      console.log('Course deleted successfully');
      // Retirer le cours supprimé de la liste des cours
      this.courses = this.courses.filter(course => course._id !== courseId);
    },
    error => {
      console.error('Error deleting course:', error);
      // Affichez un message d'erreur à l'utilisateur ou effectuez d'autres actions nécessaires en cas d'erreur
    }
  );
}
showConfirm(teacherId: string): void {
  this.confirmModal = this.modal.confirm({
    nzTitle: 'Do you Want to delete this course ?',
    nzOnOk: () =>
      new Promise<void>((resolve, reject) => {
        this.deleteCourse(teacherId);
        setTimeout(() => {
          resolve();
        }, 1000);
      }).catch(() => console.log('Oops errors!'))
  });
}
navigateToCourse(courseId: string): void {
  console.log("Navigating to course with ID:", courseId);
  this.router.navigate(['/teacher/course-content', courseId]);
}

  change(): void {
    this.loading = !this.loading;
    if (!this.loading) {
      this.courses = []; // Vide la liste des cours
    }
  }
  onSelectCourse(courseId: string) {
    console.log('Navigating to course with ID:', courseId);
    this.courseSelected.emit(courseId); // Émettez l'ID du cours sélectionné
  }
}