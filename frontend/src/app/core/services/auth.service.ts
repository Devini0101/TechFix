import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, Observable, tap, of } from "rxjs";

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
    private router = inject(Router);

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

    checkAuth(): Observable<AuthResponse | null> {
        return this.http.get<AuthResponse>(`${this.apiUrl}/check`,{withCredentials : true})
            .pipe(
                tap((res) => {
                    this.logged.next(true);
                    this.userRole.next(res.role);
                }),
                catchError(() => {
                    this.logged.next(false);
                    this.userRole.next(null);
                    return of(null);
                })
            )
    }

    getRole () : string | null {
        return this.userRole.value;
    }

    //manda o request para anular o token e revogar independentemente de ser aceito ou não
    logout() {
        this.http.post(`${this.apiUrl}/logout`, {}, {withCredentials : true})
            .subscribe({
                next: () => {
                    this.logged.next(false);
                    this.userRole.next(null);
                    this.router.navigate(['/login']);
                },
                error: () => {
                    this.logged.next(false);
                    this.userRole.next(null);
                    this.router.navigate(['/login']);
                }
            });
    }
}