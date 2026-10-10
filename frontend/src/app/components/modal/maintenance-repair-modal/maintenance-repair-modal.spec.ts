import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceRepairModal } from './maintenance-repair-modal';

describe('MaintenanceRepairModal', () => {
  let component: MaintenanceRepairModal;
  let fixture: ComponentFixture<MaintenanceRepairModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceRepairModal],
    }).compileComponents();

    fixture = TestBed.createComponent(MaintenanceRepairModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
