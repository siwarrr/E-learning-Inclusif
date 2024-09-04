import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, catchError, of, tap } from 'rxjs';
import { CourseSpace } from 'src/app/models/course-space.model';
import { Course } from 'src/app/models/course.model';
import { AuthService } from 'src/app/services/auth.service';
import { CourseSpaceService } from 'src/app/services/course-space.service';
import { CourseService } from 'src/app/services/course.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-welcome-layout',
  templateUrl: './welcome-layout.component.html',
  styleUrls: ['./welcome-layout.component.css']
})
export class WelcomeLayoutComponent implements OnInit{
  
  courseSpaces: CourseSpace[] = [];
  enrolledCourses: any[] = [];
  @ViewChild('searchInput')
  searchInput!: ElementRef;
  searchResults: any;
  menuVisible = false;
  languageMenuVisible = false;

  constructor(private translateService: TranslateService,
              private courseSpaceService: CourseSpaceService,
              private courseService: CourseService,
              private searchService: SearchService,
              private modal: NzModalService, 
              private authService: AuthService, 
              private message: NzMessageService,            
              private router: Router
  ) {}
  
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

  createMessage(type: string): void {
    const messageKey = 'To view this course, you must be logged in!';
    this.translateService.get(messageKey).subscribe((translatedMessage: string) => {
      this.message.create(type, translatedMessage);
    });
  }
  changeLanguage(language: string) {
    this.translateService.use(language);
  }
  change(value: boolean): void {
    console.log(value);
  }
  onSearch(query: string): void {
    if (query.trim() !== '') {
      this.searchService.search(query).subscribe(
        (results: any) => {
          console.log('Search results:', results);
          // Naviguer vers le composant searchresultcomponent et transmettre les résultats
          this.router.navigate(['/welcome/search'], { state: { results: results, searchInput: query } });
          // Réinitialiser la valeur de l'input après la recherche
          this.searchInput.nativeElement.value = '';
        },
        (error: any) => {
          console.error('Error fetching search results:', error);
        }
      );
    }
  } 

  toggleDropdown(menu: 'menu' | 'languageMenu'): void {
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
