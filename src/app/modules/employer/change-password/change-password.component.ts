import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auth } from 'aws-amplify';
import { AuthService, CandidateService } from '../../../services';
import { LocalStorageService } from 'ngx-localstorage';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2'

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  public oldPassword: any = '';
  public newPassword: any = '';
  public confirmPassword: any = '';
  public userData: any = {};

  public viewOldPassword: boolean = false;
  public viewPassword: boolean = false;
  public viewCPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private localStorage: LocalStorageService,
    private candidateService: CandidateService
  ) { }

  ngOnInit(): void {
    this.getProfileDetails();
  }

  onViewPassword(data) {
    if (data == 'oldPassword') {
      this.viewOldPassword = !this.viewOldPassword;
    }
    if (data == 'newPassword') {
      this.viewPassword = !this.viewPassword;
    }
    if (data == 'confirmPassword') {
      this.viewCPassword = !this.viewCPassword;
    }
  }


  getProfileDetails() {
    this.spinner.show();
    let payload = {
      user_sub_id: this.localStorage.get('sub_id')
    };
    this.candidateService.profileDetails(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response);
          if (response.statusCode == 200) {
            this.userData = response.body;
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
  onChangePassword() {
    if (this.oldPassword && this.newPassword && this.confirmPassword) {
      if (this.newPassword != this.confirmPassword) {
        Swal.fire({
          text: 'New Password & Confirm Password do not match.',
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
        })
      } else if (
        this.newPassword.length < 8
      ) {
        Swal.fire({
          text: 'Password should be at least 8 characters long',
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
        })
      } else {
        this.changePassword();
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

  validatePassword(password) {
    if (
      !/(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,}$/i.test(
        password,
      )
    ) {
      return false;
    } else return true;
  }

  changePassword() {
    this.spinner.show();
    Auth.currentAuthenticatedUser()
      .then(user => {
        return Auth.changePassword(user, this.oldPassword, this.newPassword);
      })
      .then(data => {
        console.log(data);
        Swal.fire({
          title: 'Success!',
          text: "You've updated your password. Please log in again",
          icon: 'success',
        })
        this.authService.logout();
        this.spinner.hide();
      })
      .catch(err => {
        console.log(err);
        this.spinner.hide();
        if (err.code == 'NotAuthorizedException') {
          Swal.fire({
            text: 'Incorrect Password.',
            imageUrl: 'assets/images/smile.png',
            imageHeight: 150,
            imageAlt: 'A tall image',
          })
        } else {
          Swal.fire({
            text: err.message,
            imageUrl: 'assets/images/smile.png',
            imageHeight: 150,
            imageAlt: 'A tall image',
          })
        }

      });
  }

}
