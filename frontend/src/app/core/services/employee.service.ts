import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export type EmployeeStatus = 'Ativo' | 'Inativo' | 'Suspenso';

export interface Employee {
  id: number;
  name: string;
  email: string;
  sector: string;
  position: string;
  status: EmployeeStatus;
  activeOrders: number;
}

const MOCK_EMPLOYEES: Employee[] = [
  { id: 1, name: 'Vinicius Eduardo', email: 'vinicius.eduardo@techfix.com', sector: 'Admin', position: 'Gerente', status: 'Ativo', activeOrders: 5 },
  { id: 2, name: 'Letícia Burlinski', email: 'leticia.burlinski@techfix.com', sector: 'TI', position: 'Programador', status: 'Ativo', activeOrders: 5 },
  { id: 3, name: 'Carlos Mendes', email: 'carlos.mendes@techfix.com', sector: 'Operação', position: 'Técnico', status: 'Suspenso', activeOrders: 0 },
  { id: 4, name: 'Ana Paula Rocha', email: 'ana.rocha@techfix.com', sector: 'Suporte', position: 'Atendente', status: 'Inativo', activeOrders: 0 },
  { id: 5, name: 'Bruno Salles', email: 'bruno.salles@techfix.com', sector: 'Operação', position: 'Técnico', status: 'Ativo', activeOrders: 3 },
];

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  // private readonly http = inject(HttpClient);
  // private readonly apiUrl = 'http://localhost:8080/api/employees';

  getEmployees(): Observable<Employee[]> {
    // TODO(backend): quando o endpoint existir, trocar por:
    // return this.http.get<Employee[]>(this.apiUrl, { withCredentials: true });
    return of(MOCK_EMPLOYEES);
  }
}
