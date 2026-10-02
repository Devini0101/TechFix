import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeBudget } from './employee-budget';

describe('EmployeeBudget', () => {
  let component: EmployeeBudget;
  let fixture: ComponentFixture<EmployeeBudget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeBudget],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeBudget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
