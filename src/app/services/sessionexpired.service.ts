import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SessionexpiredService {

  private sessionExpiredSubject = new Subject<void>();

  constructor(private authService: AuthService) {}

  notifySessionExpired(): void {
    if (!this.authService.isWelcomePage()) {
      this.sessionExpiredSubject.next();
    }
  }

  onSessionExpired(): Observable<void> {
    return this.sessionExpiredSubject.asObservable();
  }
}
