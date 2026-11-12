import { Component, computed, inject, signal } from '@angular/core';
import { ServiceRequestModal } from '../../components/modal/service-request-modal/service-request-modal';
import { MaintenanceDetailsResponse, MaintenanceRequestService, Summary } from '../../core/services/maintenance-request.service';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../core/services/auth.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaintenanceRepairModal } from '../../components/modal/maintenance-repair-modal/maintenance-repair-modal';
import { Tooltip } from '../../directives/tooltip';
import { MaintenancePaymentModal } from '../../components/modal/maintenance-payment-modal/maintenance-payment-modal';
import { FinishMaintenanceModal } from '../../components/modal/finish-maintenance-modal/finish-maintenance-modal';
import { ReceiptReportModal } from '../../components/modal/receipt-report-modal/receipt-report-modal';
import { CategoryReportModal } from '../../components/modal/category-report-modal/category-report-modal';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-maintenances',
  imports: [FormsModule, DatePipe, ServiceRequestModal, RouterLink, CurrencyPipe, ReactiveFormsModule, MaintenanceRepairModal, Tooltip, MaintenancePaymentModal, FinishMaintenanceModal, ReceiptReportModal, CategoryReportModal, NgxMaskDirective],
  templateUrl: './maintenances.html',
  styleUrl: './maintenances.css',
})

export class Maintenances {

	private maintenanceService = inject(MaintenanceRequestService);
	private authService = inject(AuthService);
	Role = this.authService.getRole();

	activeFilter = signal<'TODAY' | 'PERIOD' | 'ALL'>('ALL');
	startDate = signal<string>('');
    endDate = signal<string>('');

	summary = signal<Summary | null>(null);
	isCreateModalOpen = false;
	isRepairModalOpened = signal<boolean>(false);
	isReportModalOpened = signal<boolean>(false);
	isCategoryReportModalOpened = signal<boolean>(false);
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
		this.filterByDate('ALL');
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

	filterByDate(type: 'TODAY' | 'PERIOD' | 'ALL'): void {
        this.activeFilter.set(type);

        let start = '';
        let end = '';

        if (type === 'TODAY') {
            const today = new Date().toISOString().split('T')[0]; // Pega YYYY-MM-DD
            start = today;
            end = today;
            this.startDate.set('');
            this.endDate.set('');
        } else if (type === 'PERIOD') {
            start = this.formatDateToAPI(this.startDate());
            end = this.formatDateToAPI(this.endDate());
        } else {
            // ALL
            start = '';
            end = '';
            this.startDate.set('');
            this.endDate.set('');
        }

        this.fetchMaintenances(start, end);
    }
	private fetchMaintenances(startDate: string, endDate: string): void {

        this.maintenanceService.getMaintenances(startDate, endDate).subscribe({
            next: (data) => {
                this.maintenances.set(data);
            }
        });
    }

	setupSearch() {
		this.searchControl.valueChanges.pipe(debounceTime(400), distinctUntilChanged())
			.subscribe(() => {
				this.searchMaintenances(this.searchControl.value?.trim() || '');
			})
	}

	searchMaintenances(searchTerm: string) {
		let start = this.activeFilter() === 'TODAY' ? new Date().toISOString().split('T')[0] : (this.activeFilter() === 'PERIOD' ? this.startDate() : '');
        let end = this.activeFilter() === 'TODAY' ? new Date().toISOString().split('T')[0] : (this.activeFilter() === 'PERIOD' ? this.endDate() : '');

        this.maintenanceService.searchMaintenancesByTermAndDate(searchTerm, start, end).subscribe({
            next: (data) => {
                this.maintenances.set(data);
            }
        });
	}

	onMaintenanceCreated(): void {
		this.isCreateModalOpen = false;
		this.loadSummary();
		this.filterByDate('ALL');
	}

	reloadMaintenances(): void {
        this.filterByDate(this.activeFilter());
    }

    OpenRepairMaintenance(id: number): void {
        this.isRepairModalOpened.set(true);
        this.selectedId.set(id);
    }

    closeRepairModal(): void {
        this.isRepairModalOpened.set(false);
        this.reloadMaintenances();
    }

    openPaymentModal(id: Number) {
        this.selectedId.set(id);
        this.paymentModalOpen.set(true);
    }

    closePaymentModal(): void {
        this.paymentModalOpen.set(false);
        this.reloadMaintenances();
    }

    openFinishMaintenanceModal(id: Number): void {
        this.selectedId.set(id);
        this.isFinishModalOpened.set(true);
    }

    closeFinishMaintenanceModal(): void {
        this.isFinishModalOpened.set(false);
        this.reloadMaintenances();
    }

    private formatDateToAPI(dateBR: string): string {
        if (!dateBR || dateBR.length !== 10) return '';
        const [day, month, year] = dateBR.split('/');
        return `${year}-${month}-${day}`;
    }
}
