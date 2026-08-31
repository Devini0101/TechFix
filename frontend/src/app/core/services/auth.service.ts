import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";

export interface LoginRequest{
    email : string;
    password : string;
}
export interface AuthResponse {
  role: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

    // Guarda o estado na memória do Angular (começa como false)
    private logged = new BehaviorSubject<boolean>(false);
    logged$ = this.logged.asObservable();
    private http = inject(HttpClient)
    private apiUrl = "http://localhost:8080/api/auth"
    private userRole = new BehaviorSubject<string | null>(null);

    login(credentials : LoginRequest): Observable<any> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials, {
            withCredentials : true
        }).pipe(
        tap((res) => {
            this.logged.next(true);
            this.userRole.next(res.role);
            })
        );
    }

    isAuthenticated() :boolean {
        return this.logged.value;
    }

    getRole () : string | null {
        return this.userRole.value;
    }

    logout() {
        this.logged.next(false);
        //TODO: implementar request para limpeza/ invalidar cookies pro backend
    }
}