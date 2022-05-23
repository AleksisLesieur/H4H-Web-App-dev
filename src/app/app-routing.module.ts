import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { AuthComponent } from './modules/auth/auth.component';
import { CandidateComponent } from './modules/candidate/candidate.component';
import { EmployerComponent } from './modules/employer/employer.component';
import { AuthGuardService as AuthGuard } from './services';
import { CAuthguardService as CAuthGuard } from './services';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
      }
    ],
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
      }
    ],
  },
  {
    path: 'candidate',
    component: CandidateComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/candidate/candidate.module').then(m => m.CandidateModule)
      },
    ],
    canActivate: [CAuthGuard],
  },
  {
    path: 'employer',
    component: EmployerComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/employer/employer.module').then(m => m.EmployerModule)
      }
    ],
    canActivate: [AuthGuard],
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
