import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

export interface Category {
    active: boolean;
    code : String;
    id : number;
    name: String;
}

@Injectable({ providedIn: 'root' })
export class CategoryService  {
    private http = inject(HttpClient);
    private apiUrl : string = 'http://localhost:8080/api/category';

    getAll() : Observable<Category[]> {
        return this.http.get<Category[]>(`${this.apiUrl}/`, {withCredentials: true})
        .pipe(
            catchError((error) => {
                return of([]);
            })
        );
    }

}