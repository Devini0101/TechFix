import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBudget } from './user-budget';

describe('UserBudget', () => {
  let component: UserBudget;
  let fixture: ComponentFixture<UserBudget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBudget],
    }).compileComponents();

    fixture = TestBed.createComponent(UserBudget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
