import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from 'src/app/services/admin-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  validateForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }> = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

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
constructor(private fb: NonNullableFormBuilder,
            private adminAuthService: AdminAuthService,
            private router: Router
) {}

loginAdmin() {
  if (this.validateForm.valid) {
    const email = this.validateForm.value.email;
    const password = this.validateForm.value.password;

    if (email && password) {
      this.adminAuthService.loginAdmin(email, password).subscribe(
        (response) => {
          console.log('Response from login:', response);

          // Store the JWT token in local storage
          localStorage.setItem('auth_token', response.token);

          // Redirect the user based on the role
          if (response.role === 'admin') {
            this.router.navigate(['/admin']); // Redirect to the admin page
          } else {
            // Handle other roles or scenarios here
            console.error('Unknown role:', response.role);
          }
        },
        (error) => {
          // Handle login errors here
          console.error('Login error:', error);
          this.errorMessage = 'Error during login. Please try again.';
        }
      );
    }
  }
}
}