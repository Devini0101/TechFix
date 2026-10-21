import { Component, computed, inject, signal } from '@angular/core';
import { ServiceRequestModal } from '../../components/modal/service-request-modal/service-request-modal';
import { MaintenanceDetailsResponse, MaintenanceRequestService, Summary } from '../../core/services/maintenance-request.service';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../core/services/auth.service';
import { CurrencyPipe } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MaintenanceRepairModal } from '../../components/modal/maintenance-repair-modal/maintenance-repair-modal';
import { Tooltip } from '../../directives/tooltip';
import { MaintenancePaymentModal } from '../../components/modal/maintenance-payment-modal/maintenance-payment-modal';
import { FinishMaintenanceModal } from '../../components/modal/finish-maintenance-modal/finish-maintenance-modal';

@Component({
  selector: 'app-maintenances',
  imports: [ServiceRequestModal, RouterLink, CurrencyPipe, ReactiveFormsModule, MaintenanceRepairModal, Tooltip, MaintenancePaymentModal, FinishMaintenanceModal],
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
	isRepairModalOpened = signal<boolean>(false);
	maintenanceId = signal<number | null>(null)
	maintenances = signal<MaintenanceDetailsResponse[] | null>(null);
	paymentModalOpen = signal<boolean>(false);
	isFinishModalOpened = signal<boolean>(false);
	selectedId = signal<Number | null> (null)

	totalSum = computed(() => {
		const data = this.summary();
		if (!data) return 0;

		return Object.values(data)
		.filter((val): val is number => typeof val === 'number')
		.reduce((acc, curr) => acc + curr, 0);
	});
	searchControl = new FormControl('');

	ngOnInit(): void {
		this.loadSummary();
		this.fetchMaintenances("ALL");
		this.setupSearch();
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

	setupSearch() {
		this.searchControl.valueChanges.pipe(debounceTime(400), distinctUntilChanged())
			.subscribe(() => {
				this.searchMaintenances(this.searchControl.value?.trim() || '');
			})
	}

	searchMaintenances(searchTerm: string) {
		const status = this.activeFilter();
		this.maintenanceService.searchMaintenancesByTermAndStatus(searchTerm, status).subscribe({
			next: (data) => {
				this.maintenances.set(data);
			},
			error: (err) => console.error("erro ao buscar dados", err)
		});
	}

	onMaintenanceCreated(): void {
		this.isCreateModalOpen = false;
		this.loadSummary();
		this.fetchMaintenances("ALL");
	}

	reloadMaintenances() :void{
		const status = this.activeFilter();
		this.fetchMaintenances(status);
	}

	repairMaintenance( id: number) :void {
		this.isRepairModalOpened.set(true)
		this.maintenanceId.set(id)
	}

	openPaymentModal(id : Number) {
		this.selectedId.set(id);
		this.paymentModalOpen.set(true);
  	}

	closePaymentModal(): void {
		const status = this.activeFilter();
		this.fetchMaintenances(status);
		this.paymentModalOpen.set(false);
	}

	openFinishMaintenanceModal(id : Number) :void {
		this.selectedId.set(id);
		this.isFinishModalOpened.set(true);
	}

	closeFinishMaintenanceModal() :void {
		const status = this.activeFilter();
		this.isFinishModalOpened.set(false);
		this.fetchMaintenances(status);
	}
}
