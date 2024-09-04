import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { CourseSpaceRoutingModule } from './course-space-routing.module';
import { CourseSpaceComponent } from './course-space.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ChatbotModule } from '../../shared/chatbot/chatbot.module';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzIconModule } from 'ng-zorro-antd/icon';


@NgModule({
  declarations: [
    CourseSpaceComponent
  ],
  imports: [
    CommonModule,
    CourseSpaceRoutingModule,
    NzListModule, 
    NzCardModule,
    NzGridModule,
    NzModalModule,
    NzButtonModule,
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzPopoverModule,
    NzIconModule,
    ChatbotModule,
    TranslateModule
  ],
  exports: [CourseSpaceComponent],
})
export class CourseSpaceModule { }
