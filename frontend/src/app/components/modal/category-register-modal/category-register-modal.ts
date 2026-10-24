import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category, CategoryPayload, CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-category-register-modal',
  standalone: true,
  imports: [FormsModule], // <-- Adicione aqui
  templateUrl: './category-register-modal.html',
  styleUrl: './category-register-modal.css',
})
export class CategoryRegisterModal implements OnInit {
    private service = inject(CategoryService);

    @Input() categoryId: number | null = null;
    @Output() closeModalEmitter = new EventEmitter<void>();
    @Output() succesfullyRequested = new EventEmitter<void>();

    categoryData: CategoryPayload = {
        name: '',
        code: '',
        active: true
    };

    isEditing = signal<boolean>(false);

    ngOnInit(): void {
        if (this.categoryId) {
            this.service.getCategory(Number(this.categoryId)).subscribe({
               next: (value) => {
                    this.categoryData = {
                        name: value.name,
                        code: value.code,
                        active: value.active
                    };
                    this.isEditing.set(true);
                },
            });
        }
    }

    closeModal(): void {
        this.closeModalEmitter.emit();
    }

    saveCategory(): void {
        if (this.isEditing()) {
            this.service.editCategory(Number(this.categoryId), this.categoryData).subscribe({
                next: () => this.succesfullyRequested.emit(),
            });
        } else {
            this.service.createCategory(this.categoryData).subscribe({
                next: () => this.succesfullyRequested.emit(),
            });
        }
    }

    formatCategoryCode(value: string): void {
        if (value) {
            this.categoryData.code = value.toUpperCase().replace(/\s+/g, '_');
        } else {
            this.categoryData.code = '';
        }
    }
}