import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { Observable, catchError, throwError } from 'rxjs';
import { SessionexpiredService } from '../sessionexpired.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private authService: AuthService, private sessionExpiredService: SessionexpiredService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });

    console.log('Intercepted HTTP request with token:', authToken);

    const nonAuthUrls = ['/welcome']; // Liste des URL qui ne nécessitent pas d'authentification

    if (nonAuthUrls.some(url => req.url.includes(url))) {
      return next.handle(req); // Ne pas vérifier l'expiration du token pour ces URL
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.authService.isUserLoggedOut()) {
          this.sessionExpiredService.notifySessionExpired();
        }
        return throwError(error);
      })
    );
  }

  /*intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Récupérer le jeton d'authentification
    const authToken = this.authService.getToken();

    // Cloner la requête et ajouter le jeton d'authentification aux en-têtes
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });

    // Continuer le traitement de la requête
    return next.handle(authReq);
  }*/

}
