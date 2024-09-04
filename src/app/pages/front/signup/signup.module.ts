import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component'; 
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzInputModule } from 'ng-zorro-antd/input';

@NgModule({
  declarations: [
    SignupComponent
  ],
  imports: [
    CommonModule,
    SignupRoutingModule,
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzSelectModule,
    NzRadioModule,
    NzButtonModule,
    NzLayoutModule,
    TranslateModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SignupModule { }
