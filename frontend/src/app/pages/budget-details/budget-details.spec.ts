import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetDetails } from './budget-details';

describe('BudgetDetails', () => {
  let component: BudgetDetails;
  let fixture: ComponentFixture<BudgetDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
