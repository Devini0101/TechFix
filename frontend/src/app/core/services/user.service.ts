import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

export interface UpdateProfileRequest {
  name: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/users';

  updateProfile(payload: UpdateProfileRequest): Observable<void> {
    // TODO(backend): quando o endpoint existir, trocar por:
    // return this.http.put<void>(`${this.apiUrl}/me`, payload, { withCredentials: true });
    return of(undefined).pipe(delay(600));
  }

  changePassword(payload: ChangePasswordRequest): Observable<void> {
    // TODO(backend): quando o endpoint existir, trocar por:
    // return this.http.patch<void>(`${this.apiUrl}/me/password`, payload, { withCredentials: true });
    return of(undefined).pipe(delay(600));
  }
}
