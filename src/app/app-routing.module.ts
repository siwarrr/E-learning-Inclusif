import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { WelcomeLayoutComponent } from './layouts/welcome-layout/welcome-layout.component';
import { TeacherLayoutComponent } from './layouts/teacher-layout/teacher-layout.component';
import { RoleGuardService } from './services/roleGuardService/role-guard.service';
import { CourseFormEditComponent } from './pages/teacher/add-course/course-form-edit/course-form-edit.component';
import { QuizComponent } from './pages/teacher/course-content/quiz/quiz.component';
import { LoginComponent } from './pages/admin/login-admin/login/login.component';
import { TeachersListComponent } from './pages/admin/dashboard/teachers-list/teachers-list.component';
import { LearnersListComponent } from './pages/admin/dashboard/learners-list/learners-list.component';
import { PrimarySpaceComponent } from './pages/admin/dashboard/primary-space/primary-space.component';
import { HighSchoolSpaceComponent } from './pages/admin/dashboard/high-school-space/high-school-space.component';
import { UniversitySpaceComponent } from './pages/admin/dashboard/university-space/university-space.component';
import { ReclamationsComponent } from './pages/admin/dashboard/reclamations/reclamations.component';
import { NotFoundPageComponent } from './layouts/not-found-page/not-found-page.component';
import { SearchResultsComponent } from './pages/shared/search-results/search-results.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomeLayoutComponent, 
    children: [
      { path: '', loadChildren:()=>import('./pages/front/welcome/welcome.module').then(m=>m.WelcomeModule) },
      { path: 'register', loadChildren:()=>import('./pages/front/signup/signup.module').then(m=>m.SignupModule) },
      { path: 'login', loadChildren:()=>import('./pages/front/login/login.module').then(m=>m.LoginModule) },
      { path: 'search', component: SearchResultsComponent },
      
    ]
  },
  {
    path: 'loginAdmin', loadChildren:()=>import('./pages/admin/login-admin/login-admin.module').then(m=>m.LoginAdminModule) 
  },
  //{ path: 'login', loadChildren:()=>import('./pages/front/login/login.module').then(m=>m.LoginModule) },
  { path: 'admin', component: AdminLayoutComponent,
  canActivate: [RoleGuardService],
  data: {expectedRole: 'admin'},
  children: [
    { path: '', loadChildren:()=>import('./pages/admin/statistics/statistics.module').then(m=>m.StatisticsModule) },
    { path: 'list', loadChildren:()=>import('./pages/admin/dashboard/dashboard.module').then(m=>m.DashboardModule) },
    { path: 'teachers', component: TeachersListComponent },
    { path: 'learners', component: LearnersListComponent },
    { path: 'primarySpace', component: PrimarySpaceComponent},
    { path: 'highSchoolSpace', component: HighSchoolSpaceComponent},
    { path: 'universitySpace', component: UniversitySpaceComponent},
    { path: 'reclamations', component: ReclamationsComponent},
    { path: 'course-content/:courseId', loadChildren:()=> import('./pages/teacher/course-content/course-content.module').then(m=>m.CourseContentModule)}

  ]
  },

  { path: 'learner', component: UserLayoutComponent, 
  canActivate: [RoleGuardService],
  data: {expectedRole: 'student'},
  children:[
    { path:'', loadChildren:()=>import('./pages/user/userStudent/user.module').then(m=>m.UserModule)},
    { path: 'course-space/:spaceId', loadChildren: () => import('./pages/user/course-space/course-space.module').then(m => m.CourseSpaceModule) },
    { path:'chat', loadChildren:()=>import('./pages/user/student-chat/student-chat.module').then(m=>m.StudentChatModule)},
    { path: 'course-content/:courseId', loadChildren:()=> import('./pages/teacher/course-content/course-content.module').then(m=>m.CourseContentModule)},
    { path: 'search', component: SearchResultsComponent },

  ] 
  },

  { path: 'teacher', 
  component: TeacherLayoutComponent,
  canActivate: [RoleGuardService],
  data: { expectedRole: 'teacher' },
  children: [
    { path: '', loadChildren: () => import('./pages/teacher/teacher-course/teacher-course.module').then(m => m.TeacherCourseModule) },
    { path: 'addCourse', loadChildren: () => import('./pages/teacher/add-course/add-course.module').then(m => m.AddCourseModule) },
    { path: 'courses', loadChildren: () => import('./pages/teacher/course-list/course-list.module').then(m => m.CourseListModule) },
    { path: 'edit-course/:courseId', component: CourseFormEditComponent },
    { path: 'teacher/courses', loadChildren: () => import('./pages/teacher/course-list/course-list.module').then(m => m.CourseListModule) },
    { path: 'profil', loadChildren:()=> import('./pages/teacher/teacher-profil/teacher-profil.module').then(m=>m.TeacherProfilModule)},
    { path: 'chat', loadChildren:()=> import('./pages/teacher/chat/teacherChat.module').then(m=>m.teacherChatModule)},
    { path: 'course-content/:courseId', loadChildren:()=> import('./pages/teacher/course-content/course-content.module').then(m=>m.CourseContentModule)},
    { path: 'dashboard', loadChildren:()=> import('./pages/teacher/dashbord/dashbord.module').then(m=>m.DashbordModule)},

  ]
},
{ path: '**', component: NotFoundPageComponent},

];

 /* { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'welcome', loadChildren: () => import('./pages/front/welcome/welcome.module').then(m => m.WelcomeModule)},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},*/ 
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
