import { MaintenanceDetailsResponse, MaintenanceRequestService } from './../../../core/services/maintenance-request.service';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-maintenance-payment-modal',
  imports: [CurrencyPipe],
  templateUrl: './maintenance-payment-modal.html',
  styleUrl: './maintenance-payment-modal.css',
})
export class MaintenancePaymentModal implements OnInit{

  ngOnInit(): void {
    if (this.maintenanceId) {
      this.getMaintenance();
    }
  }

  private maintenanceService = inject(MaintenanceRequestService);
  @Input() maintenanceId: Number | null = null;
  @Output() closeModal = new EventEmitter<void>();

  maintenance = signal<MaintenanceDetailsResponse | null>(null);
  selectedPaymentMethod: 'pix' | 'debit' | 'credit' = 'pix';

  isPaying = signal<boolean>(false);

  paymentError = signal<string | null>(null);

  paymentSuccess = signal<string | null>(null);

  getMaintenance() {
    this.maintenanceService.getById(Number(this.maintenanceId)).subscribe({
      next: (value) => {
        this.maintenance.set(value);
      },
    })
  }

  closePaymentModal(){
    this.closeModal.emit();
  }

  changePaymentMethod(event: Event): void {
    const select = event.target as HTMLSelectElement;

    this.selectedPaymentMethod = select.value as 'pix' | 'debit' | 'credit';
  }

  confirmPayment(): void {

    if ( this.maintenance() === null || this.isPaying()) {
      return;
    }

    this.isPaying.set(true);
    this.paymentError.set(null);

    this.maintenanceService
      .payMaintenance( Number(this.maintenance()?.id), this.selectedPaymentMethod)
      .subscribe({
        next: () => {
          this.isPaying.set(false);
          this.closeModal.emit();
          this.paymentSuccess.set('Pagamento realizado com sucesso.');
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
