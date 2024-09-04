import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private apiUrl = 'http://localhost:3000/api/search/';

  constructor( private http: HttpClient) { }

  search(query: string): Observable<any> {
    const data = { data: query }; // Créez un objet avec les données de recherche
    return this.http.post<any>(this.apiUrl, data).pipe(
      catchError((error: any) => {
        console.error('Error fetching search results:', error);
        return throwError('Unable to fetch search results. Please try again later.');
      })
    );
  }
  

}
