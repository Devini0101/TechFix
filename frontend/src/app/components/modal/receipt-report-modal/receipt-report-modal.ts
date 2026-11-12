import { Component, EventEmitter, inject, Inject, Injectable, Output } from '@angular/core';
import { MaintenanceRequestService } from '../../../core/services/maintenance-request.service';
import { FormsModule, NgModel } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-receipt-report-modal',
  imports: [FormsModule, NgxMaskDirective],
  templateUrl: './receipt-report-modal.html',
  styleUrl: './receipt-report-modal.css',
})
export class ReceiptReportModal {
	@Injectable() service = inject(MaintenanceRequestService);
	@Output() closeModal = new EventEmitter<void>();

	startDate: string = '';
	endDate: string = '';
	isLoading = false;

	generateReport() {
		this.isLoading = true;

		this.service.downloadRevenueReport(this.startDate, this.endDate).subscribe({
            next: (blob: Blob) => {
				// on click on the constructed link build the file
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'relatorio-receitas.pdf'; //target file name
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
