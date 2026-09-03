import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface MaintenanceRequestPayload {
  item: string;
  itemDescription: string;
  itemDefect: string;
  categoryCode: string;
}

@Injectable({
  providedIn: 'root',
} )
export class MaintenanceRequestService {
  private readonly http = inject(HttpClient );
  private readonly apiUrl = 'http://localhost:8080/api/maintenance-request';

  create(payload: MaintenanceRequestPayload ): Observable<unknown> {
    return this.http.post<MaintenanceRequestPayload>(this.apiUrl, payload, {
      withCredentials: true,
    } );
  }
}