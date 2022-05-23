import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { HomeComponent } from './home.component';
import { ExploreJobComponent } from './explore-job/explore-job.component';
import { PostResumeComponent } from './post-resume/post-resume.component';
import { ExploreResumeComponent } from './explore-resume/explore-resume.component';
import { PostJobComponent } from './post-job/post-job.component';
import { AllAccessComponent } from './all-access/all-access.component';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { JobDetailsComponent } from './job-details/job-details.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { AboutExploreJobComponent } from './about-explore-job/about-explore-job.component';
import { AboutHireComponent } from './about-hire/about-hire.component';
import { ResumeDetailsComponent } from './resume-details/resume-details.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'home', component: LandingComponent },
  { path: 'get-started', component: GetStartedComponent },
  { path: 'about-explore-job', component: AboutExploreJobComponent },
  { path: 'about-hire-talent', component: AboutHireComponent },
  { path: 'explore-job', component: ExploreJobComponent },
  { path: 'post-resume', component: PostResumeComponent },
  { path: 'resume/resume-details', component: ResumeDetailsComponent },
  { path: 'explore-resume', component: ExploreResumeComponent },
  { path: 'post-job', component: PostJobComponent },
  { path: 'all-access', component: AllAccessComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog/details', component: BlogDetailsComponent },
  { path: 'explore-job/job-details', component: JobDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
