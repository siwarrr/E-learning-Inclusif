import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseSpaceComponent } from './course-space.component';

describe('CourseSpaceComponent', () => {
  let component: CourseSpaceComponent;
  let fixture: ComponentFixture<CourseSpaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseSpaceComponent]
    });
    fixture = TestBed.createComponent(CourseSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
