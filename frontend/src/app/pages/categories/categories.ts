import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category, CategoryService, CategorySummary } from '../../core/services/category.service';
import { CategoryRegisterModal } from '../../components/modal/category-register-modal/category-register-modal';
import { Tooltip } from '../../directives/tooltip';

@Component({
	selector: 'app-categories',
	standalone: true,
	imports: [CommonModule, FormsModule, CategoryRegisterModal, Tooltip],
	templateUrl: './categories.html',
	styleUrl: './categories.css',
})

export class Categories implements OnInit {
	private catService = inject(CategoryService);

	categories = signal<Category[] | null>(null);
	selectedId = signal<number | null>(null);
	selectedName = signal<string | null>(null);
	isModalOpen = signal(false);
	isDeleteModalOpen = signal(false);
	summary = signal<CategorySummary | null>(null);

	loadSummary() :void {
		this.catService.loadSummary().subscribe({
			next: (value) => {
				this.summary.set(value);
			}
		})
	}

	ngOnInit() {
		this.loadSummary();
		this.loadCategories();
	}

	loadCategories() {
        this.catService.getAll().subscribe({
          next: (data) => {
            if (data && data.length > 0) this.categories.set(data);
          }
        });
	}

	reloadCategories() {
		this.selectedId.set(null);
		this.loadCategories();
		this.loadSummary()
		this.closeModal();
	}

	openCreateModal() {
		this.selectedId.set(null);
		this.isModalOpen.set(true);
	}

	openEditModal(id : number) {
		this.selectedId.set(id);
		this.isModalOpen.set(true);
	}

	openDeleteModal(category : Category) {
		this.selectedName.set(category.name);
		this.selectedId.set(category.id);
		this.isDeleteModalOpen.set(true);
	}

	closeModal() {
		this.selectedId.set(null);
		this.isModalOpen.set(false);
	}

	closeDeleteModal() {
		this.isDeleteModalOpen.set(false);
	}

	delete(id : number | null) {
		this.catService.delete(Number(id)).subscribe({
			next: () => {
				this.loadSummary()
                this.loadCategories();
				this.closeDeleteModal();
            }
		})
	}

	toggleStatus(cat: any): void {
        const newStatus = !cat.active;
        this.catService.toggleStatus(cat.id, newStatus).subscribe({
            next: () => {
				this.loadSummary()
                this.loadCategories();
            }
        });
    }
}