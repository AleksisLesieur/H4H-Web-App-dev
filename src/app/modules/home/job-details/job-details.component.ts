import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeService } from '../../../services';
import { LocalStorageService } from 'ngx-localstorage';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit {

  public jobData: any = {};
  public phone: any = '';

  constructor(
    private router: Router,
    private homeService: HomeService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private localStorage: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.homeService.setTitle('Job Details');
    if (this.localStorage.get('user_type') == '2') {
      this.getjobData();
    } else {
      this.goBack()
    }

  }

  getjobData() {
    this.spinner.show();
    let payload = {
      id_job_post: atob(this.activatedRoute.snapshot.params['id'])
    };
    this.homeService.getJobDetails(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response);
          if (response.statusCode == 200) {
            this.jobData = response.body;
            this.phone = this.homeService.formatPhoneNumber(this.jobData.job_phone);
          } else {
            this.goBack();
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

  goBack() {
    this.router.navigate(['/explore-job'])
  }

  jobApply() {
    this.spinner.show();
    let payload = {
      id_job_post: this.jobData.id_job_post,
      recruiter_sub_id: this.jobData.user_sub_id,
      candidate_sub_id: this.localStorage.get('sub_id'),
    }

    this.homeService.jobApply(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.statusCode == 200) {
            Swal.fire({
              title: 'Sent Successfully!',
              text: 'Application sent successfully.',
              icon: 'success',
            })
            this.jobData.is_applied = true;

          } else {
            Swal.fire({
              title: 'Warning!',
              text: response.body,
              imageUrl: 'assets/images/smile.png',
              imageHeight: 150,
              imageAlt: 'A tall image',
            })
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

  validURL(str) {
    var pattern = /^((http|https|ftp):\/\/)/;
    if (!pattern.test(str)) {
      return false;
    } else {
      return true;
    }
  }

}
