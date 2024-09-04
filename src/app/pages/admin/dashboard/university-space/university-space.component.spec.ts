import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversitySpaceComponent } from './university-space.component';

describe('UniversitySpaceComponent', () => {
  let component: UniversitySpaceComponent;
  let fixture: ComponentFixture<UniversitySpaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UniversitySpaceComponent]
    });
    fixture = TestBed.createComponent(UniversitySpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
