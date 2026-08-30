import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface LoginRequest{
    email : string;
    password : string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
    private http = inject(HttpClient)
    private apiUrl = "http://localhost:8080/api/auth"

    login(credentials : LoginRequest): Observable<any> {
        return this.http.post<void>(`${this.apiUrl}/login`, credentials, {
            withCredentials : true
        });
    }
}