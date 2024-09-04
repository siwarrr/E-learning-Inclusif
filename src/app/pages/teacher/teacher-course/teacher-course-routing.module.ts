import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherCourseComponent } from './teacher-course.component';

const routes: Routes = [
  {path: '', component: TeacherCourseComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherCourseRoutingModule { }
