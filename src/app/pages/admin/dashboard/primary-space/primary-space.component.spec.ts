import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimarySpaceComponent } from './primary-space.component';

describe('PrimarySpaceComponent', () => {
  let component: PrimarySpaceComponent;
  let fixture: ComponentFixture<PrimarySpaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrimarySpaceComponent]
    });
    fixture = TestBed.createComponent(PrimarySpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
