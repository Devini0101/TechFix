import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryReportModal } from './category-report-modal';

describe('CategoryReportModal', () => {
  let component: CategoryReportModal;
  let fixture: ComponentFixture<CategoryReportModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryReportModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryReportModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
