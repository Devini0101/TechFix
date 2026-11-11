import { Component, EventEmitter, inject, Injectable, Output} from '@angular/core';
import { MaintenanceRequestService } from '../../../core/services/maintenance-request.service';
import { CategoryService } from '../../../core/services/category.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-report-modal',
  imports: [FormsModule],
  templateUrl: './category-report-modal.html',
  styleUrl: './category-report-modal.css',
})
export class CategoryReportModal{
  	@Injectable() service = inject(MaintenanceRequestService);
  	@Injectable() categoryService = inject(CategoryService);
	@Output() closeModal = new EventEmitter<void>();

	isLoading = false;

	generateReport() {
		this.isLoading = true;
		this.service.downloadCategoryRevenueReport().subscribe({
      		next: (blob: Blob) => {
				// on click on the constructed link build the file
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'relatorio-receitas-categoria.pdf'; //target file name
                a.click();
                window.URL.revokeObjectURL(url);
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Erro ao gerar relatório', err);
                this.isLoading = false;
            }
        });

	}

	close() {
		this.closeModal.emit();
	}
}
