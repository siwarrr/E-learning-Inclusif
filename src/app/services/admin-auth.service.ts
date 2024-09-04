import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {

  private url = 'http://127.0.0.1:3000/api/admins/login';

  constructor( private http: HttpClient ) { }

  loginAdmin(email: string, password: string) {

    const body = { email, password };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(this.url, body, { headers }).pipe(
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
            }
        }),
        catchError(this.handleError)
    );
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
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something bad happened; please try again later.');
  }
}
