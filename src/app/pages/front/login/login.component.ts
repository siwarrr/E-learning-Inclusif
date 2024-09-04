import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  zoomLevel: number = 1; // Niveau de zoom par défaut

  validateForm: FormGroup;
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showAlert: boolean = false;
  showResetPasswordForm: boolean = false;
  resetPasswordToken: string = '';

  constructor(
    private fb: NonNullableFormBuilder, 
    private authService: AuthService, 
    private message: NzMessageService,
    private router: Router
  ) {
    this.validateForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Ajout de validation de l'email
      password: ['', [Validators.required]],
      newPassword: ['']
    });   
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  login() {
    if (this.validateForm.valid) {
      const { email, password } = this.validateForm.value;
  
      if (email && password) {
        this.authService.login(email, password).subscribe(
          (response) => {
            console.log('Response from login:', response);
            localStorage.setItem('auth_token', response.token);
  
            if (response.role === 'student') {
              this.router.navigate(['/learner']);
            } else if (response.role === 'teacher') {
              this.router.navigate(['/teacher']);
            } else {
              console.error('Unknown role:', response.role);
            }
            this.showAlert = false;
          },
          (error) => {
            console.error('Login error:', error);
            if (error.status === 401) {
              this.errorMessage = 'Incorrect email or password. Please try again.';
              this.showAlert = true;
              this.createMessage('error', this.errorMessage);
            } else {
              this.errorMessage = 'Error during login. Please try again.';
              this.showAlert = true;
              this.createMessage('error', this.errorMessage);
            }         
          }
        );
      }
    }
  }

  forgotPassword() {
    const email = this.validateForm.value.email;
    if (email) {
      this.authService.forgotPassword(email).subscribe(
        response => {
          this.resetPasswordToken = response.token; // Assurez-vous que le backend renvoie le token
          console.log('token reset password : ', this.resetPasswordToken); // Pour débogage
          this.validateForm.get('newPassword')?.setValidators(Validators.required);
          this.validateForm.get('newPassword')?.updateValueAndValidity();
          this.showResetPasswordForm = true;
        },
        error => {
          this.errorMessage = 'Error sending reset password email. Please try again.';
          this.showAlert = true;
          this.createMessage('error', this.errorMessage);
        }
      );
    } else {
      this.errorMessage = 'Please enter your email.';
      this.showAlert = true;
      this.createMessage('error', this.errorMessage);
    }
  }

  resetPassword() {
    const newPassword = this.validateForm.value.newPassword;
    if (newPassword && this.resetPasswordToken) {
      this.authService.resetPassword(newPassword, this.resetPasswordToken).subscribe(
        response => {
          this.showResetPasswordForm = false;
          this.showAlert = false;
          this.createMessage('success', 'Password reset successfully.');
        },
        error => {
          this.errorMessage = 'Error resetting password. Please try again.';
          this.showAlert = true;
          this.createMessage('error', this.errorMessage);
        }
      );
    } else {
      this.errorMessage = 'Please enter your new password.';
      this.showAlert = true;
      this.createMessage('error', this.errorMessage);
    }
  }

  createMessage(type: string, message: string): void {
    this.message.create(type, message);
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
}  
