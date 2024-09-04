import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-teacher-profil',
  templateUrl: './teacher-profil.component.html',
  styleUrls: ['./teacher-profil.component.css']
})
export class TeacherProfilComponent implements OnInit{

  userId: string = '';
  fullname: string = '';
  
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
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
}
