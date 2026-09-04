import { Component, inject } from '@angular/core';
import { EmployeeDashboard } from '../employee-dashboard/employee-dashboard';
import { UserDashboard } from '../user-dashboard/user-dashboard';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [ EmployeeDashboard, UserDashboard],
  styleUrl: './dashboard.css',
  template: `
    <!-- O Angular decide qual componente carregar com base na role -->
    @if (role === 'employee') {
        <app-employee-dashboard [name]="name"></app-employee-dashboard>
    } @else if (role === 'client') {
        <app-user-dashboard [name]="name"></app-user-dashboard>
    } @else {
        <p class="text-white">Carregando painel...</p>
    }
  `
})
export class Dashboard {
  private authService = inject(AuthService);
  role: string | null = this.authService.getRole();
  name: string | null = this.authService.getName();
}
