import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ServiceRequestModal } from '../../components/modal/service-request-modal/service-request-modal';
import { MaintenanceDetailsResponse, MaintenanceRequest, MaintenanceRequestService, Summary } from '../../core/services/maintenance-request.service';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-maintenances',
  imports: [ServiceRequestModal, RouterLink],
  templateUrl: './maintenances.html',
  styleUrl: './maintenances.css',
})

export class Maintenances {

	private maintenanceService = inject(MaintenanceRequestService);
	private authService = inject(AuthService);
	Role = this.authService.getRole();
	activeFilter = signal<string>('ALL');
	summary = signal<Summary | null>(null);
	isCreateModalOpen = false;
	maintenances = signal<MaintenanceDetailsResponse[] | null>(null);
	totalSum = computed(() => {
		const data = this.summary();
		if (!data) return 0;

		return Object.values(data)
		.filter((val): val is number => typeof val === 'number')
		.reduce((acc, curr) => acc + curr, 0);
	});

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
		this.loadSummary();
		this.fetchMaintenances("ALL");
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
