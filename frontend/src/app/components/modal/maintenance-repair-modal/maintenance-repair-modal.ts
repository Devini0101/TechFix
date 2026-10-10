import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MaintenanceRequestService } from '../../../core/services/maintenance-request.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-maintenance-repair-modal',
  imports: [],
  templateUrl: './maintenance-repair-modal.html',
  styleUrl: './maintenance-repair-modal.css',
})
export class MaintenanceRepairModal{
  	private maintenanceService = inject(MaintenanceRequestService);

    @Input() maintenanceId: number | null = null;
    @Output() closeModal = new EventEmitter<void>();
    @Output() repairEmmiter = new EventEmitter<void>();

	repairMaintenance() :void {
		this.maintenanceService.repairMaintenance(Number(this.maintenanceId)).subscribe({
			next: () => {
				this.repairEmmiter.emit(),
	            this.closeModal.emit();
			},
			error: (err: HttpErrorResponse) => {
				console.error("Erro ao puxar info por id", err);
				const msg = err.error?.message || 'Ocorreu um erro ao carregar a solicitação.';
			},
		});
	}
}
