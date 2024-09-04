import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighSchoolSpaceComponent } from './high-school-space.component';

describe('HighSchoolSpaceComponent', () => {
  let component: HighSchoolSpaceComponent;
  let fixture: ComponentFixture<HighSchoolSpaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HighSchoolSpaceComponent]
    });
    fixture = TestBed.createComponent(HighSchoolSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
