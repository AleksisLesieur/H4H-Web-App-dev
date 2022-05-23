import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CandidateRoutingModule } from './candidate-routing.module';
import { CandidateComponent } from './candidate.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MyResumeComponent } from './my-resume/my-resume.component';
import { AddResumeComponent } from './add-resume/add-resume.component';
import { EditResumeComponent } from './edit-resume/edit-resume.component';
import { ApplicationStatusComponent } from './application-status/application-status.component';
import { JobDetailsComponent } from './job-details/job-details.component';
import { PhoneNumberDirective } from '../../directive/candidate/phone-number.directive';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgxImageCompressorModule } from 'ngx-image-compressor';

@NgModule({
  declarations: [
    CandidateComponent,
    ProfileComponent,
    ChangePasswordComponent,
    MyResumeComponent,
    AddResumeComponent,
    EditResumeComponent,
    ApplicationStatusComponent,
    JobDetailsComponent,
    PhoneNumberDirective
  ],
  imports: [
    CommonModule,
    CandidateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMultiSelectModule,
    GooglePlaceModule,
    NgxImageCompressorModule
  ],
  exports: [
    PhoneNumberDirective
  ],
})
export class CandidateModule { }
