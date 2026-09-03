import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MaintenanceRequestService } from '../../core/services/maintenance-request.service';

@Component({
  selector: 'app-service-request-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './service-request-modal.html',
  styleUrl: './service-request-modal.css',
})
export class ServiceRequestModal {
  @Output() closeModal = new EventEmitter<void>();

  private readonly formBuilder = inject(FormBuilder);
  private readonly requestService = inject(MaintenanceRequestService);

  protected readonly categories = [
    { id: 1, name: 'Smartphone' },
    { id: 2, name: 'Notebook' },
    { id: 3, name: 'Computador Desktop' },
    { id: 4, name: 'Console de Videogame' },
    { id: 5, name: 'Tablet' },
    { id: 6, name: 'Smartwatch' },
    { id: 7, name: 'Periféricos e Acessórios' },
    { id: 8, name: 'Placa de Vídeo (GPU)' },
  ];

  protected readonly requestForm = this.formBuilder.nonNullable.group({
    item: ['', [Validators.required, Validators.maxLength(255)]],
    itemDescription: ['', [Validators.required]],
    itemDefect: ['', [Validators.required]],
    categoryId: [0, [Validators.required, Validators.min(1)]],
  });

  protected isSubmitting = false;
  protected successMessage = '';
  protected errorMessage = '';

  protected submit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.requestService.create(this.requestForm.getRawValue()).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Solicitação registrada com sucesso.';
        this.requestForm.reset({
          item: '',
          itemDescription: '',
          itemDefect: '',
          categoryId: 0,
        });
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage =
          'Não foi possível registrar a solicitação. Tente novamente.';
      },
    });
  }

  protected hasError(fieldName: string): boolean {
    const field = this.requestForm.get(fieldName);
    return !!field && field.invalid && field.touched;
  }
}