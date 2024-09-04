import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseFormEditComponent } from './course-form-edit.component';

describe('CourseFormEditComponent', () => {
  let component: CourseFormEditComponent;
  let fixture: ComponentFixture<CourseFormEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseFormEditComponent]
    });
    fixture = TestBed.createComponent(CourseFormEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
