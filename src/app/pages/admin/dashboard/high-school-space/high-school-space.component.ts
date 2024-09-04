import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CourseSpace } from 'src/app/models/course-space.model';
import { Course } from 'src/app/models/course.model';
import { User } from 'src/app/models/user.model';
import { AdminApisService } from 'src/app/services/admin-apis.service';
import { CourseSpaceService } from 'src/app/services/course-space.service';

@Component({
  selector: 'app-high-school-space',
  templateUrl: './high-school-space.component.html',
  styleUrls: ['./high-school-space.component.css']
})
export class HighSchoolSpaceComponent implements OnInit{


  courses: Course[] = [];
  teachers: User[] = []
  courseSpaceId: string | null = null;
  initLoading = true;
  loadingMore = false;
  confirmModal?: NzModalRef; 

  highSchoolSpaceCourses: Course[] = [];
  highSchoolSpaceId: string | null = null;
  courseId: string | null = null;
  courseSpaces: CourseSpace[] = [];

  constructor(
              private courseSpaceService: CourseSpaceService,
              private adminApisService: AdminApisService,
              private modal: NzModalService,
              private msg: NzMessageService,
              private router: Router) { }


            
  ngOnInit(): void {
    this.getAllCourseSpaces();
    this.getTeacherNames();
  }
            

  getAllCourseSpaces(): void {
    this.courseSpaceService.getAllCourseSpaces()
      .subscribe(
        (courseSpaces: CourseSpace[]) => {
          // Recherche du coursespace avec le title "primary space"
          const highSchoolSpace = courseSpaces.find(space => space.title === 'High school space');
          if (highSchoolSpace) {
            this.highSchoolSpaceId = highSchoolSpace._id; 
            this.getAllCoursesInHighSchoolSpace();
          } else {
            console.error('highShool space not found.');
          }
        },
        error => {
          console.error('Error fetching course spaces:', error);
        }
      );
  }

  getAllCoursesInHighSchoolSpace(): void {
    if (this.highSchoolSpaceId) {
      this.courseSpaceService.getAllCoursesInSpace(this.highSchoolSpaceId)
        .subscribe(
          (courses: Course[]) => {
            this.highSchoolSpaceCourses = courses;
            this.getCoursesTeacherNames();
            console.log('Courses in highShool space:', courses);
          },
          error => {
            console.error('Error fetching courses in highSchool space:', error);
          }
        );
    } else {
      console.error('highSchool space ID is null.');
    }
  }

  getCoursesTeacherNames(): void {
    this.highSchoolSpaceCourses.forEach(course => {
      const teacher = this.teachers.find(teacher => teacher._id === course.teacher);
      if (teacher) {
        course.teacher = teacher.fullname; // Utilisez la propriété fullname de l'objet User pour obtenir le nom complet de l'enseignant
      }
    });
  }

  getTeacherNames(): void {
    this.adminApisService.getListTeachers() // Modifiez cette méthode pour récupérer les objets complets d'utilisateur
      .subscribe(
        (teachers: User[]) => {
          this.teachers = teachers;
        },
        error => {
          console.error('Error fetching teachers:', error);
        }
      );
  }
  
  
  onLoadMore(): void {
    // Logique pour charger plus de cours si nécessaire
  }

  more(courseId: string): void {
    this.router.navigate(['/admin/course-content', courseId])
  }
  deleteCourse(courseId: string): void {
    this.adminApisService.deleteCourse(courseId).subscribe(
      () => {
        console.log('Course deleted successfully');
        this.highSchoolSpaceCourses = this.highSchoolSpaceCourses.filter(course => course._id !== courseId);
      },
      error => {
        console.error('Error deleting course:', error);
      }
    );
  }
  
  showConfirm(courseId: string): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete this item?',
      nzContent: 'When clicked the OK button, this dialog will be closed after 1 second',
      nzOnOk: () =>
        new Promise<void>((resolve, reject) => {
          this.deleteCourse(courseId);
          setTimeout(() => {
            resolve();
          }, 1000);
        }).catch(() => console.log('Oops errors!'))
    });
  }
}
