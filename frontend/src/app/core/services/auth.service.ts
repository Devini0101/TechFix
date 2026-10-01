import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, Observable, tap, of } from "rxjs";

export interface LoginRequest {
    email: string;
    password: string;
}
export interface AuthResponse {
    role: string;
    name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    // FORÇADO COMO TRUE PARA TESTES
    private logged = new BehaviorSubject<boolean>(true);
    logged$ = this.logged.asObservable();
    
    private http = inject(HttpClient);
    private apiUrl = "http://localhost:8080/api/auth";
    
    // DEFINA O PAPEL QUE QUER TESTAR: 'employee' ou 'client'
    private userRole = new BehaviorSubject<string | null>('employee');
    private name = new BehaviorSubject<string | null>('Desenvolvedor');
    private router = inject(Router);

    login(credentials: LoginRequest): Observable<any> {
        return of({ role: 'employee', name: 'Desenvolvedor' }).pipe(
            tap((res) => {
                this.logged.next(true);
                this.userRole.next(res.role);
                this.name.next(res.name);
            })
        );
    }

    isAuthenticated(): boolean {
        return true; // Sempre autenticado nos testes
    }

    checkAuth(): Observable<AuthResponse | null> {
        // Retorna dados mocados em vez de tentar chamar a API do Java/Node
        const mockUser: AuthResponse = { role: 'employee', name: 'Desenvolvedor' };
        this.logged.next(true);
        this.userRole.next(mockUser.role);
        this.name.next(mockUser.name);
        return of(mockUser);
    }

    getRole(): string | null {
        return this.userRole.value;
    }

    getName(): string | null {
        return this.name.value;
    }

    logout() {
        this.logged.next(false);
        this.userRole.next(null);
        this.name.next(null);
        this.router.navigate(['/login']);
    }
}