import { Component, inject, OnInit, signal } from '@angular/core';
import { ServiceRequestModal } from '../../components/modal/service-request-modal/service-request-modal';
import { MaintenanceDetailsResponse, MaintenanceRequest, MaintenanceRequestService, Summary } from '../../core/services/maintenance-request.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-employee-maintenance',
  imports: [ServiceRequestModal, RouterLink],
  templateUrl: './employee-maintenance.html',
  styleUrl: './employee-maintenance.css',
})
export class EmployeeMaintenance implements OnInit {

	private maintenanceService = inject(MaintenanceRequestService);
	activeFilter = signal<string>('ALL');
	summary = signal<Summary | null>(null);
	isCreateModalOpen = false;
	maintenances = signal<MaintenanceDetailsResponse[] | null>(null);

	ngOnInit(): void {
		this.loadSummary();
		this.fetchMaintenances("ALL");
	}

	loadSummary() : void {
		this.maintenanceService.getSummary().subscribe(data => this.summary.set(data));
	}

	openCreateModal() :void {
		this.isCreateModalOpen = true;
	}
	closeCreateModal() :void {
		this.isCreateModalOpen = false;
	}

	changeFilter(status : string) : void {
		this.activeFilter.set(status);
		this.fetchMaintenances(status);
	}

	private fetchMaintenances(status: string): void {
		this.maintenanceService.getMaintenances(status).subscribe({
			next: (data) => {
				this.maintenances.set(data);
			},
			error: (err) => console.error("erro ao buscar dados", err)
		});
	}

}
