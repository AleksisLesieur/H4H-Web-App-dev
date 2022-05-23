import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CandidateService, HomeService } from '../../../services';
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
    private employerService: CandidateService,
    private spinner: NgxSpinnerService,
    private homeService: HomeService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getjobData();
  }

  getjobData() {
    this.spinner.show();
    let payload = {
      id_job_post: atob(this.activatedRoute.snapshot.params['id'])
    };
    this.employerService.getJobDetails(payload)
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
    this.router.navigate(['/candidate/application-status'])
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
