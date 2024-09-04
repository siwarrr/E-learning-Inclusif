import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataServiceService } from 'src/app/services/data-service.service';
import { of } from 'rxjs';

import { Observable, tap, catchError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/course.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';
import { CourseSpaceService } from 'src/app/services/course-space.service';


@Component({
  selector: 'app-course-space',
  templateUrl: './course-space.component.html',
  styleUrls: ['./course-space.component.css']
})
export class CourseSpaceComponent implements OnInit{

  courses: any[] = [];
  enrolledCourses: string[] = [];
  courseSpaceId: string | undefined;
  userId: string = '';
  fullname: string = '';
  isVisible = false;

  confirmModal?: NzModalRef;
  courseSpaceTitle: string | undefined;

  isChatbotOpen: boolean = false;
  chatbotPopoverTitle: string = "Click to open ChatBot";
  
  constructor(private router: Router,
     private dataService: DataServiceService,
     private activatedRoute: ActivatedRoute, 
     private authService: AuthService,
     private courseService: CourseService,
     private courseSpaceService: CourseSpaceService,
     private modal: NzModalService,
     private translateService: TranslateService) {}

  ngOnInit(): void {
    this.courseSpaceId = this.activatedRoute.snapshot.paramMap.get('spaceId') ?? undefined;
    console.log('Course space ID:', this.courseSpaceId);
    if (this.courseSpaceId) {
      this.getCourseSpaceTitle();
      this.getAllCoursesInSpace();
    }

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
    this.loadEnrolledCourses();
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

  getCourseSpaceTitle(): void {
    if (!this.courseSpaceId) {
      return;
    }
    // Recherchez l'objet de l'espace de cours correspondant à l'ID de l'espace de cours actuel
    const currentCourseSpace = this.courseSpaces.find(courseSpace => courseSpace._id === this.courseSpaceId);
    if (currentCourseSpace) {
      this.courseSpaceTitle = currentCourseSpace.title;
    }
  }
courseSpaces: { title: string, description: string, _id: string }[] = [
    { title: 'Primary Space', description: " Empowering young minds to explore, create, and learn, our primary space is where curiosity meets discovery. Here, every day is an adventure, laying the foundation for confident and resilient learners ready to tackle tomorrow's challenges", _id: '65f0dcccc96fff4befcdf508' },
    { title: 'High School Space', description: "Inspiring excellence and passion, our high school space is where dreams take flight and ambitions take shape. Through dynamic learning environments and stimulating opportunities, we guide students towards academic, personal, and professional success, shaping tomorrow's leaders", _id: '65f0dcf8c96fff4befcdf50a' },
    { title: 'University Space', description: "Fostering innovation, collaboration, and discovery, our university space is where bright minds converge to push the boundaries of knowledge. Here, students are empowered to pursue their passions, explore new horizons, and shape a future that transcends borders. In our university, every student is encouraged to find their unique voice and leave a lasting impact on the world", _id: '65f0dd19c96fff4befcdf50c' },
    // Ajoutez d'autres espaces de cours au besoin
  ];
  getAllCoursesInSpace(): void {
    if (this.courseSpaceId) {
      this.courseSpaceService.getAllCoursesInSpace(this.courseSpaceId)
        .subscribe(courses => {
          console.log(courses);
          this.courses = courses;
        });
    }
  }
  loadEnrolledCourses(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.courseService.getEnrolledCourses(userId)
        .pipe(
          tap(enrolledCourses => {
            this.enrolledCourses = enrolledCourses.map((course: any) => course._id);
          }),
          catchError(error => {
            console.error('Error fetching enrolled courses:', error);
            return of([]);
          })
        )
        .subscribe();
    }
  }
  /*getFullName(): void {
    this.fullname$ = of(this.authService.getLoggedInUserName()); // Récupère le nom de l'utilisateur connecté
  }*/
  isEnrolled(courseId: string): boolean {
    return this.enrolledCourses.includes(courseId);
  }

  showConfirm(courseId: string): void {
    this.translateService.get('Do you want to participate in this course?').subscribe((translatedMessage: string) => {
      this.confirmModal = this.modal.confirm({
        nzTitle: translatedMessage,
        nzOnOk: () => {
          const userId = localStorage.getItem('userId');
          if (userId) {
            this.courseService.registerForCourse(courseId, userId).subscribe(
              () => {
                console.log('Successfully enrolled in the course!');
                this.router.navigate(['/learner/course-content', courseId]);
              },
              error => {
                console.error('Error registering for course:', error);
              }
            );
          } else {
            console.error('User ID not found in local storage');
          }
        }
      });
    });
  }

  visitCourse(courseId: string): void {
    this.router.navigate(['/learner/course-content', courseId]);
  }

  toggleChatbot() {
    this.isChatbotOpen = !this.isChatbotOpen;
    this.chatbotPopoverTitle = this.isChatbotOpen ? "Click to close ChatBot" : "Click to open ChatBot";
  }

}