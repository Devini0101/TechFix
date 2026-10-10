import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MaintenanceDetailsResponse, MaintenanceHistory, MaintenanceRequestService } from '../../core/services/maintenance-request.service';
import { CurrencyPipe, DatePipe, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Tooltip } from '../../directives/tooltip';
import { RedirectMaintenanceModal } from '../../components/modal/redirect-maintenance-modal/redirect-maintenance-modal';
import { MaintenanceRepairModal } from '../../components/modal/maintenance-repair-modal/maintenance-repair-modal';

@Component({
  selector: 'app-maintenance-details',
  imports: [DatePipe, CurrencyPipe, RouterLink, Tooltip, RedirectMaintenanceModal, MaintenanceRepairModal],
  templateUrl: './maintenance-details.html',
  styleUrl: './maintenance-details.css',
})
export class MaintenanceDetails implements OnInit {
  @Input() id!: string;

  details = signal<MaintenanceDetailsResponse | null>(null);
  errorMessage = signal<string | null>(null);
  readonly STATUS_ORDER: Record<string, number> = {
    'OPEN': 1,
    'QUOTED': 2,
    'REJECTED': 3,
    'APPROVED': 4,
    'REDIRECTED': 4.1,
    'REPAIRED': 5,
    'DELIVERED': 6
  };

  private service = inject(MaintenanceRequestService);
  private location = inject(Location);
  private authService = inject(AuthService);
  readonly role = this.authService.getRole();
  isHistoryOpened = signal<Boolean>(false);
  isRedirectModalOpened = signal<Boolean>(false);
  isRepairModalOpened = signal<boolean>(false);
  histories = signal<MaintenanceHistory[] | null>(null);

  ngOnInit(): void {
    if (!this.id) {
      console.error("ID da manutenção não fornecido na URL.");
      return;
    }

    this.loadOrderDetails(Number(this.id));
  }

  private get currentStatusCode(): string | null {
    const data = this.details();
    return data?.statusCode || null;
  }

  private getCurrentLevel(): number {
    const code = this.currentStatusCode;
    return code ? (this.STATUS_ORDER[code] ?? 0) : 0;
  }

  isCurrent(status: string): boolean {
    return this.currentStatusCode === status;
  }

  isCompleted(status: string): boolean {
    if (this.currentStatusCode === 'REJECTED') {
      return (this.STATUS_ORDER[status] ?? 0) < 3;
    }
    return this.getCurrentLevel() > (this.STATUS_ORDER[status] ?? 0);
  }

  isPending(status: string): boolean {
    if (this.currentStatusCode === 'REJECTED') {
      return false;
    }
    return this.getCurrentLevel() < (this.STATUS_ORDER[status] ?? 0);
  }

	toggleHistory(){
		this.isHistoryOpened.set(!this.isHistoryOpened());

		if (this.isHistoryOpened() && this.histories() === null){
			this.service.getHistory(Number(this.id)).subscribe({
			next: (data) => this.histories.set(data),
			error: (err: HttpErrorResponse) => {
				console.error("Erro ao puxar histórico", err);
			}
			});
		}
	}

  openRedirectModal() : void {
    this.isRedirectModalOpened.set(!this.isRedirectModalOpened());
  }

	goBack(): void {
    	this.location.back(); // Retorna para a exata URL anterior no histórico
	}

	reloadMaintenance() {
		this.loadOrderDetails(Number(this.id));
	}

	loadOrderDetails(id: number) {
		this.service.getById(Number(this.id) ).subscribe({
			next: (data) => this.details.set(data),
			error: (err: HttpErrorResponse) => {
				console.error("Erro ao puxar info por id", err);
				const msg = err.error?.message || 'Ocorreu um erro ao carregar a solicitação.';
				this.errorMessage.set(msg);
			},
		});
	}

  repairMaintenance() :void {
    this.service.repairMaintenance(Number(this.id)).subscribe( {
      next: (data) => this.loadOrderDetails(Number(this.id)),
      error: (err: HttpErrorResponse) => {
				console.error("Erro ao puxar info por id", err);
				const msg = err.error?.message || 'Ocorreu um erro ao carregar a solicitação.';
				this.errorMessage.set(msg);
			},
    });
  }
}
