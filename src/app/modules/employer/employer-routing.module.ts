import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployerComponent } from './employer.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { JobsComponent } from './jobs/jobs.component';
import { JobAddComponent } from './job-add/job-add.component';
import { JobEditComponent } from './job-edit/job-edit.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApplicationStatusComponent } from './application-status/application-status.component';
import { JobDetailsComponent } from './job-details/job-details.component';
import { CheckOutComponent } from './check-out/check-out.component';

const routes: Routes = [
  { path: '', component: JobsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'check-out', component: CheckOutComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'job', component: JobsComponent },
  { path: 'job/add', component: JobAddComponent },
  { path: 'job/edit', component: JobEditComponent },
  { path: 'job/details', component: JobDetailsComponent },
  { path: 'job/application-status', component: ApplicationStatusComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployerRoutingModule { }
