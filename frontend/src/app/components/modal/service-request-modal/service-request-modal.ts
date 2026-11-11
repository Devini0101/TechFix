import { Component, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Category, CategoryService } from '../../../core/services/category.service';
import { MaintenanceRequestService } from '../../../core/services/maintenance-request.service';

@Component({
    selector: 'app-service-request-modal',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './service-request-modal.html',
})
export class ServiceRequestModal implements OnInit {
  @Output() requestCreated = new EventEmitter<void>();
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
    itemDescription: ['', [Validators.maxLength(30)]], // mesmo limite do @Length no MaintenanceRequestDTO
    itemDefect: ['', [Validators.required]],
    categoryCode: ['', [Validators.required, Validators.min(1)]],
  });

  // signals: o app é zoneless, então propriedades comuns alteradas no callback do HTTP não atualizam a tela
  protected readonly isSubmitting = signal(false);
  protected readonly successMessage = signal('');
  protected readonly errorMessage = signal('');

  protected submit(): void {
    this.successMessage.set('');
    this.errorMessage.set('');

    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.requestService.create(this.requestForm.getRawValue()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.successMessage.set('Solicitação registrada com sucesso.');
        this.requestForm.reset({
          item: '',
          itemDescription: '',
          itemDefect: '',
          categoryCode: '',
        });
        this.requestCreated.emit();
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          err.status === 400
            ? 'Verifique os dados informados e tente novamente.'
            : 'Não foi possível registrar a solicitação. Tente novamente.',
        );
        },
    });
  }

  protected hasError(fieldName: string): boolean {
    const field = this.requestForm.get(fieldName);
    return !!field && field.invalid && field.touched;
  }
}
