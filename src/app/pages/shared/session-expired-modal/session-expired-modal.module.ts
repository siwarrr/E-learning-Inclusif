import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionExpiredModalComponent } from './session-expired-modal.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { TranslateModule, TranslateService } from '@ngx-translate/core';



@NgModule({
  declarations: [
    SessionExpiredModalComponent
  ],
  imports: [
    CommonModule,
    NzModalModule,
    TranslateModule
  ],
  exports: [SessionExpiredModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add CUSTOM_ELEMENTS_SCHEMA here
})
export class SessionExpiredModalModule { }
