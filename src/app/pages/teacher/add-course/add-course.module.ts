import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCourseRoutingModule } from './add-course-routing.module';
import { AddCourseComponent } from './add-course.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { CourseSectionComponent } from './course-section/course-section.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { CourseFormEditComponent } from './course-form-edit/course-form-edit.component';
import { LessonVideoDirective } from './directives/lesson-video.directive';
import { LessonExerciseDirective } from './directives/lesson-exercise.directive';
import { TranslateModule } from '@ngx-translate/core';
import { NzImageModule } from 'ng-zorro-antd/image';


@NgModule({
  declarations: [
    AddCourseComponent,
    CourseSectionComponent,
    CourseFormEditComponent,
    LessonVideoDirective,
    LessonExerciseDirective
  ],
  imports: [
    CommonModule,
    AddCourseRoutingModule,
    NzCardModule,
    NzDrawerModule,
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzUploadModule,
    NzModalModule,
    NzCollapseModule,
    NzButtonModule,
    NzStepsModule,
    NzRadioModule,
    NzCheckboxModule,
    NzImageModule,
    NzUploadModule,
    TranslateModule,
  ]
})
export class AddCourseModule { }
