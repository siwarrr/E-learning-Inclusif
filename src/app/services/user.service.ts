import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly baseUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient) {}

  getUserById(userId: string): Observable<User> {
    // Faites une requête HTTP pour récupérer les informations sur l'utilisateur à partir de son ID
    return this.http.get<User>(`${this.baseUrl}/${userId}`);
  }
  sendReclamation(userId: string, message: string): Observable<any> {
    const body = { userId, message };
    return this.http.post<any>(`${this.baseUrl}/${userId}/reclam`, body);
  }
}