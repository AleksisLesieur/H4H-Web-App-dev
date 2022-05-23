import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../../../services';
import { LocalStorageService } from 'ngx-localstorage';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.scss']
})
export class PostJobComponent implements OnInit {
  public myPlan: any = {
    status: false,
    package_id: ''
  };

  constructor(
    private router: Router,
    private homeService: HomeService,
    private localStorage: LocalStorageService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.homeService.setTitle('Post a Job');
    if (this.localStorage.get('sub_id') && this.localStorage.get('user_type') == '1') {
      this.checkCurrentSubscription();
    }
  }

  checkCurrentSubscription() {
    this.spinner.show();
    let payload = {
      user_sub_id: this.localStorage.get('sub_id'),
    };

    this.homeService.checkSubscription(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.myPlan = response;
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

  onPostJob() {
    if (this.localStorage.get('user_type') == '1' && this.myPlan.status == true) {
      this.router.navigate(['/employer/job/add']);
    } else if (this.localStorage.get('user_type') == '1' && this.myPlan.status == false) {
      Swal.fire({
        title: 'Want to post a job?',
        text: "You need an active employer package to create a job post. Take a look at our packages and see which option is right for you!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'See Options',
        cancelButtonText: 'Later'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/all-access']);
        }
      })
    } else {
      Swal.fire({
        title: 'Access Unavailable',
        text: "Please log in or switch your account status to Recruiter for access.",
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
      });
    }
  }

}
