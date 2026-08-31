import { Component, inject } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { EmployeeDashboard } from '../employee-dashboard/employee-dashboard';
import { UserDashboard } from '../user-dashboard/user-dashboard';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [Sidebar, EmployeeDashboard, UserDashboard],
  styleUrl: './dashboard.css',
  template: `
    <!-- O Angular decide qual componente carregar com base na role -->
    @if (role === 'employee') {
        <app-employee-dashboard></app-employee-dashboard>
    } @else if (role === 'user') {
        <app-user-dashboard></app-user-dashboard>
    } @else {
        <p class="text-white">Carregando painel...</p>
    }
  `
})
export class Dashboard {
  private authService = inject(AuthService);
  role: string | null = this.authService.getRole();

}
