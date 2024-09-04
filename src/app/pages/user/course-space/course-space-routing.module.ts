import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseSpaceComponent } from './course-space.component';

const routes: Routes = [
  { path: '', component: CourseSpaceComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseSpaceRoutingModule { }
