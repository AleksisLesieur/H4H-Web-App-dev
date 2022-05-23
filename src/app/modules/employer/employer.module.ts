import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EmployerRoutingModule } from './employer-routing.module';
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
import { PhoneMaskDirective } from '../../directive/employer/phone-mask.directive';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgxImageCompressorModule } from 'ngx-image-compressor';

@NgModule({
  declarations: [
    EmployerComponent,
    ProfileComponent,
    ChangePasswordComponent,
    JobsComponent,
    JobAddComponent,
    JobEditComponent,
    DashboardComponent,
    ApplicationStatusComponent,
    JobDetailsComponent,
    CheckOutComponent,
    PhoneMaskDirective
  ],
  imports: [
    CommonModule,
    EmployerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMultiSelectModule,
    GooglePlaceModule,
    NgxImageCompressorModule
  ],
  exports: [
    PhoneMaskDirective
  ],
})
export class EmployerModule { }
