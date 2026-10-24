import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryRegisterModal } from './category-register-modal';

describe('CategoryRegisterModal', () => {
  let component: CategoryRegisterModal;
  let fixture: ComponentFixture<CategoryRegisterModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryRegisterModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryRegisterModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
