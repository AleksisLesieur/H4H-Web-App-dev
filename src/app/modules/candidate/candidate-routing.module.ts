import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CandidateComponent } from './candidate.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MyResumeComponent } from './my-resume/my-resume.component';
import { AddResumeComponent } from './add-resume/add-resume.component';
import { EditResumeComponent } from './edit-resume/edit-resume.component';
import { ApplicationStatusComponent } from './application-status/application-status.component';
import { JobDetailsComponent } from './job-details/job-details.component';

const routes: Routes = [
  { path: '', component: MyResumeComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'resume', component: MyResumeComponent },
  { path: 'resume/add', component: AddResumeComponent },
  { path: 'resume/edit', component: EditResumeComponent },
  { path: 'application-status', component: ApplicationStatusComponent },
  { path: 'application-status/job-details', component: JobDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateRoutingModule { }
