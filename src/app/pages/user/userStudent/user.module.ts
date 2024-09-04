import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { FormsModule } from '@angular/forms';
import { CourseSpaceModule } from '../course-space/course-space.module';
import { TranslateModule } from '@ngx-translate/core';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { ChatbotModule } from '../../shared/chatbot/chatbot.module';
import { FacebookOutline, TwitterOutline, InstagramOutline } from '@ant-design/icons-angular/icons';

const icons = [ FacebookOutline, TwitterOutline, InstagramOutline ];

@NgModule({
    declarations: [
        UserComponent
    ],
    imports: [
        CommonModule,
        UserRoutingModule,
        NzLayoutModule,
        NzMenuModule,
        NzButtonModule,
        NzIconModule,
        NzGridModule,
        NzCardModule,
        NzCarouselModule,
        NzListModule,
        NzBackTopModule,
        NzSwitchModule,
        FormsModule,
        NzDropDownModule,
        NzCommentModule,
        NzPopoverModule,
        NzIconModule.forRoot(icons),
        ChatbotModule,
        TranslateModule
    ]
})
export class UserModule { }
