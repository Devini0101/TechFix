import { Component, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { Category, CategoryService } from '../../core/services/CategoryService';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaintenanceRequestService } from '../../core/services/maintenance-request.service';

@Component({
    selector: 'app-service-request-modal',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './service-request-modal.html',
})
export class ServiceRequestModal implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  private categoryService = inject(CategoryService);
  categories = signal<Category[]>([]);

  private readonly formBuilder = inject(FormBuilder);
  private readonly requestService = inject(MaintenanceRequestService);

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories.set(data);
      }
    });
  }

  protected readonly requestForm = this.formBuilder.nonNullable.group({
    item: ['', [Validators.required, Validators.maxLength(255)]],
    itemDescription: ['', [Validators.required]],
    itemDefect: ['', [Validators.required]],
    categoryCode: ['', [Validators.required, Validators.min(1)]],
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
          categoryCode: '',
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