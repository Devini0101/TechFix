import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { MaintenanceRequestService } from '../../../core/services/maintenance-request.service';
import { EmployeeService, Employee } from '../../../core/services/employee.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-redirect-maintenance-modal',
	imports: [],
	templateUrl: './redirect-maintenance-modal.html',
	styleUrl: './redirect-maintenance-modal.css',
})
export class RedirectMaintenanceModal implements OnInit {
	private maintenanceService = inject(MaintenanceRequestService);
    private employeeService = inject(EmployeeService);

    @Input() maintenanceId: number | null = null;
    @Output() closeModal = new EventEmitter<void>();
	@Output() successRedirect = new EventEmitter<void>();

    employees = signal<Employee[] | null>(null);
    selectedEmail = signal<string>('');

    ngOnInit() {
        this.getAvailableEmployees();
    }

    getAvailableEmployees() {
        this.employeeService.getAvailableEmployees().subscribe({
            next: (data) => this.employees.set(data),
            error: (err: HttpErrorResponse) => console.log(err)
        });
    }

    onEmployeeSelected(event: Event) {
        const selectElement = event.target as HTMLSelectElement;
        this.selectedEmail.set(selectElement.value);
    }

    redirect() {
        if (!this.selectedEmail() || !this.maintenanceId) {
            console.warn('Selecione um funcionário antes de continuar.');
            return;
        }
        const payload = {
            email: this.selectedEmail()
        };

        this.maintenanceService.redirectMaintenance(Number(this.maintenanceId), payload).subscribe({
        next: (updatedId) => {
            this.successRedirect.emit();
            this.closeModal.emit();
        },
        error: (err: HttpErrorResponse) => console.error(err)
    });
    }
}
