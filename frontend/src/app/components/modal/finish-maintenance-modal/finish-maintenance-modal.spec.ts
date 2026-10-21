import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishMaintenanceModal } from './finish-maintenance-modal';

describe('FinishMaintenanceModal', () => {
  let component: FinishMaintenanceModal;
  let fixture: ComponentFixture<FinishMaintenanceModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinishMaintenanceModal],
    }).compileComponents();

    fixture = TestBed.createComponent(FinishMaintenanceModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
