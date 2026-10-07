import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-redirect-maintenance-modal',
  imports: [],
  templateUrl: './redirect-maintenance-modal.html',
  styleUrl: './redirect-maintenance-modal.css',
})
export class RedirectMaintenanceModal {
  @Input() maintenanceId : Number | null = null;
  @Output() closeModal = new EventEmitter<void>();
}
