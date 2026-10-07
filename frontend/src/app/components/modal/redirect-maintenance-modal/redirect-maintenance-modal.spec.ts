import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectMaintenanceModal } from './redirect-maintenance-modal';

describe('RedirectMaintenanceModal', () => {
  let component: RedirectMaintenanceModal;
  let fixture: ComponentFixture<RedirectMaintenanceModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedirectMaintenanceModal],
    }).compileComponents();

    fixture = TestBed.createComponent(RedirectMaintenanceModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
