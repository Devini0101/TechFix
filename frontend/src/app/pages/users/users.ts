import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { EmployeeRegisterModal } from '../../components/modal/employee-register-modal/employee-register-modal';
import { RegisterResponse } from '../../core/services/auth.service';
import { EmployeeDetails, EmployeeListItem, EmployeeService } from '../../core/services/employee.service';

const normalize = (value: string | null | undefined): string =>
  (value ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

@Component({
  selector: 'app-users',
  imports: [EmployeeRegisterModal],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  private readonly employeeService = inject(EmployeeService);

  employees = signal<EmployeeListItem[] | null>(null);
  isModalOpen = signal(false);
  // null = modal em modo cadastro; com id = modo edição
  editingEmployeeId = signal<number | null>(null);
  // funcionário aguardando confirmação de exclusão (null = modal fechado)
  employeeToDelete = signal<EmployeeListItem | null>(null);
  isDeleting = signal(false);
  deleteError = signal('');
  successMessage = signal('');
  searchTerm = signal('');

  // filtra por nome ou e-mail, ignorando maiúsculas/minúsculas e acentos
  filteredEmployees = computed(() => {
    const list = this.employees() ?? [];
    const term = normalize(this.searchTerm().trim());
    if (!term) return list;
    return list.filter((e) => normalize(e.name).includes(term) || normalize(e.email).includes(term));
  });

  totalEmployees = computed(() => this.employees()?.length ?? 0);
  employeesInOperation = computed(() => this.employees()?.filter((e) => e.activeOrders > 0).length ?? 0);

  ngOnInit(): void {
    this.fetchEmployees();
  }

  openCreateModal(): void {
    this.successMessage.set('');
    this.editingEmployeeId.set(null);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  onEmployeeCreated(employee: RegisterResponse): void {
    this.closeModal();
    this.successMessage.set(
      `Funcionário ${employee.name} cadastrado. A senha de acesso foi enviada para o e-mail informado.`,
    );
    this.fetchEmployees();
  }

  onEdit(employee: EmployeeListItem): void {
    this.successMessage.set('');
    this.editingEmployeeId.set(employee.id);
    this.isModalOpen.set(true);
  }

  onEmployeeUpdated(employee: EmployeeDetails): void {
    this.closeModal();
    this.successMessage.set(`Dados de ${employee.name} atualizados.`);
    this.fetchEmployees();
  }

  // abre a confirmação; a exclusão só acontece em confirmDelete()
  onDelete(employee: EmployeeListItem): void {
    this.successMessage.set('');
    this.deleteError.set('');
    this.employeeToDelete.set(employee);
  }

  cancelDelete(): void {
    if (this.isDeleting()) return;
    this.employeeToDelete.set(null);
  }

  confirmDelete(): void {
    const employee = this.employeeToDelete();
    if (!employee) return;

    this.isDeleting.set(true);
    this.deleteError.set('');
    this.employeeService.deleteEmployee(employee.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.employeeToDelete.set(null);
        this.successMessage.set(`Funcionário ${employee.name} excluído.`);
        this.fetchEmployees();
      },
      error: (err: HttpErrorResponse) => {
        this.isDeleting.set(false);
        // a mensagem do 409 vem do back (vínculos ou tentar excluir a si mesmo)
        this.deleteError.set(
          err.status === 409 && err.error?.message
            ? err.error.message
            : 'Não foi possível excluir o funcionário. Tente novamente.',
        );
      },
    });
  }

  private fetchEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => this.employees.set(data),
      error: (err) => console.error('erro ao buscar funcionários', err),
    });
  }
}
