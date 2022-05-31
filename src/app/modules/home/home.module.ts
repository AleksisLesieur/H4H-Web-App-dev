import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ExploreJobComponent } from './explore-job/explore-job.component';
import { PostResumeComponent } from './post-resume/post-resume.component';
import { ExploreResumeComponent } from './explore-resume/explore-resume.component';
import { PostJobComponent } from './post-job/post-job.component';
import { AllAccessComponent } from './all-access/all-access.component';
import { BlogComponent } from './blog/blog.component';
import { LandingComponent } from './landing/landing.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { JobDetailsComponent } from './job-details/job-details.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { AboutExploreJobComponent } from './about-explore-job/about-explore-job.component';
import { AboutHireComponent } from './about-hire/about-hire.component';
import { ResumeDetailsComponent } from './resume-details/resume-details.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { InfiniteScrollModule } from "ngx-infinite-scroll";

@NgModule({
  declarations: [
    HomeComponent,
    ExploreJobComponent,
    PostResumeComponent,
    ExploreResumeComponent,
    PostJobComponent,
    AllAccessComponent,
    BlogComponent,
    LandingComponent,
    BlogDetailsComponent,
    JobDetailsComponent,
    GetStartedComponent,
    AboutExploreJobComponent,
    AboutHireComponent,
    ResumeDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HomeRoutingModule,
    AngularMultiSelectModule,
    GooglePlaceModule,
    InfiniteScrollModule
  ]
})
export class HomeModule { }
