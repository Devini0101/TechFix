import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-service-request-modal',
  standalone: true,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs">
		<div class="relative w-full max-w-md p-6 bg-gray-700 rounded-xl shadow-2xl border border-gray-300">
		<h3 class="text-xl font-semibold">Criar nova solicitação de serviço:</h3>
		<form class="flex flex-col mt-2">
			<div class="form-group flex flex-col gap-2">
				<p>Digite o Item do serviço</p>
				<input type="text" placeholder="Digite aqui o tem no serviço" class="rounded p-2 border border-gray-200 focus:border-blue-900">
			</div>
			<div class="form-group flex flex-col gap-2">
				<p>Digite o Item do serviço</p>
				<input type="text" placeholder="Digite aqui o tem no serviço" class="rounded p-2 border border-gray-200 focus:border-blue-900">
			</div>
		</form>
		<div class="flex justify-end gap-3 mt-2">
			<button (click)="closeModal.emit()" class="px-4 py-2 bg-gray-100 rounded-lg text-black border border-gray-200 hover:scale-105  hover:cursor-pointer">Cancel</button>
			<button (click)="closeModal.emit()" class="px-4 py-2 text-white border border-white bg-green-800 rounded-lg hover:scale-105 hover:cursor-pointer">Confirm</button>
		</div>
		</div>
	</div>
  `
})
export class ServiceRequestModal {
  // @Output permite que o modal avise quem o chamou que é hora de fechar
  @Output() closeModal = new EventEmitter<void>();
}