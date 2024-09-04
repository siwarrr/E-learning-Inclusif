import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './teacherChat-routing.module';
import { TeacherChatComponent } from './teacherChat.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ChatModule } from '../../shared/chat/chat.module';
import { TranslateModule } from '@ngx-translate/core';
import { NzBadgeModule } from 'ng-zorro-antd/badge';


@NgModule({
    declarations: [
        TeacherChatComponent
    ],
    imports: [
        CommonModule,
        ChatRoutingModule,
        NzLayoutModule,
        NzInputModule,
        NzListModule,
        FormsModule,
        NzGridModule,
        NzBadgeModule,
        ChatModule,
        TranslateModule
    ]
})
export class teacherChatModule { }
