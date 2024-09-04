import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { ChatbotModule } from '../../shared/chatbot/chatbot.module';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzImageModule } from 'ng-zorro-antd/image';
import { FacebookOutline, TwitterOutline, InstagramOutline } from '@ant-design/icons-angular/icons';

const icons = [ FacebookOutline, TwitterOutline, InstagramOutline ];

@NgModule({
  declarations: 
  [WelcomeComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    WelcomeRoutingModule,
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
    NzSkeletonModule,
    NzPopoverModule,
    NzButtonModule,
    NzModalModule,
    NzIconModule,
    NzImageModule,
    NzIconModule.forRoot(icons),
    ChatbotModule,
    TranslateModule

  ]
})
export class WelcomeModule { }
