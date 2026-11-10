import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterRequest, RegisterResponse } from './auth.service';

export interface EmployeeListItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  // qtd de manutenções em andamento (não finalizadas nem rejeitadas) sob responsabilidade do funcionário
  activeOrders: number;
}

export interface Employee {
  name: string;
  email: string;
}

// dados completos do funcionário (formulário de edição)
export interface EmployeeDetails {
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  cep: string | null;
  street: string | null;
  neighborhood: string | null;
  city: string | null;
  uf: string | null;
  complement: string | null;
}

// cpf não é editável e a senha não entra na edição
export interface UpdateEmployeeRequest {
  name: string;
  email: string;
  phone: string;
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  uf: string;
  complement: string;
}

// const MOCK_EMPLOYEES: EmployeeListItem[] = [
//   { id: 1, name: 'Vinicius Eduardo', email: 'vinicius.eduardo@techfix.com', phone: '', sector: 'Admin', position: 'Gerente', status: 'Ativo', activeOrders: 5 },
//   { id: 2, name: 'Letícia Burlinski', email: 'leticia.burlinski@techfix.com', phone: '', sector: 'TI', position: 'Programador', status: 'Ativo', activeOrders: 5 },
//   { id: 3, name: 'Carlos Mendes', email: 'carlos.mendes@techfix.com', phone: '', sector: 'Operação', position: 'Técnico', status: 'Suspenso', activeOrders: 0 },
//   { id: 4, name: 'Ana Paula Rocha', email: 'ana.rocha@techfix.com', phone: '', sector: 'Suporte', position: 'Atendente', status: 'Inativo', activeOrders: 0 },
//   { id: 5, name: 'Bruno Salles', email: 'bruno.salles@techfix.com', phone: '', sector: 'Operação', position: 'Técnico', status: 'Ativo', activeOrders: 3 },
// ];

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
	private http = inject<HttpClient>(HttpClient);
	private readonly apiUrl = 'http://localhost:8080/api/employees';

	getEmployees(): Observable<EmployeeListItem[]> {
		// return of(MOCK_EMPLOYEES);
		return this.http.get<EmployeeListItem[]>(`${this.apiUrl}/all`, { withCredentials: true });
	}

	getEmployee(id: number): Observable<EmployeeDetails> {
		return this.http.get<EmployeeDetails>(`${this.apiUrl}/${id}`, { withCredentials: true });
	}

	updateEmployee(id: number, payload: UpdateEmployeeRequest): Observable<EmployeeDetails> {
		return this.http.put<EmployeeDetails>(`${this.apiUrl}/${id}`, payload, { withCredentials: true });
	}

	// 409 = não pode excluir (tem manutenções/histórico vinculados ou é o próprio usuário)
	deleteEmployee(id: number): Observable<void> {
		return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
	}

	getAvailableEmployees(): Observable<Employee[]> {
    	return this.http.get<Employee[]>(`${this.apiUrl}`, { withCredentials: true });
  	}

	// o cadastro fica no /auth, junto com o de cliente; a senha é gerada e enviada por e-mail pelo back
	registerEmployee(payload: RegisterRequest): Observable<RegisterResponse> {
		return this.http.post<RegisterResponse>('http://localhost:8080/api/auth/register/employee', payload, {
			withCredentials: true,
		});
	}
}
