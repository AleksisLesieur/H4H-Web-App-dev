import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployerService } from '../../../services';
import { LocalStorageService } from 'ngx-localstorage';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-application-status',
  templateUrl: './application-status.component.html',
  styleUrls: ['./application-status.component.scss']
})
export class ApplicationStatusComponent implements OnInit {
  public status_list: any = [];
  public accepted_status_list: any = [];
  public declined_status_list: any = [];
  public reviewed_status_list: any = [];
  public status_count: any = {};
  public jobId = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private location: Location,
    private employerService: EmployerService,
    private localStorage: LocalStorageService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.jobId = atob(this.activatedRoute.snapshot.params['id'])
    this.loadAllStatusList();
  }

  loadStatusCount() {
    let payload = {
      id_job_post: this.jobId,
    };
    this.employerService.getStatusCount(payload)
      .subscribe(
        (response) => {

          if (response.statusCode == 200) {
            this.status_count = response.body;
          }
        },
        (error) => {
          Swal.fire({
            title: 'Something went wrong!',
            text: error,
            imageUrl: 'assets/images/smile.png',
            imageHeight: 150,
            imageAlt: 'A tall image',
          })
        }
      );
  }

  loadAllStatusList() {
    this.spinner.show();
    this.loadStatusCount();
    let payload = {
      id_job_post: this.jobId,
      offset: 0
    };

    this.employerService.getStatusList(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.statusCode == 200) {
            this.status_list = response.body;
          }
        },
        (error) => {
          this.spinner.hide();
          Swal.fire({
            title: 'Something went wrong!',
            text: error,
            imageUrl: 'assets/images/smile.png',
            imageHeight: 150,
            imageAlt: 'A tall image',
          })
        }
      );
  }

  loadAcceptedStatusList() {
    this.spinner.show();
    this.loadStatusCount();
    let payload = {
      id_job_post: this.jobId,
      offset: 0
    };

    this.employerService.getAcceptedStatusList(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.statusCode == 200) {
            this.accepted_status_list = response.body;
          }
        },
        (error) => {
          this.spinner.hide();
          Swal.fire({
            title: 'Something went wrong!',
            text: error,
            imageUrl: 'assets/images/smile.png',
            imageHeight: 150,
            imageAlt: 'A tall image',
          })
        }
      );
  }

  loadDeclinedStatusList() {
    this.spinner.show();
    this.loadStatusCount();
    let payload = {
      id_job_post: this.jobId,
      offset: 0
    };

    this.employerService.getDeclinedStatusList(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.statusCode == 200) {
            this.declined_status_list = response.body;
          }
        },
        (error) => {
          this.spinner.hide();
          Swal.fire({
            title: 'Something went wrong!',
            text: error,
            imageUrl: 'assets/images/smile.png',
            imageHeight: 150,
            imageAlt: 'A tall image',
          })
        }
      );
  }

  loadReviewedStatusList() {
    this.spinner.show();
    this.loadStatusCount();
    let payload = {
      id_job_post: this.jobId,
      offset: 0
    };

    this.employerService.getReviewedStatusList(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.statusCode == 200) {
            this.reviewed_status_list = response.body;
          }
        },
        (error) => {
          this.spinner.hide();
          Swal.fire({
            title: 'Something went wrong!',
            text: error,
            imageUrl: 'assets/images/smile.png',
            imageHeight: 150,
            imageAlt: 'A tall image',
          })
        }
      );
  }

  acceptJobApplication(job) {
    this.spinner.show();
    let payload = {
      idjob_apply: job.idjob_apply,
      candidate_sub_id: job.candidate_sub_id,
      recruiter_sub_id: job.recruiter_sub_id,
      id_job_post: job.id_job_post
    };

    this.employerService.applicationAccept(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.statusCode == 200) {
            this.loadAllStatusList();
          }
        },
        (error) => {
          this.spinner.hide();
          Swal.fire({
            title: 'Something went wrong!',
            text: error,
            imageUrl: 'assets/images/smile.png',
            imageHeight: 150,
            imageAlt: 'A tall image',
          })
        }
      );
  }

  declineJobApplication(job) {
    this.spinner.show();
    let payload = {
      idjob_apply: job.idjob_apply,
      candidate_sub_id: job.candidate_sub_id,
      recruiter_sub_id: job.recruiter_sub_id,
      id_job_post: job.id_job_post
    };

    this.employerService.applicationDecline(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.statusCode == 200) {
            this.loadAllStatusList();
          }
        },
        (error) => {
          this.spinner.hide();
          Swal.fire({
            title: 'Something went wrong!',
            text: error,
            imageUrl: 'assets/images/smile.png',
            imageHeight: 150,
            imageAlt: 'A tall image',
          })
        }
      );
  }

  reviewJobApplication(job) {

    let payload = {
      idjob_apply: job.idjob_apply,
      candidate_sub_id: job.candidate_sub_id,
      recruiter_sub_id: job.recruiter_sub_id,
      id_job_post: job.id_job_post
    };

    this.employerService.applicationReview(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.statusCode == 200) {
            this.loadAllStatusList();
          }
        },
        (error) => {
          this.spinner.hide();
          Swal.fire({
            title: 'Something went wrong!',
            text: error,
            imageUrl: 'assets/images/smile.png',
            imageHeight: 150,
            imageAlt: 'A tall image',
          })
        }
      );
  }


  onViewResume(resume) {
    this.router.navigate(['/resume/resume-details', { 'id': btoa(resume.id_resume_post) }])
  }

  goBack() {
    this.location.back();
  }

}


