import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { TeachersListComponent } from './teachers-list/teachers-list.component';
import { LearnersListComponent } from './learners-list/learners-list.component';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzScrollService } from 'ng-zorro-antd/core/services';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTableFilterComponent, NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { PrimarySpaceComponent } from './primary-space/primary-space.component';
import { HighSchoolSpaceComponent } from './high-school-space/high-school-space.component';
import { UniversitySpaceComponent } from './university-space/university-space.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReclamationsComponent } from './reclamations/reclamations.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';


@NgModule({
  declarations: [
    TeachersListComponent,
    LearnersListComponent,
    PrimarySpaceComponent,
    HighSchoolSpaceComponent,
    UniversitySpaceComponent,
    ReclamationsComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NzListModule,
    NzAffixModule,
    NzSkeletonModule,
    NzTableModule,
    NzDropDownModule,
    FormsModule,
    NzButtonModule,
    NzMessageModule,
    NzAlertModule,
    TranslateModule
  ]
})
export class DashboardModule { }
