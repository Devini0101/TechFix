import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

export interface Category {
    active: boolean;
    code : string;
    id : number;
    name: string;
}

export interface CategorySummary {
    totalAmount : number;
    active : number;
    inactive : number;
}

export interface CategoryPayload {
    active: boolean;
    code : string;
    name: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService  {
    private http = inject(HttpClient);
    private apiUrl : string = 'http://localhost:8080/api/category';

    getAll() : Observable<Category[]> {
        return this.http.get<Category[]>(`${this.apiUrl}/`, {withCredentials: true});
    }

    loadSummary() : Observable<CategorySummary> {
        return this.http.get<CategorySummary>(`${this.apiUrl}/summary`, { withCredentials : true });
    }

    getCategory( id : Number) : Observable<Category> {
        return this.http.get<Category>(`${this.apiUrl}/${id}`, { withCredentials : true });
    }

    createCategory(category: CategoryPayload): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}`, category, { withCredentials: true });
    }

    editCategory(id: number, category: CategoryPayload): Observable<Category> {
        return this.http.put<Category>(`${this.apiUrl}/${id}`, category, { withCredentials: true });
    }

    toggleStatus(id : number, active : boolean): Observable<void> {
        return this.http.patch<void>(`${this.apiUrl}/${id}/status`, { "active" : active}, { withCredentials : true });
    }

    delete(id : number): Observable<void>{
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials : true });
    }
}