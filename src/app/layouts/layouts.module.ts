import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzDropDownModule, NzDropdownButtonDirective } from 'ng-zorro-antd/dropdown';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { RouterModule } from '@angular/router';
import { WelcomeLayoutComponent } from './welcome-layout/welcome-layout.component';
import { TeacherLayoutComponent } from './teacher-layout/teacher-layout.component';
import { TranslateModule } from '@ngx-translate/core';
import { WelcomeModule } from '../pages/front/welcome/welcome.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { NzResultComponent, NzResultModule } from 'ng-zorro-antd/result';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { SearchResultsModule } from '../pages/shared/search-results/search-results.module';


@NgModule({
  declarations: [
    AdminLayoutComponent,
    UserLayoutComponent,
    WelcomeLayoutComponent,
    TeacherLayoutComponent,
    NotFoundPageComponent,
  ],
  imports: [
    CommonModule,
    WelcomeModule,
    RouterModule,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzButtonModule,
    NzRadioModule,
    FormsModule,
    NzSegmentedModule,
    NzDropDownModule,
    NzInputModule,
    NzPageHeaderModule,
    NzAvatarModule,
    NzToolTipModule,
    NzIconModule,
    NzResultModule,
    NzBadgeModule,
    TranslateModule,
    WelcomeModule,
    SearchResultsModule
  ]
})
export class LayoutsModule { }
