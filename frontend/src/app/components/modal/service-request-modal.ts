import { Component, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { Category, CategoryService } from '../../core/services/CategoryService';

@Component({
  selector: 'app-service-request-modal',
  standalone: true,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs">
		<div class="relative w-full max-w-md p-6 bg-gray-700 rounded-xl shadow-2xl border border-gray-300">
		<h3 class="text-xl font-semibold">Criar nova solicitação de serviço:</h3>
		<form class="flex flex-col mt-2 gap-1.5">
			<div class="form-group flex flex-col gap-2">
				<div class="flex gap-1">Item do serviço <p class="text-red-700">*</p></div>
				<input type="text" placeholder="Digite aqui o item no serviço" class="rounded p-2 border border-gray-200 focus:border-blue-900">
			</div>
			<div class="form-group flex flex-col gap-2">
				<p>Descrição do item (opcional)</p>
				<input type="text" placeholder="Descreva o item" class="rounded p-2 border border-gray-200 focus:border-blue-900">
			</div>
            <div class="form-group flex flex-col gap-2">
				<div class="flex gap-1">Defeito do Item <p class="text-red-700">*</p></div>
				<input type="text" placeholder="Digite aqui o defeito do item" class="rounded p-2 border border-gray-200 focus:border-blue-900">
			</div>
            <div class="form-group flex flex-col gap-2">
				<div class="flex gap-1">Categoria <p class="text-red-700">*</p></div>
                <select class="rounded p-2 border border-gray-200 focus:border-blue-900">
                    <option selected hidden value="">-- Selecione uma categoria --</option>
                    @for (cat of categories(); track cat.code) {
                        <option class="bg-gray-700" [value]="cat.code">{{ cat.name }}</option>
                    }
                </select>
			</div>
		</form>
		<div class="flex justify-end gap-3 mt-2">
			<button (click)="closeModal.emit()" class="px-4 py-2 bg-gray-100 rounded-lg text-black border border-gray-200 hover:scale-105  hover:cursor-pointer">Cancelar</button>
			<button (click)="closeModal.emit()" class="px-4 py-2 text-white border border-white bg-green-800 rounded-lg hover:scale-105 hover:cursor-pointer">Confirmar</button>
		</div>
		</div>
	</div>
  `
})
export class ServiceRequestModal implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  private categoryService = inject(CategoryService);
  categories = signal<Category[]>([]);

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories.set(data);
      }
    });
  }
}