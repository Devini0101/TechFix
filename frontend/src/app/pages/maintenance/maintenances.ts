import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { EmployeeMaintenance } from '../employee-maintenance/employee-maintenance';
import { UserMaintenance } from '../user-maintenance/user-maintenance';

@Component({
  selector: 'app-maintenances',
  imports: [EmployeeMaintenance, UserMaintenance],
  template: `
    <!-- O Angular decide qual componente carregar com base na role -->
    @if (role === 'employee') {
        <app-employee-maintenance ></app-employee-maintenance>
    } @else if (role === 'client') {
        <app-user-maintenance ></app-user-maintenance>
    } @else {
        <p class="text-white">Carregando painel...</p>
    }
  `,
  styleUrl: './maintenances.css',
})

export class Maintenances {
  private authService = inject(AuthService);
  role: string | null = this.authService.getRole();
}
