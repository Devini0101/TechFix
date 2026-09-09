import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Maintenances } from './maintenances';

describe('Maintenances', () => {
  let component: Maintenances;
  let fixture: ComponentFixture<Maintenances>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Maintenances],
    }).compileComponents();

    fixture = TestBed.createComponent(Maintenances);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
