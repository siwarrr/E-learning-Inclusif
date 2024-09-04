import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { tap, catchError, of } from 'rxjs';
import { CourseSpace } from 'src/app/models/course-space.model';
import { AuthService } from 'src/app/services/auth.service';
import { CourseSpaceService } from 'src/app/services/course-space.service';
import { CourseService } from 'src/app/services/course.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit{

    courseSpaceId: string | undefined;

    info: any[] = [];
    submitting = false;
    
    inputValue = '';
    userId: string = '';
    popularCourses: any[] = []; 
    confirmModal?: NzModalRef;
    enrolledCourses: string[] = [];
    isChatbotOpen: boolean = false;
    chatbotPopoverTitle: string = "Click to open ChatBot";
    
    zoomLevel: number = 1; // Niveau de zoom par défaut

  courseSpaces: { title: string, description: string, _id: string }[] = [
    { title: 'Primary Space', description: " Empowering young minds to explore, create, and learn, our primary space is where curiosity meets discovery. Here, every day is an adventure, laying the foundation for confident and resilient learners ready to tackle tomorrow's challenges", _id: '65f0dcccc96fff4befcdf508' },
    { title: 'High School Space', description: "Inspiring excellence and passion, our high school space is where dreams take flight and ambitions take shape. Through dynamic learning environments and stimulating opportunities, we guide students towards academic, personal, and professional success, shaping tomorrow's leaders", _id: '65f0dcf8c96fff4befcdf50a' },
    { title: 'University Space', description: "Fostering innovation, collaboration, and discovery, our university space is where bright minds converge to push the boundaries of knowledge. Here, students are empowered to pursue their passions, explore new horizons, and shape a future that transcends borders. In our university, every student is encouraged to find their unique voice and leave a lasting impact on the world", _id: '65f0dd19c96fff4befcdf50c' },
    // Ajoutez d'autres espaces de cours au besoin
  ];
  selectedCourseSpaceId: string | undefined;

  user: any; // Définissez le type approprié pour l'utilisateur
  selectedCourseSpace: any; // Définissez le type approprié pour l'espace de cours sélectionné

  setUser(): void {
    this.user = {
      fullname: 'Siwar', // Définir la valeur de la propriété fullname ici
      // Autres propriétés de l'utilisateur
    };
  }
  setSelectedCourseSpace(): void {
    this.selectedCourseSpace = {
      title: ' primary space ',
      // Autres propriétés de l'espace de cours sélectionné
    };
  }

  /*courseSpaces: CourseSpace[] = [];*/


  fullname: string = 'Siwar';

  array = [1, 2, 3, 4];

  data = [
    {
      title: 'Development'
    },
    {
      title: 'Data science'
    },
    {
      title: 'Marketing'
    },
    {
      title: 'Mathematic'
    },
    {
      title: 'English'
    },
    {
      title: 'Frensh'
    }
  ];

  notify(): void {
    console.log('notify');
  }
  

  theme = true;

  constructor(private router: Router, 
              private courseSpaceService: CourseSpaceService,
              private courseService: CourseService,
              private userService: UserService,
              private authService: AuthService,
              private modal: NzModalService,
              private translateService: TranslateService 
            ) {}

  LoginOnClick(){
    this.router.navigate(['/login']);
  }

  SignUpOnClick(){
    this.router.navigate(['/register']);
  }


  ngOnInit(): void {

    this.setUser();
    this.setSelectedCourseSpace();

    this.fullname = localStorage.getItem('fullname') || '';
    this.getCourseSpaces();
    this.getPopularCourses();

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
  getCourseSpaces(): void {
    this.courseSpaceService.getAllCourseSpaces()
      .subscribe(
        courseSpaces => {
          this.courseSpaces = courseSpaces;
          console.log('Course spaces in UserComponent:', this.courseSpaces);
        },
        error => {
          console.error('Error fetching course spaces:', error);
        }
      );
  }

  navigateToCourseSpace(spaceId: string): void {
    this.router.navigate(['learner/course-space', spaceId]);
  }
  
  getPopularCourses(): void {
    this.courseService.getPopularCourses().subscribe(
      (courses) => {
        console.log(courses);  // Add this line to verify the data
        this.popularCourses = courses;
      },
      (error) => {
        console.error('Error fetching popular courses:', error);
      }
    );
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
  isEnrolled(courseId: string): boolean {
    return this.enrolledCourses.includes(courseId);
  }

  checkEnrollment(courseId: string): void {
    if (this.isEnrolled(courseId)) {
      this.router.navigate(['/learner/course-content', courseId]);
    } else {
      this.showConfirm(courseId);
    }
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
    // Écouteur d'événement pour détecter la pression de la touche Entrée
    @HostListener('document:keydown', ['$event'])
    async handleKeyboardEvent(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        const backTopButton = document.querySelector('.ant-back-top-inner');
        if (document.activeElement === backTopButton) {
          try {
            await this.notify();
          } catch (error) {
            console.error('An error occurred:', error);
          }
        }
      }}

      SubmitReview(userId: string): void {
        this.submitting = true;
        const content = this.inputValue;
        this.inputValue = '';
        console.log("user id review:", userId);
        // Call the UserService method to send the reclamation
        this.userService.sendReclamation(userId, content).subscribe(
          (response) => {
            console.log("Reclamation sent successfully:", response);
            // Handle success
          },
          (error) => {
            console.error("Error sending reclamation:", error);
            // Handle error
          }
        );
      
        setTimeout(() => {
          this.submitting = false;
          this.info = [
            ...this.info,
            {
              ...this.user,
              content,
              datetime: new Date(),
              displayTime: formatDistance(new Date(), new Date())
            }
          ].map(e => ({
            ...e,
            displayTime: formatDistance(new Date(), e.datetime)
          }));
        }, 800);
      }

  toggleChatbot() {
    this.isChatbotOpen = !this.isChatbotOpen;
    this.chatbotPopoverTitle = this.isChatbotOpen ? "Click to close ChatBot" : "Click to open ChatBot";
  }
  zoomIn() {
    this.zoomLevel += 0.1;
  }

  zoomOut() {
    if (this.zoomLevel > 0.1) {
      this.zoomLevel -= 0.1;
    }
  }

  resetZoom() {
    this.zoomLevel = 1; // Réinitialiser le niveau de zoom par défaut
  }

  scrollToCourseSpaces() {
    const element = document.getElementById('courseSpaces');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
function formatDistance(date1: Date, date2: Date): string {
  const distance = Math.abs(date1.getTime() - date2.getTime());
  const minutes = Math.floor(distance / 60000);
  return `${minutes} minutes`;

}


