import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeachersListComponent } from './teachers-list/teachers-list.component';
import { LearnersListComponent } from './learners-list/learners-list.component';
import { PrimarySpaceComponent } from './primary-space/primary-space.component';
import { HighSchoolSpaceComponent } from './high-school-space/high-school-space.component';
import { UniversitySpaceComponent } from './university-space/university-space.component';
import { ReclamationsComponent } from './reclamations/reclamations.component';

const routes: Routes = [
  {path: '', component: TeachersListComponent},
  {path: '', component: LearnersListComponent},
  {path: '', component: PrimarySpaceComponent},
  {path: '', component: HighSchoolSpaceComponent},
  {path: '', component: UniversitySpaceComponent},
  {path: '', component: ReclamationsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
