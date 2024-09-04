import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseSpace } from 'src/app/models/course-space.model';
import { CourseSpaceService } from 'src/app/services/course-space.service';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  courseSpaces: CourseSpace[] = [];
  isChatbotOpen: boolean = false;
  chatbotPopoverTitle: string = "Click to open ChatBot";

  zoomLevel: number = 1; // Niveau de zoom par défaut
  popularCourses: any[] = []; 
  
  constructor(private router: Router, 
              private courseSpaceService: CourseSpaceService,
              private courseService: CourseService) 
            {}

  ngOnInit(): void {
    this.getCourseSpaces();
    this.getPopularCourses();
  }

  notify(): void {
    console.log('notify');
  }

  LoginOnClick(){
    this.router.navigate(['/login']);
  }

  SignUpOnClick(){
    this.router.navigate(['welcome/register']);
  }

  getCourseSpaces(): void {
    this.courseSpaceService.getAllCourseSpaces()
      .subscribe(courseSpaces => this.courseSpaces = courseSpaces);
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
  triggerClick(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      (event.target as HTMLElement).click();
    }
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

  scrollToSpaceTeacher() {
    const element = document.getElementById('SpaceTeacher');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  toggleChatbot() {
    this.isChatbotOpen = !this.isChatbotOpen;
    this.chatbotPopoverTitle = this.isChatbotOpen ? "Click to close ChatBot" : "Click to open ChatBot";
  }
}
