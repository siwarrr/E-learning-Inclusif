import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamationsComponent } from './reclamations.component';

describe('ReclamationsComponent', () => {
  let component: ReclamationsComponent;
  let fixture: ComponentFixture<ReclamationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReclamationsComponent]
    });
    fixture = TestBed.createComponent(ReclamationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
