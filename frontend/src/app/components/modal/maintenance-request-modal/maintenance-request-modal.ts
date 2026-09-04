import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaintenanceDetailsResponse } from '../../../core/services/maintenance-request.service';
import { DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-maintenance-request-modal',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './maintenance-request-modal.html',
  styleUrl: './maintenance-request-modal.css',
})
export class MaintenanceRequestModal {
  @Input() request: MaintenanceDetailsResponse | null = null;
  @Output() closeModal = new EventEmitter<void>();
}
