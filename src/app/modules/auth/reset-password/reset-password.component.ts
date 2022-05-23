import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auth } from 'aws-amplify';
import { AuthService } from '../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public forgotData: any = {
    userName: '',
    password: '',
    cpassword: '',
    otp: '',
  };
  public viewPassword: boolean = false;
  public viewCPassword: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.forgotData.userName = this.activatedRoute.snapshot.params['user_name'];
    this.forgotData.otp = this.activatedRoute.snapshot.params['confirmation_code'];
    console.log(this.activatedRoute.snapshot.params['confirmation_code']);
    console.log(this.activatedRoute.snapshot.params['user_name'])
  }

  onViewPassword(data) {
    if (data == 'newPassword') {
      this.viewPassword = !this.viewPassword;
    }
    if (data == 'confirmPassword') {
      this.viewCPassword = !this.viewCPassword;
    }
  }

  onResetPassword() {
    this.spinner.show();
    Auth.forgotPasswordSubmit(this.forgotData.userName, this.forgotData.otp, this.forgotData.password)
      .then(data => {
        Swal.fire({
          title: 'Success! ',
          text: 'You’ve updated your password. Please log in again.',
          icon: 'success',
        })
        this.router.navigate(['/auth/login']);
        this.spinner.hide();
      })
      .catch(err => {
        this.spinner.hide();
        if (err.message == 'Invalid verification code provided, please try again.') {
          Swal.fire({
            title: 'Invalid link, please resubmit forgot password form',
            imageUrl: 'assets/images/smile.png',
            imageHeight: 150,
            imageAlt: 'A tall image',
          })
        } else {
          Swal.fire({
            title: err.message,
            imageUrl: 'assets/images/smile.png',
            imageHeight: 150,
            imageAlt: 'A tall image',
          })
        }
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
          title: 'New Password & Confirm Password do not match.',
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
        })
      } else if (this.forgotData.password.length < 8) {
        Swal.fire({
          title: 'Invalid Password',
          text: 'Password should be at least 8 characters long',
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

}
