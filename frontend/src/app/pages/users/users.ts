import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Employee, EmployeeService, EmployeeStatus } from '../../core/services/employee.service';

const STATUS_CLASSES: Record<EmployeeStatus, string> = {
  Ativo: 'bg-green-500/15 text-green-400',
  Inativo: 'bg-gray-500/15 text-gray-400',
  Suspenso: 'bg-amber-500/15 text-amber-400',
};

@Component({
  selector: 'app-users',
  imports: [Sidebar],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  private readonly employeeService = inject(EmployeeService);

  employees = signal<Employee[] | null>(null);

  totalEmployees = computed(() => this.employees()?.length ?? 0);

  activePercentage = computed(() => {
    const list = this.employees();
    if (!list || list.length === 0) return 0;
    return Math.round((list.filter((e) => e.status === 'Ativo').length / list.length) * 100);
  });

  totalTechnicians = computed(() => this.employees()?.filter((e) => e.position === 'Técnico').length ?? 0);
  activeTechnicians = computed(
    () => this.employees()?.filter((e) => e.position === 'Técnico' && e.status === 'Ativo').length ?? 0,
  );

  inactiveCount = computed(() => this.employees()?.filter((e) => e.status === 'Inativo').length ?? 0);
  suspendedCount = computed(() => this.employees()?.filter((e) => e.status === 'Suspenso').length ?? 0);

  ngOnInit(): void {
    this.fetchEmployees();
  }

  statusClasses(status: EmployeeStatus): string {
    return STATUS_CLASSES[status];
  }

  onEdit(employee: Employee): void {
    // TODO(backend): ligar ao fluxo real de edição quando o endpoint existir
    console.log('edit', employee);
  }

  onDelete(employee: Employee): void {
    // TODO(backend): ligar ao fluxo real de exclusão quando o endpoint existir
    console.log('delete', employee);
  }

  private fetchEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => this.employees.set(data),
      error: (err) => console.error('erro ao buscar funcionários', err),
    });
  }
}
