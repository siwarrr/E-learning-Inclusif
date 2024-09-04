import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseContentRoutingModule } from './course-content-routing.module';
import { CourseContentComponent } from './course-content.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { LessonComponent } from './lesson/lesson.component';
import { QuizComponent } from './quiz/quiz.component';
import { TranslateModule } from '@ngx-translate/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { CourseCompletedComponent } from './course-completed/course-completed.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';


@NgModule({
  declarations: [
    CourseContentComponent,
    LessonComponent,
    QuizComponent,
    CourseCompletedComponent
  ],
  imports: [
    CommonModule,
    CourseContentRoutingModule,
    NzLayoutModule,
    NzSliderModule,
    NzCardModule,
    NzCollapseModule,
    NzTabsModule,
    NzDescriptionsModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
    NzCommentModule,
    NzButtonModule,
    NzToolTipModule,
    NzIconModule,
    NzRateModule,
    NzDividerModule,
    NzRadioModule,
    NzCheckboxModule,
    NzResultModule,
    NzProgressModule,
    NzIconModule,
    NzButtonModule,
    NzModalModule,
    TranslateModule
  ]
})
export class CourseContentModule { }
