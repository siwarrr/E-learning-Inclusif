import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentChatRoutingModule } from './student-chat-routing.module';
import { StudentChatComponent } from './student-chat.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { FormsModule } from '@angular/forms';
import { ChatModule } from '../../shared/chat/chat.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

@NgModule({
  declarations: [
    StudentChatComponent
  ],
  imports: [
    CommonModule,
    StudentChatRoutingModule,
    NzLayoutModule,
    NzInputModule,
    NzListModule,
    FormsModule,
    NzBadgeModule,
    ChatModule,
    NzPopoverModule,
    TranslateModule
  ]
})
export class StudentChatModule { }
