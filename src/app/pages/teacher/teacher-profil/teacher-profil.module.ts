import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherProfilRoutingModule } from './teacher-profil-routing.module';
import { TeacherProfilComponent } from './teacher-profil.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@NgModule({
  declarations: [
    TeacherProfilComponent
  ],
  imports: [
    CommonModule,
    TeacherProfilRoutingModule,
    TranslateModule
  ]
})
export class TeacherProfilModule { }
