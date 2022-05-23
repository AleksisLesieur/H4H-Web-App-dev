import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auth } from 'aws-amplify';
import { AuthService } from '../../../services';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2'

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public isReset: boolean = false;
  public forgotData: any = {
    userName: '',
    password: '',
    cpassword: '',
    otp: '',
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
  }

  onForgotPassword() {

    this.spinner.show();
    Auth.forgotPassword(this.forgotData.userName)
      .then(data => {
        console.log('data', data);
        this.spinner.hide();
        // this.isReset = true;
        Swal.fire({
          title: "Successfully sent.",
          text: 'Reset password link has been sent to ' + data.CodeDeliveryDetails.Destination,
          icon: 'success',
        })
      })
      .catch(err => alert(err));

  }

  onResetPassword() {
    this.spinner.show();
    Auth.forgotPasswordSubmit(this.forgotData.userName, this.forgotData.otp, this.forgotData.password)
      .then(data => {
        Swal.fire({
          title: 'Password Reset Successfully! Please Login.',
          icon: 'success',
        })
        this.router.navigate(['/auth/login']);
        this.spinner.hide();
      })
      .catch(err => {
        this.spinner.hide();
        Swal.fire({
          title: err.message,
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
        })
      });
  }

  onSubmit() {
    if (
      this.forgotData.userName &&
      this.forgotData.otp &&
      this.forgotData.password &&
      this.forgotData.cpassword
    ) {
      if (this.forgotData.password != this.forgotData.cpassword) {
        Swal.fire({
          title: 'Passwords not match.',
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
        })
      } else if (!this.validatePassword(this.forgotData.password)) {
        Swal.fire({
          title: 'Invalid Password',
          text: 'Password should have 1 lowercase letter, 1 uppercase letter, 1 number, and be at least 8 characters long',
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
        })
      } else {
        this.onResetPassword();
      }
    } else {
      Swal.fire({
        title: 'Please fill all the fields.',
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
      })
    }
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

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  checkUserAccess() {
    if (this.forgotData.userName.length != 0) {
      if (this.validateEmail(this.forgotData.userName)) {
        this.spinner.show();
        let payload = {
          user_email: this.forgotData.userName
        };
        this.authService.checkUserAccess(payload)
          .subscribe(
            (response) => {
              if (response.body.user_is_active == '1') {
                this.onForgotPassword();
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
      } else {
        Swal.fire({
          title: 'Please enter a valid email.',
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
        })
      }

    } else {
      Swal.fire({
        title: 'Please enter your email.',
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
      })
    }
  }

}
