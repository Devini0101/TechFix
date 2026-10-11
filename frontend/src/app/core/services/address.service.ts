import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ViaCepAddress {
  cep: string;
  bairro: string;
  complemento: string;
  logradouro: string;
  localidade: string;
  uf: string;
}

@Injectable({ providedIn: 'root' })
export class AddressService {
  private http = inject(HttpClient);
  private apiUrl: string = 'http://localhost:8080/api/address';

  getByCep(cep: string): Observable<ViaCepAddress> {
    return this.http.get<ViaCepAddress>(`${this.apiUrl}/via-cep/${cep}`, { withCredentials: true });
  }
}
