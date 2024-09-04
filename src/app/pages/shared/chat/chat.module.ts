import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { FormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { NzResultModule } from 'ng-zorro-antd/result';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    ChatComponent,
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    NzLayoutModule,
    NzInputModule,
    NzListModule,
    FormsModule,
    NzGridModule,
    EmojiModule,
    TranslateModule
  ],
  exports: [ChatComponent]
})
export class ChatModule { }
