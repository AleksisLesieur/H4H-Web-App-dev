import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeService } from '../../../services';
import { LocalStorageService } from 'ngx-localstorage';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-resume-details',
  templateUrl: './resume-details.component.html',
  styleUrls: ['./resume-details.component.scss']
})
export class ResumeDetailsComponent implements OnInit {
  public resumeData: any = {};
  public phone: any = '';
  public skills: any = '';
  constructor(
    private router: Router,
    private location: Location,
    private homeService: HomeService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private localStorage: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.homeService.setTitle('Resume Details');
    this.getResumeData();
  }

  getResumeData() {
    this.spinner.show();
    let payload = {
      id_resume_post: atob(this.activatedRoute.snapshot.params['id'])
    };
    this.homeService.getResumeDetails(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response);
          if (response.statusCode == 200) {
            this.resumeData = response.body;
            console.log(response.body.job_exp);
            this.resumeData.urls = JSON.parse(response.body.urls);

            this.phone = this.homeService.formatPhoneNumber(this.resumeData.phone_number);
            this.resumeData.job_exp = JSON.parse(response.body.job_exp);
            console.log(this.resumeData);
            this.skills = this.resumeData.skills.split(",").join("<br />")
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
    this.location.back();
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
