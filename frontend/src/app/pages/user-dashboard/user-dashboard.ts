import { Component, inject, Input } from '@angular/core';
import { ServiceRequestModal } from '../../components/modal/service-request-modal';

@Component({
  selector: 'app-user-dashboard',
  imports: [ServiceRequestModal],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css',
})
export class UserDashboard {
	@Input() name: string | null = '';
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
