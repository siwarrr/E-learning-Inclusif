import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCourseComponent } from './add-course.component';
import { CourseFormEditComponent } from './course-form-edit/course-form-edit.component';

const routes: Routes = [
  {path: '', component:AddCourseComponent},
  { path: 'edit-course/:courseId', component: CourseFormEditComponent },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCourseRoutingModule { }
