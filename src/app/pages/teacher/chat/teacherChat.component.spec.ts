import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherChatComponent } from './teacherChat.component';

describe('TeacherChatComponent', () => {
  let component: TeacherChatComponent;
  let fixture: ComponentFixture<TeacherChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherChatComponent]
    });
    fixture = TestBed.createComponent(TeacherChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
