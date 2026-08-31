import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDashboard } from './employee-dashboard';

describe('EmployeeDashboard', () => {
  let component: EmployeeDashboard;
  let fixture: ComponentFixture<EmployeeDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
