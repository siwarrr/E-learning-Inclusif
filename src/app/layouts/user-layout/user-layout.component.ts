import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, catchError, of, tap } from 'rxjs';
import { CourseSpace } from 'src/app/models/course-space.model';
import { Course } from 'src/app/models/course.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { CourseSpaceService } from 'src/app/services/course-space.service';
import { CourseService } from 'src/app/services/course.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent implements OnInit{
  
  courseSpaceId: string | undefined;
  courseSpaces: CourseSpace[] = [];
  searchResults: any;
  @ViewChild('searchInput')
  searchInput!: ElementRef;
  userId: string = '';
  menuVisible = false;
  languageMenuVisible = false;

  changeLanguage(language: string) {
    if (language === 'en') {
      // Si l'utilisateur sélectionne l'anglais, utilisez la traduction en.json
      this.translateService.use('en');
    } else {
      // Sinon, utilisez la traduction correspondante
      this.translateService.use(language);
    }
  }
  
  toggleDropdown(menu: any): void {
    menu.nzDropdownMenuComponent.nzVisible = !menu.nzDropdownMenuComponent.nzVisible;
  }
  change(value: boolean): void {
    console.log(value);
  }
  
  log(courseTitle: string) {
    console.log('Course Title:', courseTitle);
  }
  enrolledCourses: any[] = [];
  userId$!: Observable<string>; // Utilisation de l'opérateur de non-null assertion

  constructor(private courseService: CourseService, 
              private courseSpaceService: CourseSpaceService,
              private authService: AuthService,
              private searchService: SearchService,
              private translateService: TranslateService,
              private modal: NzModalService,              
              private router: Router) { }

// Méthode pour charger les cours pour chaque espace de cours
loadCoursesForAllSpaces(): void {
  console.log('Loading courses for all spaces...');
  if (this.courseSpaces.length === 0) {
    console.warn('No course spaces available.');
    return;
  }

  this.courseSpaces.forEach(space => {
    console.log(`Loading courses for space: ${space.title} (${space._id})`);
    this.courseSpaceService.getAllCoursesInSpace(space._id).subscribe(
      (courses: Course[]) => {
        space.courses = courses;
        console.log(`Courses loaded for space ${space.title}:`, courses);
      },
      (error: any) => {
        console.error(`Error fetching courses for space ${space.title}:`, error);
      }
    );
  });
}


ngOnInit(): void {
  this.authService.getCurrentUser().subscribe(
    (user: any) => {
      console.log('Current user:', user);
      if (user && user._id) {
        this.userId = user._id;
        console.log('User ID:', this.userId);
        this.getEnrolledCourses(this.userId);
      } else {
        console.error('User ID not found');
      }
    },
    (error: any) => {
      console.error('Error getting current user:', error);
    }
  );

  // Appel pour récupérer la liste des espaces de cours
  this.getAllCourseSpaces().subscribe(() => {
    // Charger les cours pour chaque espace de cours
    this.loadCoursesForAllSpaces();
  });

}

