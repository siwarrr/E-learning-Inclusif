import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

import { TeacherCourseRoutingModule } from './teacher-course-routing.module';
import { TeacherCourseComponent } from './teacher-course.component';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';


@NgModule({
  declarations: [
    TeacherCourseComponent
  ],
  imports: [
    CommonModule,
    TeacherCourseRoutingModule,
    NzCardModule,
    NzDrawerModule,
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzUploadModule,
    NzButtonModule,
    TranslateModule
  ]
})
export class TeacherCourseModule { }
