import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MaintenanceDetailsResponse, MaintenanceRequestService } from '../../core/services/maintenance-request.service';
import { CurrencyPipe, DatePipe, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-maintenance-details',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './maintenance-details.html',
  styleUrl: './maintenance-details.css',
})
export class MaintenanceDetails implements OnInit {
  @Input() id!: string;

  details = signal<MaintenanceDetailsResponse | null>(null);
  errorMessage = signal<string | null>(null);
  readonly STATUS_ORDER: Record<string, number> = {
    'OPEN': 1,
    'QUOTING': 2,
    'WAITING_APPROVAL': 3,
    'APPROVED': 4,
    'IN_PROGRESS': 5,
    'FINISHED': 6,
    'DELIVERED': 7,
    'REJECTED': 4
  };
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
      return (this.STATUS_ORDER[status] ?? 0) < 4;
    }
    return this.getCurrentLevel() > (this.STATUS_ORDER[status] ?? 0);
  }

  isPending(status: string): boolean {
    if (this.currentStatusCode === 'REJECTED') {
      return false;
    }
    return this.getCurrentLevel() < (this.STATUS_ORDER[status] ?? 0);
  }
  private service = inject(MaintenanceRequestService);
  private location = inject(Location);

  ngOnInit(): void {
    if (!this.id) {
      console.error("ID da manutenção não fornecido na URL.");
      return;
    }

    this.service.getById(Number(this.id) ).subscribe({
      next: (data) => this.details.set(data),
      error: (err: HttpErrorResponse) => {
        console.error("Erro ao puxar info por id", err);
        const msg = err.error?.message || 'Ocorreu um erro ao carregar a solicitação.';
        this.errorMessage.set(msg);
      },
    });
  }

  goBack(): void {
    this.location.back(); // Retorna para a exata URL anterior no histórico
  }

}
