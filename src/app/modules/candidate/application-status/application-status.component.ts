import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CandidateService } from '../../../services';
import { LocalStorageService } from 'ngx-localstorage';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-application-status',
  templateUrl: './application-status.component.html',
  styleUrls: ['./application-status.component.scss']
})
export class ApplicationStatusComponent implements OnInit {
  public status_list: any = [];
  public accepted_status_list: any = [];
  public reviewed_status_list: any = [];
  public pending_status_list: any = [];
  public declined_status_list: any = [];
  status_count: any = {};

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private localStorage: LocalStorageService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.loadStatusList();
  }

  loadStatusCount() {
    let payload = {
      candidate_sub_id: this.localStorage.get('sub_id'),
    };
    this.candidateService.getStatusCount(payload)
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

  loadStatusList() {
    this.spinner.show();
    this.loadStatusCount();
    let payload = {
      candidate_sub_id: this.localStorage.get('sub_id'),
      offset: 0
    }

    this.candidateService.getApplicationStatusList(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.statusCode == 200) {
            this.status_list = response.body;
            // this.accepted_status_list = response.body;
            // this.reviewed_status_list = response.body;
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

  acceptJobApplication() {
    this.spinner.show();
    this.loadStatusCount();
    let payload = {
      candidate_sub_id: this.localStorage.get('sub_id'),
      offset: 0
    };

    this.candidateService.getApplicationAcceptedList(payload)
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

  reviewJobApplication() {
    this.spinner.show();
    this.loadStatusCount();
    let payload = {
      candidate_sub_id: this.localStorage.get('sub_id'),
      offset: 0
    };

    this.candidateService.getApplicationReviewList(payload)
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

  pendingJobApplication() {
    this.spinner.show();
    this.loadStatusCount();
    let payload = {
      candidate_sub_id: this.localStorage.get('sub_id'),
      offset: 0
    };

    this.candidateService.getApplicationPendingList(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.statusCode == 200) {
            this.pending_status_list = response.body;
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

  declinedJobApplication() {
    this.spinner.show();
    this.loadStatusCount();
    let payload = {
      candidate_sub_id: this.localStorage.get('sub_id'),
      offset: 0
    };

    this.candidateService.getApplicationDeclinedList(payload)
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

  onViewJobDetails(job) {
    this.router.navigate(['/candidate/application-status/job-details', { 'id': btoa(job.id_job_post) }])
  }

}
