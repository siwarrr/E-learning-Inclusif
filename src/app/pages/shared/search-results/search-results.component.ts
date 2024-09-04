import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { tap, catchError, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  @Input() searchResults: any;
  searchInput: string = '';
  userId: string = '';
  isLoggedIn: boolean = false;
  isModalVisible: boolean = false;
  selectedCourse: any = null;
  enrolledCourses: string[] = [];
  modalTitle: string = '';
  modalContent: string = '';
  confirmModal?: NzModalRef;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private courseService: CourseService, 
              private modal: NzModalService,
              private translateService: TranslateService
    ) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      (user: any) => {
        if (user && user._id) {
          this.userId = user._id;
          this.isLoggedIn = true;
          localStorage.setItem('userId', this.userId); // Assurez-vous de stocker l'ID utilisateur
        }
      },
      (error: any) => {
        this.isLoggedIn = false;
      }
    );

    this.route.paramMap.subscribe(params => {
      if (window.history.state.results) {
        this.searchResults = { ...this.searchResults, ...window.history.state.results };
        this.searchInput = window.history.state.searchInput || '';
      }
    });

    this.loadEnrolledCourses();
  }

  handleCourseClick(course: any): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/welcome/login']);
    } else if (this.isEnrolled(course._id)) {
      this.navigateToCourse(course._id);
    } else {
      this.showConfirm(course._id);
    }
  }

  loadEnrolledCourses(): void {
    const userId = localStorage.getItem('userId'); // Utilisation de localStorage
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

  isEnrolled(courseId: string): boolean {
    return this.enrolledCourses.includes(courseId);
  }

  navigateToCourse(courseId: string): void {
    this.router.navigate(['/learner/course-content', courseId]);
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

  handleCancel(): void {
    this.isModalVisible = false;
  }

  handleOk(): void {
    const userId = localStorage.getItem('userId'); // Assurez-vous que localStorage est utilisé
    const courseId = this.selectedCourse._id;
    if (userId && courseId) {
      this.courseService.registerForCourse(courseId, userId).subscribe(
        () => {
          console.log('Successfully enrolled in the course!');
          this.isModalVisible = false;
          this.router.navigate(['/learner/course-content', courseId]);
        },
        error => {
          console.error('Error registering for course:', error);
        }
      );
    } else {
      console.error('User ID or Course ID not found');
    }
  }
}
