import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, Event as RouterEvent } from '@angular/router'; 
import { filter } from 'rxjs/operators';
import { Course } from 'src/app/models/course.model';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {

  breadcrumbItems: string[] = [];

  constructor( private authService: AuthService,
               private router: Router,
               private courseService: CourseService
  ) {}

  ngOnInit(): void {
    // Écoute les événements de navigation
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd || event instanceof NavigationStart)
    ).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Met à jour le fil d'Ariane à chaque changement de route
        this.updateBreadcrumb((event as NavigationEnd).urlAfterRedirects);
      }
    });  
  }

  updateBreadcrumb(url: string): void {
    // Efface les éléments actuels du fil d'Ariane
    this.breadcrumbItems = [];

    // Ajoute "Users" comme premier élément
    this.breadcrumbItems.push('');

    // Extrait et formate les autres éléments du fil d'Ariane à partir de l'URL
    const segments = url.split('/');
    segments.forEach((segment, index) => { // Inclure l'index ici
      if (index > 0 && segments[index - 1] === 'course-content') {
        this.courseService.getCourseById(segment).subscribe((course: Course) => {
          this.breadcrumbItems.push(this.capitalizeFirstLetter(course.title));
        });
      } else {
        this.breadcrumbItems.push(this.capitalizeFirstLetter(segment));
      }

    });
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  logout(): void {
    this.authService.logout().subscribe(
      () => {
        // Redirigez l'utilisateur vers la page de connexion ou effectuez toute autre action nécessaire après la déconnexion réussie
        console.log('Logout successful');
        this.router.navigate(['/loginAdmin']);
      },
      error => {
        // Gérez les erreurs éventuelles lors de la déconnexion
        console.error('Logout failed:', error);
      }
    );
  }
}
