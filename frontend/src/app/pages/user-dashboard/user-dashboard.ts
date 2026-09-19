import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MaintenanceDetailsResponse, MaintenanceRequestService } from '../../core/services/maintenance-request.service';
import { ServiceRequestModal } from '../../components/modal/service-request-modal/service-request-modal';
import { MaintenanceRequestModal } from '../../components/modal/maintenance-request-modal/maintenance-request-modal';
import { RouterLink } from "@angular/router";
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-user-dashboard',
	imports: [ServiceRequestModal, MaintenanceRequestModal, RouterLink, DatePipe],
	templateUrl: './user-dashboard.html',
	styleUrl: './user-dashboard.css',
})

export class UserDashboard implements OnInit {
  	@Input() name: string | null = '';
	isCreateModalOpen = false;
  	isDetailModalOpen = false;

	categories: string[] = [];
	selectedRequestDetails = signal<MaintenanceDetailsResponse | null>(null);
	maintenanceRequests = signal<MaintenanceDetailsResponse[] | null>(null);

	runningMaintenances = signal<MaintenanceDetailsResponse[] | null>(null);

  	private maintenanceService = inject(MaintenanceRequestService);

	ngOnInit(): void {
		console.log("entrou no ng on init");
		this.fetchRequests();
		this.fetchRunningMaintenances();
	}

	fetchRequests(): void {
		this.maintenanceService.getMaintenances("ALL").subscribe({
		next: (data) => {
			this.maintenanceRequests.set(data);
		},
		error: (err) => {
			console.error('erro ao buscar', err);
		}
		});
	}

	openCreateModal(): void {
		this.isCreateModalOpen = true;
	}

	closeCreateModal(): void {
		this.isCreateModalOpen = false;
		this.fetchRequests();
	}

	openDetailModal(id: number): void {
		this.maintenanceService.getById(id).subscribe({
			next: (details) => {
			this.selectedRequestDetails.set(details);
			this.isDetailModalOpen = true;
			},
			error: (err) => {
			console.error('Erro ao buscar detalhes:', err);
			},
		});
	}

	closeDetailModal(): void {
		this.isDetailModalOpen = false;
		this.selectedRequestDetails.set(null);
	}

	private fetchRunningMaintenances() : void {
		this.maintenanceService.getMaintenances("IN_PROGRESS").subscribe({
			next: (data) => {
				this.runningMaintenances.set(data);
			},
			error: (error) => {
				console.error(error);
			},
		});
  	}
}
