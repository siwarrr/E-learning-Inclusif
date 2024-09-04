import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public teacherId: string = '';
  public studentId: string = '';
  private isLoggedOut: boolean = false;

  constructor(private http: HttpClient, private router: Router) { }

  isAuthenticated(): boolean {
    // Vérifiez si le token d'authentification est présent dans le stockage local
    const token = localStorage.getItem('token');
    return !!token; // Renvoie vrai si le token existe, sinon faux
  } 
  
 // Méthode pour stocker le jeton d'authentification dans le stockage local
 storeToken(token: string): void {
  localStorage.setItem('token', token);
}

// Méthode pour récupérer le jeton d'authentification depuis le stockage local
getToken(): string | null {
  return localStorage.getItem('token');
}

  private currentUserUrl = 'http://127.0.0.1:3000/user/current';

  private loginURL = 'http://127.0.0.1:3000/user/login';

  private apiUrl = 'http://127.0.0.1:3000/user';


  register(user: any): Observable<any> {
    let registerUrl: string;
  
    if (user.radioValue === 'Learner') {
      registerUrl = 'http://127.0.0.1:3000/user/registerStudent';
    } else if (user.radioValue === 'Teacher') {
      registerUrl = 'http://127.0.0.1:3000/user/registerTeacher';
    } else {
      return throwError('Invalid role selected');
    }
  
    return this.http.post(registerUrl, user).pipe(
      catchError(this.handleError)
    );
  }


  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(this.loginURL, body, { headers }).pipe(
        tap(response => {
            if (response && response.token) {
                // Stocker le token dans le stockage local
                localStorage.setItem('token', response.token);

                // Stocker l'ID de l'utilisateur dans le stockage local
                localStorage.setItem('userId', response.userId);

                // Stocker le nom de l'utilisateur dans le stockage local
                localStorage.setItem('fullname', response.fullname);

                // Stocker l'e-mail de l'utilisateur dans le stockage local
                localStorage.setItem('email', response.email);

                console.log('Received Token:', response.token);  // Log the received token
                localStorage.setItem('token', response.token);
                this.isLoggedOut = false;
              }
            }),
        catchError(this.handleError)
    );
}
logout(): Observable<any> {
  const logoutUrl = 'http://127.0.0.1:3000/user/logout'; // Endpoint de déconnexion

  // Vérifiez d'abord si le token existe
  if (!localStorage.getItem('token')) {
    return throwError('Token not found');
  }

  // Envoyez une requête HTTPs de déconnexion
  return this.http.get<any>(logoutUrl).pipe(
    tap(() => {
      // Supprimez le jeton d'authentification du stockage local après une déconnexion réussie
      localStorage.removeItem('token');
      console.log('User logged out successfully');
      this.isLoggedOut = true; 
    }),
    catchError(this.handleError)
  );
}

isUserLoggedOut(): boolean {
  return this.isLoggedOut;
}
  
  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Décodage du token JWT
      return decodedToken.role; // Récupération du rôle de l'utilisateur depuis le token décodé
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }
  
  getLoggedInUserName(): string | null {
    const fullname = localStorage.getItem('fullname');
    console.log('Fullname from local storage:', fullname); // Ajoutez ce log pour vérifier la valeur stockée
    return fullname;
}
  
  getLoggedInUserEmail(): string | null {
    const email = localStorage.getItem('email');
    console.log('Email from local storage:', email);
    return email;
  }
  
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something bad happened; please try again later.');
  }

  getCurrentUser(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.get<any>(this.currentUserUrl, { headers }).pipe(
        tap(user => {
            if (user && user.userId) {
                localStorage.setItem('userId', user.userId); // Modifier pour récupérer l'ID de l'utilisateur correctement
            }
        }),
        catchError(this.handleError)
    );
}

  extractTeacherIdFromToken(): Observable<string> { // Modifier le type de retour en Observable<string>
    // Récupérez l'utilisateur actuellement connecté
    return this.getCurrentUser().pipe(
      tap(user => {
        if (user && user.userId) {
          // Stockez l'ID de l'utilisateur dans la variable teacherId
          this.teacherId = user.userId;
        }
      }),
      catchError(error => {
        console.error('Error fetching current user:', error);
        return throwError(error);
      }),
      map(() => this.teacherId) // Retournez l'ID de l'enseignant une fois qu'il est extrait
    );
  }

  extractStudentIdFromToken(): Observable<string> {
    return this.getCurrentUser().pipe(
        tap(user => {
            if (user && user.userId) {
                // Stockez l'ID de l'utilisateur dans une variable appropriée
                // Par exemple, vous pouvez stocker l'ID de l'étudiant dans une variable studentId
                // Assurez-vous d'ajuster le nom de la variable selon vos besoins
                this.studentId = user.userId;
            }
        }),
        catchError(error => {
            console.error('Error fetching current user:', error);
            return throwError(error);
        }),
        map(() => this.studentId) // Retournez l'ID de l'étudiant une fois qu'il est extrait
    );
}

forgotPassword(email: string): Observable<any> {
  const body = { email };
  return this.http.post<any>(`${this.apiUrl}/forgotPassword`, body).pipe(
    catchError(this.handleError)
  );
}

resetPassword(newPassword: string, token: string): Observable<any> {
  const body = { newPassword };
  return this.http.post<any>(`${this.apiUrl}/reset/${token}`, body).pipe(
    catchError(this.handleError)
  );
}
  
isTokenExpired(token: string): boolean {
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const expirationDate = new Date(decodedToken.exp * 1000);
  return expirationDate < new Date();
}
isWelcomePage(): boolean {
  return this.router.url.includes('/welcome');
}
}

