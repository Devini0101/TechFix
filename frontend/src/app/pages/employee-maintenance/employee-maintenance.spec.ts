import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMaintenance } from './employee-maintenance';

describe('EmployeeMaintenance', () => {
  let component: EmployeeMaintenance;
  let fixture: ComponentFixture<EmployeeMaintenance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeMaintenance],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeMaintenance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
