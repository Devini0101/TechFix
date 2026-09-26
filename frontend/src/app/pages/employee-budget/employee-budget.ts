import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MaintenanceDetailsResponse, MaintenanceRequestService } from '../../core/services/maintenance-request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe, Location } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxCurrencyDirective } from 'ngx-currency';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-employee-budget',
  imports: [DatePipe, NgxCurrencyDirective, ReactiveFormsModule],
  templateUrl: './employee-budget.html',
  styleUrl: './employee-budget.css',
})
export class EmployeeBudget implements OnInit {
	constructor(private location: Location) {}

	@Input() id: string | null = '';
	private service = inject(MaintenanceRequestService);
	maintenanceDetails = signal<MaintenanceDetailsResponse | null>(null);
	errorMessage = signal<string | null>(null);
    isSubmitting = signal<boolean>(false);
	budgetValue = new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(0.01)
    ]);

	ngOnInit(): void {
		if (!this.id) {
		console.error("ID da manutenção não fornecido na URL.");
		return;
		}

		this.service.getById(Number(this.id) ).subscribe({
			next: (data) => this.maintenanceDetails.set(data),
			error: (err: HttpErrorResponse) => {
				console.error("Erro ao puxar info por id", err);
				const msg = err.error?.message || 'Ocorreu um erro ao carregar a solicitação.';
				this.errorMessage.set(msg);
			},
    	});
  	}

	submitBudget() :void {
		if ( this.budgetValue.invalid ) {
			this.budgetValue.markAsTouched();
			return;
		}

		if (!this.id) return;

		this.isSubmitting.set(true);
		const formattedValue = this.budgetValue.value;
		if (!formattedValue) return;

		this.service.setBudget(Number(this.id), formattedValue).subscribe({
			next: () => {
                this.isSubmitting.set(false);
                this.location.back();
            },
            error: (err: HttpErrorResponse) => {
                this.isSubmitting.set(false);
                this.errorMessage.set('Erro ao salvar o orçamento.');
            }
		})
	}
}
