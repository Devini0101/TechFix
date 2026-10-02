import { Component, inject, Input, signal } from '@angular/core';
import { MaintenanceDetailsResponse, MaintenanceRequestService } from '../../core/services/maintenance-request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe, DatePipe, Location } from '@angular/common';

@Component({
  selector: 'app-user-budget',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './user-budget.html',
  styleUrl: './user-budget.css',
})
export class UserBudget {
	constructor(private location: Location) {}
	private service = inject(MaintenanceRequestService);
	@Input() id: string | null = '';

	maintenanceDetails = signal<MaintenanceDetailsResponse | null>(null);
	errorMessage = signal<string | null>(null);
  	isSubmitting = signal<boolean>(false);

	ngOnInit(): void {
		if (!this.id) {
			console.error("ID da manutenção não fornecido na URL.");
			return;
		}

		this.service.getById(Number(this.id) ).subscribe({
			next: (data) => this.maintenanceDetails.set(data),
			error: (err: HttpErrorResponse) => {
				const msg = err.error?.message || 'Ocorreu um erro ao carregar a solicitação.';
				this.errorMessage.set(msg);
			},
		});
	}

	answerBudget ( answer : String) : void {
		if (answer != "APPROVED" && answer != "REJECTED") {
			return;
		}

		this.service.setBudgetAnswer(Number(this.id), answer).subscribe(
			{
				next: (data) => this.location.back() ,
				error : (err) => {
					const msg = err.error?.message || 'Erro ao responder orçamento';
					this.errorMessage.set(msg);
				},
			}
		);
	}
}
