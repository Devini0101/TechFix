import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaintenanceRequestService } from '../../../core/services/maintenance-request.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-maintenance-repair-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './maintenance-repair-modal.html',
  styleUrl: './maintenance-repair-modal.css',
})
export class MaintenanceRepairModal{
  	private maintenanceService = inject(MaintenanceRequestService);
	private readonly formBuilder = inject(FormBuilder);

    @Input() maintenanceId : Number | null = null;
    @Output() closeModal = new EventEmitter<void>();
    @Output() repairEmmiter = new EventEmitter<void>();

	// mesmos campos do RepairRequestDTO; ambos obrigatórios (@NotBlank no back)
	protected readonly repairForm = this.formBuilder.nonNullable.group({
		fixDescription: ['', [Validators.required]],
		orientation: ['', [Validators.required]],
	});

	// signals: o app é zoneless, então propriedades comuns alteradas no callback do HTTP não atualizam a tela
	protected readonly isSubmitting = signal(false);
	protected readonly errorMessage = signal('');

	repairMaintenance() :void {
		this.errorMessage.set('');

		if (this.repairForm.invalid) {
			this.repairForm.markAllAsTouched();
			return;
		}

		this.isSubmitting.set(true);
		this.maintenanceService.repairMaintenance(Number(this.maintenanceId), this.repairForm.getRawValue()).subscribe({
			next: () => {
				this.isSubmitting.set(false);
				this.repairEmmiter.emit();
				this.closeModal.emit();
			},
			error: (err: HttpErrorResponse) => {
				console.error("Erro ao efetuar manutenção", err);
				this.isSubmitting.set(false);
				this.errorMessage.set(
					err.status === 400
						? 'Verifique os dados informados e tente novamente.'
						: err.error?.message || 'Não foi possível efetuar a manutenção. Tente novamente.',
				);
			},
		});
	}

	protected hasError(fieldName: string): boolean {
		const field = this.repairForm.get(fieldName);
		return !!field && field.invalid && field.touched;
	}
}
