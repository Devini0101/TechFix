import { Component, inject, Input, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe, DatePipe, Location } from '@angular/common';
import { Router } from '@angular/router';
import {
  MaintenanceDetailsResponse,
  MaintenanceRequestService
} from '../../core/services/maintenance-request.service';

@Component({
  selector: 'app-user-budget',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './user-budget.html',
  styleUrl: './user-budget.css',
} )
export class UserBudget {
  constructor(private location: Location) {}

  private router = inject(Router);
  private service = inject(MaintenanceRequestService);

  @Input() id: string | null = '';

  maintenanceDetails =
    signal<MaintenanceDetailsResponse | null>(null);

  errorMessage = signal<string | null>(null);

  successMessage = signal<string | null>(null);

  isSubmitting = signal<boolean>(false);

  approvalCompleted = signal<boolean>(false);

  ngOnInit(): void {
    if (!this.id) {
      console.error('ID da manutenção não fornecido na URL.');
      return;
    }

    this.service.getById(Number(this.id)).subscribe({
      next: (data) => {
        this.maintenanceDetails.set(data);
      },
      error: (err: HttpErrorResponse) => {
        const message =
          err.error?.message
          || 'Ocorreu um erro ao carregar a solicitação.';

        this.errorMessage.set(message);
      },
    });
  }

  answerBudget(answer: string): void {
    if (answer !== 'APPROVED' && answer !== 'REJECTED') {
      return;
    }

    if (!this.id || this.isSubmitting()) {
      return;
    }

    const maintenanceId = Number(this.id);

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.service
      .setBudgetAnswer(maintenanceId, answer)
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);

          if (answer === 'APPROVED') {
            this.successMessage.set(
              'Serviço aprovado com sucesso.'
            );

            this.approvalCompleted.set(true);
          } else {
            this.location.back();
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isSubmitting.set(false);

          const message =
            err.error?.message
            || 'Erro ao responder orçamento.';

          this.errorMessage.set(message);
        },
      });
  }

  rescueMaintenance(): void {
    const details = this.maintenanceDetails();

    if (!details || details.statusCode !== 'REJECTED') {
      return;
    }

    if (!this.id || this.isSubmitting()) {
      return;
    }

    const maintenanceId = Number(this.id);

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.service.rescueService(maintenanceId).subscribe({
      next: () => {
        this.isSubmitting.set(false);

        this.router.navigate([
          '/maintenances',
          this.id
        ]);
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);

        const message =
          err.error?.message
          || 'Erro ao resgatar manutenção.';

        this.errorMessage.set(message);
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}
