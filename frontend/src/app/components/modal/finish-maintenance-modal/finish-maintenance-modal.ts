import { Component, EventEmitter, inject, Input, input, OnInit, Output, signal } from '@angular/core';
import { MaintenanceDetailsResponse, MaintenanceRequestService } from '../../../core/services/maintenance-request.service';

@Component({
  selector: 'app-finish-maintenance-modal',
  imports: [],
  templateUrl: './finish-maintenance-modal.html',
  styleUrl: './finish-maintenance-modal.css',
})
export class FinishMaintenanceModal implements OnInit{

	@Input() maintenanceId: Number | null = null;
	@Output() closeModalEmitter = new EventEmitter<void>();
	@Output() sucessfullyFinishedEmitter = new EventEmitter<void>();
	service = inject(MaintenanceRequestService);
	maintenance = signal<MaintenanceDetailsResponse | null>(null);

	ngOnInit() :void{
		this.service.getById(Number(this.maintenanceId)).subscribe({
			next: (value) => {
				this.maintenance.set(value);
			},
		})
	}

	closeModal() :void {
		this.closeModalEmitter.emit();
	}

	finishMaintenance() : void{
		this.service.finishMaintenance(Number(this.maintenanceId)).subscribe({
			next:(value) => {
				this.sucessfullyFinishedEmitter.emit();
			},
		})
	}
}