getAllCourseSpaces(): Observable<any> {
  return this.courseSpaceService.getAllCourseSpaces().pipe(
    tap((courseSpaces: CourseSpace[]) => {
      this.courseSpaces = courseSpaces;
      console.log('Course spaces retrieved:', courseSpaces);
    }),
    catchError(error => {
      console.error('Error fetching course spaces:', error);
      return of(null);
    })
  );
}
  
  getAllCoursesInSpace(courseSpaceId: string): void {
    this.courseSpaceService.getAllCoursesInSpace(courseSpaceId).subscribe(
      (courses: Course[]) => {
        this.enrolledCourses = courses;
        console.log('Courses in space:', courses);
      },
      (error: any) => {
        console.error('Error fetching courses in space:', error);
      }
    );
  }

  getEnrolledCourses(userId: string): void {
    this.courseService.getEnrolledCourses(userId).subscribe(
      (courses) => {
        this.enrolledCourses = courses; // Assurez-vous que les cours récupérés sont stockés dans enrolledCourses
        console.log("my courses:", courses)
      },
      (error) => {
        console.error('Error fetching enrolled courses:', error);
        // Gérez l'erreur
      }
    );
  }
  // Méthode pour rediriger l'utilisateur vers la page de contenu du cours
  navigateToCourse(courseId: string): void {
    // Vérifiez d'abord si l'utilisateur est inscrit à ce cours
    const isEnrolled = this.enrolledCourses.some(course => course._id === courseId);
  
    if (isEnrolled) {
      // Si l'utilisateur est inscrit, redirigez-le vers la page de contenu du cours
      this.router.navigate(['/learner/course-content', courseId]);
    } else {
      // Si l'utilisateur n'est pas inscrit, affichez un modal pour lui permettre de s'inscrire
      this.showConfirm(courseId);
    }
  }
  
  showConfirm(courseId: string): void {
    this.translateService.get('Do you want to participate in this course?').subscribe((translatedMessage: string) => {
      this.modal.confirm({
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
  onSearch(query: string): void {
    if (query.trim() !== '') {
      this.searchService.search(query).subscribe(
        (results: any) => {
          console.log('Search results:', results);
          // Naviguer vers le composant searchresultcomponent et transmettre les résultats
          this.router.navigate(['/learner/search'], { state: { results: results, searchInput: query } });
          // Réinitialiser la valeur de l'input après la recherche
          this.searchInput.nativeElement.value = '';
        },
        (error: any) => {
          console.error('Error fetching search results:', error);
        }
      );
    }
  }
  logout(): void {
    this.authService.logout().subscribe(
      () => {
        // Redirigez l'utilisateur vers la page de connexion ou effectuez toute autre action nécessaire après la déconnexion réussie
        console.log('Logout successful');
        this.router.navigate(['/welcome']);
      },
      error => {
        // Gérez les erreurs éventuelles lors de la déconnexion
        console.error('Logout failed:', error);
      }
    );
  }
  
  toggleMenu(menu: 'menu' | 'languageMenu'): void {
    if (menu === 'menu') {
      this.menuVisible = !this.menuVisible;
    } else if (menu === 'languageMenu') {
      this.languageMenuVisible = !this.languageMenuVisible;
    }
  }

  onMenuVisibleChange(visible: boolean): void {
    if (visible) {
      setTimeout(() => {
        const firstMenuItem = document.querySelector('.categories nz-dropdown-menu ul nz-menu-item');
        if (firstMenuItem) {
          (firstMenuItem as HTMLElement).focus();
        }
      }, 100);
    }
  }

  onLanguageMenuVisibleChange(visible: boolean): void {
    if (visible) {
      setTimeout(() => {
        const firstLanguageItem = document.querySelector('nz-dropdown-menu ul nz-menu-item');
        if (firstLanguageItem) {
          (firstLanguageItem as HTMLElement).focus();
        }
      }, 100);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    const { key, target } = event;
    const items = Array.from(document.querySelectorAll('nz-dropdown-menu ul nz-menu-item[tabindex="0"], nz-dropdown-menu ul li[tabindex="0"]'));
    const currentIndex = items.indexOf(target as HTMLElement);
    let nextIndex = currentIndex;

    if (key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % items.length;
    } else if (key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + items.length) % items.length;
    } else if (key === 'Enter') {
      (target as HTMLElement).click();
    }

    if (nextIndex !== currentIndex) {
      (items[nextIndex] as HTMLElement).focus();
      event.preventDefault();
    }
  }

  onButtonKeyDown(event: KeyboardEvent, menu: 'menu' | 'languageMenu'): void {
    if (event.key === 'ArrowDown' && (menu === 'menu' ? this.menuVisible : this.languageMenuVisible)) {
      event.preventDefault();
      const firstItem = document.querySelector('nz-dropdown-menu ul nz-menu-item[tabindex="0"], nz-dropdown-menu ul li[tabindex="0"]');
      if (firstItem) {
        (firstItem as HTMLElement).focus();
      }
    }
  }
}