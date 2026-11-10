import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptReportModal } from './receipt-report-modal';

describe('ReceiptReportModal', () => {
  let component: ReceiptReportModal;
  let fixture: ComponentFixture<ReceiptReportModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiptReportModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceiptReportModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
