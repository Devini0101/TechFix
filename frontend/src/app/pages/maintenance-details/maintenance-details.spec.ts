import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceDetails } from './maintenance-details';

describe('MaintenanceDetails', () => {
  let component: MaintenanceDetails;
  let fixture: ComponentFixture<MaintenanceDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(MaintenanceDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
