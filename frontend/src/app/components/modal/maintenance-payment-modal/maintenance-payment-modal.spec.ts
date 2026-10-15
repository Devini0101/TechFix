import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenancePaymentModal } from './maintenance-payment-modal';

describe('MaintenancePaymentModal', () => {
  let component: MaintenancePaymentModal;
  let fixture: ComponentFixture<MaintenancePaymentModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenancePaymentModal],
    }).compileComponents();

    fixture = TestBed.createComponent(MaintenancePaymentModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
