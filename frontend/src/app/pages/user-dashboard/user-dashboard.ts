import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MaintenanceDetailsResponse, MaintenanceRequestService, Summary } from '../../core/services/maintenance-request.service';
import { ServiceRequestModal } from '../../components/modal/service-request-modal/service-request-modal';
import { MaintenanceRequestModal } from '../../components/modal/maintenance-request-modal/maintenance-request-modal';
import { RouterLink } from "@angular/router";
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
	selector: 'app-user-dashboard',
	imports: [
  ServiceRequestModal,
  RouterLink,
  DatePipe,
  CurrencyPipe
],
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

	summary = signal<Summary | null>(null);
	  paymentModalOpen = signal<boolean>(false);

  selectedMaintenance =
    signal<MaintenanceDetailsResponse | null>(null);

  selectedPaymentMethod:
    'pix' | 'debit' | 'credit' = 'pix';

  isPaying = signal<boolean>(false);

  paymentError = signal<string | null>(null);

  paymentSuccess = signal<string | null>(null);

  	private maintenanceService = inject(MaintenanceRequestService);

	ngOnInit(): void {
		this.fetchRequests();
		this.maintenanceService.getSummary().subscribe(
			{
				next: (data) => this.summary.set(data)
			}
		);
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
	}

	onMaintenanceCreated(): void {
		this.isCreateModalOpen = false;
		this.fetchRequests();
	}
	  openPaymentModal(
    maintenance: MaintenanceDetailsResponse
  ): void {
    this.selectedMaintenance.set(maintenance);
    this.selectedPaymentMethod = 'pix';
    this.paymentError.set(null);
    this.paymentSuccess.set(null);
    this.paymentModalOpen.set(true);
  }

  closePaymentModal(): void {
    if (this.isPaying()) {
      return;
    }

    this.paymentModalOpen.set(false);
    this.selectedMaintenance.set(null);
    this.paymentError.set(null);
  }

  changePaymentMethod(event: Event): void {
    const select = event.target as HTMLSelectElement;

    this.selectedPaymentMethod =
      select.value as 'pix' | 'debit' | 'credit';
  }

  confirmPayment(): void {
    const maintenance = this.selectedMaintenance();

    if (!maintenance || this.isPaying()) {
      return;
    }

    this.isPaying.set(true);
    this.paymentError.set(null);

    this.maintenanceService
      .payMaintenance(
        maintenance.id,
        this.selectedPaymentMethod
      )
      .subscribe({
        next: () => {
          this.isPaying.set(false);
          this.paymentModalOpen.set(false);
          this.paymentSuccess.set(
            'Pagamento realizado com sucesso.'
          );
          this.fetchRequests();
        },
        error: (err) => {
          this.isPaying.set(false);

          const message =
            err.error?.message
            || 'Não foi possível realizar o pagamento.';

          this.paymentError.set(message);
        }
      });
  }
}
