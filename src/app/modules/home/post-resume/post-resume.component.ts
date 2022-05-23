import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-localstorage';
import { AuthService, SharedService, HomeService } from '../../../services';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-post-resume',
  templateUrl: './post-resume.component.html',
  styleUrls: ['./post-resume.component.scss']
})
export class PostResumeComponent implements OnInit {

  constructor(
    private localStorage: LocalStorageService,
    private router: Router,
    private authService: AuthService,
    private homeService: HomeService,
    private spinner: NgxSpinnerService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.homeService.setTitle('Post a Resume');
    console.log('user', this.localStorage.get('user_type'));
  }

  onPostResume() {
    if (this.localStorage.get('user_type') == '2') {
      this.router.navigate(['/candidate/resume/add']);
    } else if (this.localStorage.get('user_type') == '1') {

      Swal.fire({
        title: 'Woops!',
        text: "Looks like you tried to post a resume as a recruiter. Want to switch to applicant.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          // this.router.navigate(['/all-access']);
          this.switchAccount();
        }
      })
    } else {
      this.localStorage.set('last_action', 'post resume');
      this.router.navigate(['/auth/login']);
    }
  }

  switchAccount() {
    this.spinner.show();
    let payload = {
      user_sub_id: this.localStorage.get('sub_id')
    };
    this.homeService.switchAccount(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.body.user_type == '1') {
            this.localStorage.set('user_type', response.body.user_type);
            Swal.fire({
              title: 'Success!',
              text: 'Your profile successfully switched to Recruiter.',
              icon: 'success',
            })
            this.sharedService.changeMessage('1');
            this.router.navigate(['/explore-resume']);
          } else if (response.body.user_type == '2') {
            this.localStorage.set('user_type', response.body.user_type);
            Swal.fire({
              title: 'Success!',
              text: 'Your profile successfully switched to Applicant.',
              icon: 'success',
            })
            this.sharedService.changeMessage('2');
            this.router.navigate(['/candidate/resume/add']);
          } else {
            Swal.fire({
              title: 'Something went wrong!',
              text: 'Your profile not successfully switch.',
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

}
