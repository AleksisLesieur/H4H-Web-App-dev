import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auth } from 'aws-amplify';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, SharedService, HomeService } from '../../../services';
import { LocalStorageService } from 'ngx-localstorage';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public aemail: any = '';
  public apassword: any = '';
  public remail: any = '';
  public rpassword: any = '';
  public password: any = '';
  public newPassword: any = '';
  public confirmPassword: any = '';
  public authData: any = {};
  public changePassword: boolean = false;
  congitoUser = new BehaviorSubject(null);
  loginForm!: FormGroup;
  public cLogin: boolean = false;
  public viewPassword: boolean = false;
  public viewNewPassword: boolean = false;
  public viewConfirmPassword: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private homeService: HomeService,
    private localStorage: LocalStorageService,
    private spinner: NgxSpinnerService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSignIn() {
    this.cLogin = true;
    if (this.loginForm.invalid) { return }
    // this.checkUserAccess(this.loginForm.controls.email.value, this.loginForm.controls.password.value);
    this.signIn(this.loginForm.controls.email.value, this.loginForm.controls.password.value);
  }

  onViewPassword() {
    this.viewPassword = !this.viewPassword;
  }


  checkUserAccess(email, password) {
    this.spinner.show();
    let payload = {
      user_email: email
    };
    this.authService.checkUserAccess(payload)
      .subscribe(
        (response) => {
          if (response.body.user_is_active == '1') {
            // this.signIn(email, password);
            this.authData = response.body;
            this.navigateUser();
          } else {
            this.spinner.hide();
            Swal.fire({
              title: 'Hold On!',
              text: "You don't have authorization.",
              imageUrl: 'assets/images/smile.png',
              imageHeight: 150,
              imageAlt: 'A tall image',
            });
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

  signIn(email, password) {
    this.spinner.show();
    Auth.signIn(email, password).then(response => {
      console.log('res', response);
      this.congitoUser.next(response);
      this.spinner.hide();
      if (response) {
        if (response.challengeName === 'NEW_PASSWORD_REQUIRED') {
          this.changePassword = true;
          // this.resendConfirmationCode(this.email)
        } else {
          this.localStorage.set('sub_id', response.signInUserSession.idToken.payload.sub);
          this.localStorage.set('token', response.signInUserSession.idToken.jwtToken);
          this.checkUserAccess(email, password);
        }
      }
    }).catch(error => {
      this.spinner.hide();
      if (error.message == 'User is not confirmed.') {
        Swal.fire({
          title: 'Account not verified!',
          text: "Your account hasn't been verified, click 'Resend Email' to send verification email again.",
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
          showCancelButton: true,
          confirmButtonText: 'Resend Email',
          cancelButtonText: 'later'
        }).then((result) => {
          if (result.isConfirmed) {
            this.resendConfirmationCode(email);
          }
        })
      } else {
        Swal.fire({
          title: 'Something went wrong!',
          text: error.message,
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
        })
      }

    });
  }

  navigateUser() {
    this.localStorage.set('user_type', this.authData.user_type);
    if (this.authData.user_type == '1') {
      this.sharedService.changeMessage('1');
      if (this.localStorage.get('last_action') == 'post resume') {
        this.localStorage.set('last_action', '');
        Swal.fire({
          title: 'Woops!',
          text: "Looks like you tried to post a resume as a recruiter. Want to switch to candidate.",
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.isConfirmed) {
            this.switchAccount();
          } else {
            this.router.navigate(['/explore-resume']);
          }
        })
      } else {
        this.router.navigate(['/explore-resume']);
      }
    } else {
      this.sharedService.changeMessage('2');
      if (this.localStorage.get('last_action') == 'post resume') {
        this.router.navigate(['/candidate/resume/add']);
        this.localStorage.set('last_action', '');
      } else {
        this.router.navigate(['/explore-job']);
      }
    }
  }

  resendConfirmationCode(email) {
    this.spinner.show();
    Auth.resendSignUp(email).then(response => {
      this.spinner.hide();
      console.log('code resent successfully');
      Swal.fire({
        title: 'Resent successfully!',
        text: 'Verification link resent successfully to ' + email,
        icon: 'success',
      })
    }).catch(error => {
      this.spinner.hide();
      Swal.fire({
        title: 'Something went wrong!',
        text: error.message,
        icon: 'warning',
      })
    });
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

  onUpdatePassword() {
    if (
      this.newPassword &&
      this.confirmPassword

    ) {
      if (this.newPassword == this.password) {
        Swal.fire({
          text: 'New password should be different from One time password.',
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
        })
      } else if (this.newPassword != this.confirmPassword) {
        Swal.fire({
          text: 'New Password & Confirm Password do not match.',
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
        })
      } else if (this.newPassword.length < 8) {
        Swal.fire({
          title: 'Invalid Password',
          text: 'Password should be at least 8 characters long',
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
        })
      } else {
        this.updatePassword();
      }
    } else {
      Swal.fire({
        text: 'Please fill all the fields.',
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
      })
    }
  }

  updatePassword() {
    this.spinner.show();
    // subscribe to cognito user (behaviour subject) and use the value it returned.
    var mySubscription = this.congitoUser.subscribe((value) => {
      Auth.completeNewPassword(value, this.newPassword, [])
        .then((data) => {
          console.log(data);
          this.changePassword = false;
          this.spinner.hide();
          mySubscription.unsubscribe();
          Swal.fire({
            title: 'Success! ',
            text: 'You’ve updated your password. Please log in again.',
            icon: 'success',
          })
        })
        .catch((err) => {
          mySubscription.unsubscribe();
          Swal.fire({
            text: err.message,
            imageUrl: 'assets/images/smile.png',
            imageHeight: 150,
            imageAlt: 'A tall image',
          })
        }
        );
    });
  }

  validatePassword(password) {
    if (
      !/(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,}$/i.test(
        password,
      )
    ) {
      return false;
    } else return true;
  }

  // resendConfirmationCode(email) {
  //   const username = email;
  //   try {
  //     Auth.resendSignUp(username);
  //     Swal.fire({
  //       title: "Code resend successfully",
  //       icon: 'success',
  //     })
  //   } catch (error) {
  //     Swal.fire({
  //       title: error.message,
  //       icon: 'warning',
  //     })
  //   }
  // }

}
