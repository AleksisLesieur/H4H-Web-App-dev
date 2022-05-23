import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, SharedService, HomeService } from '../../services';
import { LocalStorageService } from 'ngx-localstorage';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public user_type: any = '0';
  public cNewNoti: any = [];
  public cOldNoti: any = [];
  public rNewNoti: any = [];
  public rOldNoti: any = [];
  public ctimer: any;
  public rtimer: any;
  public hasNewNoti: boolean = false;

  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private homeService: HomeService,
    private spinner: NgxSpinnerService,
    private localStorage: LocalStorageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.sharedService.currentMessage.subscribe(message => {
      this.user_type = message;

      if (this.user_type == '1') {
        this.loadRecruterNotifications();
        this.ctimer = setInterval(() => {
          this.loadRecruterNotifications();
        }, 120000);
      } else if (this.user_type == '2') {
        this.loadCandidateNotifications();
        this.rtimer = setInterval(() => {
          this.loadCandidateNotifications();
        }, 120000);
      } else {
        if (this.ctimer) {
          clearInterval(this.ctimer);
        }
        if (this.rtimer) {
          clearInterval(this.rtimer);
        }
        this.cNewNoti = [];
        this.cOldNoti = [];
        this.rNewNoti = [];
        this.rOldNoti = [];
      }
    })
  }

  onLogOut() {
    this.closeMain();
    Swal.fire({
      title: 'Are you sure you want to Log Out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }

  loadCandidateNotifications() {
    // this.spinner.show();
    let payload = {
      candidate_sub_id: this.localStorage.get('sub_id')
    };
    this.homeService.getCandidateNotifications(payload)
      .subscribe(
        (response) => {
          // this.spinner.hide();
          console.log(response);
          if (response.statusCode == 200) {
            this.cNewNoti = response.body.new_notification;
            this.cOldNoti = response.body.old_notification;
            if (this.cNewNoti.length != 0) {
              this.hasNewNoti = true;
            }
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



  loadRecruterNotifications() {
    // this.spinner.show();
    let payload = {
      recruiter_sub_id: this.localStorage.get('sub_id')
    };
    this.homeService.getRecruterNotifications(payload)
      .subscribe(
        (response) => {
          // this.spinner.hide();
          console.log(response);
          if (response.statusCode == 200) {
            this.rNewNoti = response.body.new_notification;
            this.rOldNoti = response.body.old_notification;
            if (this.rNewNoti.length != 0) {
              this.hasNewNoti = true;
            }
          }
        },
        (error) => {
          this.spinner.hide();
          Swal.fire({
            title: 'Something went wrong!',
            text: error,
            icon: 'warning',
          })
        }
      );
  }

  onClickNoti() {
    this.hasNewNoti = false;
  }

  onSwitchAsRecruter() {
    Swal.fire({
      title: "Are you sure you want to change your account type to Recruiter?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.switchAccount();
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }

  onSwitchAsApplicant() {
    Swal.fire({
      title: "Are you sure you want to change your account type to Applicant?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.switchAccount();
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
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
            // window.location.reload();
          } else if (response.body.user_type == '2') {
            this.localStorage.set('user_type', response.body.user_type);
            Swal.fire({
              title: 'Success!',
              text: 'Your profile successfully switched to Applicant.',
              icon: 'success',
            })
            this.sharedService.changeMessage('2');
            this.router.navigate(['/explore-job']);
            // window.location.reload();
          } else {
            Swal.fire({
              title: 'Something went wrong!',
              text: 'Your profile not successfully switch.',
              icon: 'warning',
            })
          }
        },
        (error) => {
          this.spinner.hide();
          Swal.fire({
            title: 'Something went wrong!',
            text: error,
            icon: 'warning',
          })
        }
      );
  }

  gotoRAS(id) {
    this.router.navigate(['/employer/job/application-status', { 'id': btoa(id) }]);
    this.closeMain();
  }
  closeMain() {
    (<HTMLInputElement>document.getElementById('navbarSupportedContent')).classList.remove("show");
  }
  gotoCAS(n) {
    console.log(n);
    this.closeMain();
    if (n.is_posted) {
      this.router.navigate(['/explore-job/job-details', { 'id': btoa(n.id_job_post) }]);
    } else if (n.is_invited) {
      // this.router.navigate(['/explore-job/job-details', { 'id': n.id_job_post }]);
      this.router.navigate(['candidate/application-status']);
    } else {
      this.router.navigate(['candidate/application-status']);
    }

  }

}
