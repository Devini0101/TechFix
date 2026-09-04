import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';

export interface MaintenanceRequestPayload {
  item: string;
  itemDescription: string;
  itemDefect: string;
  categoryCode: string;
}

export interface MaintenanceRequest {
  id : number,
  item : string,
  itemDescription : string,
  itemDefect : string,
  estimatedPrice : number,
  price : number,
  categoryCode : string,
  responsibleEmployeeName : string
}

export interface MaintenanceDetailsResponse {
  id: number;
  item: string;
  itemDescription: string;
  itemDefect: string;
  estimatedPrice: number | null;
  price: number | null;
  categoryCode: string | null;
  statusCode: string | null;
  statusColor: string | null;
  createdAt: string; // ISO string sent by Java LocalDateTime
  orientation: string | null;
  responsibleEmployeeName: string | null;
}

@Injectable({
  providedIn: 'root',
} )
export class MaintenanceRequestService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/maintenance-request';

  create(payload: MaintenanceRequestPayload ): Observable<unknown> {
    return this.http.post<MaintenanceRequestPayload>(this.apiUrl, payload, {
      withCredentials: true,
    } );
  }

  getOpened() : Observable<MaintenanceRequest[]> {
    return this.http.get<MaintenanceRequest[]>(`${this.apiUrl}/pending`, {withCredentials : true})
    .pipe(catchError((error) => {
        console.error('Erro ao buscar manutenções abertas:', error);
        return of([]);
    }));
  }

  getById(id : Number ) : Observable<MaintenanceDetailsResponse> {
    return this.http
      .get<MaintenanceDetailsResponse>(`${this.apiUrl}/${id}`, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error(`Erro ao buscar detalhes da manutenção #${id}:`, error);
          return throwError(() => error); // Re-throws so component error callbacks handle HTTP 404/403 properly
        })
      );
  }
}