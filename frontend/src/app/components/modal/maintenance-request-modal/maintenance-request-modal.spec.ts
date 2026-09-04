import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceRequestModal } from './maintenance-request-modal';

describe('MaintenanceRequestModal', () => {
  let component: MaintenanceRequestModal;
  let fixture: ComponentFixture<MaintenanceRequestModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceRequestModal],
    }).compileComponents();

    fixture = TestBed.createComponent(MaintenanceRequestModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
