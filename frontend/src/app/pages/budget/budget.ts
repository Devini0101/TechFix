import { Component, inject, Input } from '@angular/core';
import { UserBudget } from '../user-budget/user-budget';
import { EmployeeBudget } from '../employee-budget/employee-budget';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-budget',
  imports: [UserBudget, EmployeeBudget],
  template: `
    @if (role === 'employee') {
        <app-employee-budget [id]="id"></app-employee-budget>
    } @else if (role === 'client') {
        <app-user-budget [id]="id"></app-user-budget>
    } @else {
        <p class="text-white">Carregando painel...</p>
    }`,
  styleUrl: './budget.css',
})
export class Budget {
	private authService = inject(AuthService);
	role = this.authService.getRole();
	@Input() id!: string;

}
