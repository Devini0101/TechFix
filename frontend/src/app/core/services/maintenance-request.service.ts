import { HttpClient, HttpParams } from '@angular/common/http';
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
  createdAt: string; // java local time vai vir como string
  orientation: string | null;
  responsibleEmployeeName: string | null;
}

export interface Summary {
  pendingBudgets: number | null,
  waitingApproval : number | null,
  inMaintenance: number | null,
  finished: number | null,
  canceled: number | null
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

  getById(id : Number ) : Observable<MaintenanceDetailsResponse> {
    return this.http
      .get<MaintenanceDetailsResponse>(`${this.apiUrl}/${id}`, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  getSummary () : Observable<Summary> {
    return this.http.get<Summary>(`${this.apiUrl}/summary`, { withCredentials : true })
      .pipe(
        catchError( (error) => {
          return throwError( () => error);
        })
      );
  }

  getMaintenances(status?: string): Observable<MaintenanceDetailsResponse[]> {
    let params = new HttpParams();

    // only adds "status=" param into url when status different than ALL
    if (status && status !== 'ALL') {
      params = params.set('status', status);
    }

    return this.http.get<MaintenanceDetailsResponse[]>(this.apiUrl, {
      withCredentials: true,
      params: params
    });
  }

}