import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseContentComponent } from './course-content.component';
import { QuizComponent } from './quiz/quiz.component';
import { CourseCompletedComponent } from './course-completed/course-completed.component';

const routes: Routes = [
  { path: '', component: CourseContentComponent},
  { path: 'quiz/:topicId/:quizId', component: QuizComponent },
  { path: 'course-completed', component: CourseCompletedComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseContentRoutingModule { }
