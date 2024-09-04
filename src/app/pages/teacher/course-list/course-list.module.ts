import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzListModule } from 'ng-zorro-antd/list';

import { CourseListRoutingModule } from './course-list-routing.module';
import { CourseListComponent } from './course-list.component';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    CourseListComponent
  ],
  imports: [
    CommonModule,
    CourseListRoutingModule,
    NzListModule,
    NzDrawerModule,
    NzButtonModule,
    TranslateModule
  ]
})
export class CourseListModule { }
