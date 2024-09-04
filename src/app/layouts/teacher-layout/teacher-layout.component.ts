import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-teacher-layout',
  templateUrl: './teacher-layout.component.html',
  styleUrls: ['./teacher-layout.component.css']
})
export class TeacherLayoutComponent implements OnInit{

  userId$!: Observable<string>;
  userId: string = '';

  constructor(private authService: AuthService,
              private router: Router
  ) {}
  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      (user: any) => {
        console.log('Current user:', user);
        if (user && user._id) {
          this.userId = user._id;
          console.log('User ID:', this.userId);
        } else {
          console.error('User ID not found');
        }
      },
      (error: any) => {
        console.error('Error getting current user:', error);
      }
    );
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
}
