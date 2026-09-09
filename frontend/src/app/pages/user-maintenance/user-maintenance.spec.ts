import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMaintenance } from './user-maintenance';

describe('UserMaintenance', () => {
  let component: UserMaintenance;
  let fixture: ComponentFixture<UserMaintenance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMaintenance],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMaintenance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
