import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MaintenanceDetailsResponse, MaintenanceRequestService, Summary } from '../../core/services/maintenance-request.service';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-employee-dashboard',
	imports: [DatePipe, RouterLink],
	templateUrl: './employee-dashboard.html',
	styleUrl: './employee-dashboard.css',
})
export class EmployeeDashboard implements OnInit {
	@Input() name: string | null = '';
	private maintenanceService = inject(MaintenanceRequestService);
	maintenanceRequests = signal<MaintenanceDetailsResponse[] | null>(null);
	dashboardSummary = signal<Summary | null>(null);

	ngOnInit(): void {
		this.fetchRequests();
	}

	fetchRequests() : void {
		this.maintenanceService.getMaintenances("OPEN").subscribe({
			next: (data) => {
				this.maintenanceRequests.set(data)
			},
			error: (err) => {
				console.error('erro ao buscar', err);
			},
		});
	}

	fetchSummary() :void{
		this.maintenanceService.getSummary().subscribe({
			next: (data) => {
				this.dashboardSummary.set(data);
			},
			error: (err) => {
			},
		});
	}
}