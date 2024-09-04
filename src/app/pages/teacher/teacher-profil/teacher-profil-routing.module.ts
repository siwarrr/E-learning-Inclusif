import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherProfilComponent } from './teacher-profil.component';

const routes: Routes = [
  {path: '', component: TeacherProfilComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherProfilRoutingModule { }
