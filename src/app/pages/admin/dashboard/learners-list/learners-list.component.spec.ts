import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnersListComponent } from './learners-list.component';

describe('LearnersListComponent', () => {
  let component: LearnersListComponent;
  let fixture: ComponentFixture<LearnersListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LearnersListComponent]
    });
    fixture = TestBed.createComponent(LearnersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
