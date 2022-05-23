import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auth } from 'aws-amplify';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2'

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  public userData: any = {
    username: 'HFH User',
    email: '',
    password: '',
    cpassword: '',
    user_type: '',
    company_name: '',
    user_fname: '',
    user_lname: '',
  }
  public user_email: any = '';
  public verification_code: any = '';
  public viewConfirm: boolean = false;
  public viewPassword: boolean = false;
  public viewCPassword: boolean = false;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    console.log(this.activatedRoute.snapshot.params['email']);
    console.log(this.activatedRoute.snapshot.params['code']);
    if (this.activatedRoute.snapshot.params['email'] && this.activatedRoute.snapshot.params['code']) {
      this.viewConfirm = true;
      this.user_email = this.activatedRoute.snapshot.params['email'];
      this.verification_code = this.activatedRoute.snapshot.params['code'];
      this.confirmSignUp();
    }
  }

  autoFill() {
    this.userData = {
      username: 'amit',
      email: 'amit@appstangodev.com',
      password: 'Amit@321',
      cpassword: 'Amit@321',
      user_type: '1',
      company_name: 'ASD PVT LTD',
      user_fname: 'Amit',
      user_lname: 'Saha',
    }
  }

  onViewPassword() {
    this.viewPassword = !this.viewPassword;
  }
  onCViewPassword() {
    this.viewCPassword = !this.viewCPassword;
  }

  onEmployerSignUp() {
    this.userData.user_type = '1';
    if (
      this.userData.user_fname &&
      this.userData.user_lname &&
      this.userData.email &&
      this.userData.password &&
      this.userData.cpassword &&
      this.userData.username &&
      this.userData.company_name
    ) {
      if (!this.validateName(this.userData.user_fname)) {
        Swal.fire({
          text: 'Please enter valid first name.',
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
        })
      } else if (!this.validateName(this.userData.user_lname)) {
        Swal.fire({
          text: 'Please enter valid last name.',
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
        })
      } else if (!this.validateEmail(this.userData.email)) {
        Swal.fire({
          text: 'Please enter valid email.',
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
        })
      } else if (!this.validateCompanyName(this.userData.company_name)) {
        Swal.fire({
          text: 'Please enter valid company name.',
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
        })
      } else if (this.userData.password != this.userData.cpassword) {
        Swal.fire({
          text: 'New Password & Confirm Password do not match.',
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
        })
      } else if (
        this.userData.password.length < 8
      ) {
        Swal.fire({
          text: 'Password should be at least 8 characters long',
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
        })
      } else {
        this.signUp();
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

  onCandidateSignUp() {
    this.userData.user_type = '2';
    if (
      this.userData.user_fname &&
      this.userData.user_lname &&
      this.userData.email &&
      this.userData.password &&
      this.userData.cpassword &&
      this.userData.username
    ) {
      if (!this.validateName(this.userData.user_fname)) {
        Swal.fire({
          text: 'Please enter valid first name.',
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
        })
      } else if (!this.validateName(this.userData.user_lname)) {
        Swal.fire({
          text: 'Please enter valid last name.',
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
        })
      } else if (!this.validateEmail(this.userData.email)) {
        Swal.fire({
          text: 'Please enter valid email.',
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
        })
      } else if (this.userData.password != this.userData.cpassword) {
        Swal.fire({
          text: 'New Password & Confirm Password do not match.',
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
        })
      } else if (
        this.userData.password.length < 8
      ) {
        Swal.fire({
          text: 'Password should be at least 8 characters long',
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
        })
      } else {
        this.signUp();
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

  validateName(name) {
    if (
      !/[a-zA-Z. ]+$/i.test(
        name,
      )
    ) {
      return false;
    } else return true;
  }

  validateCompanyName(name) {
    if (
      !/[a-zA-Z0-9,.' ]+$/i.test(
        name,
      )
    ) {
      return false;
    } else return true;
  }


  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  signUp() {
    this.spinner.show();
    const signupData = {
      username: this.userData.email.toLowerCase(),
      password: this.userData.password,
      attributes: {
        email: this.userData.email.toLowerCase(),
        'custom:user_name': this.userData.username,
        'custom:user_type': this.userData.user_type,
        'custom:company_name': this.userData.company_name ? this.userData.company_name : '',
        'custom:user_fname': this.userData.user_fname,
        'custom:user_lname': this.userData.user_lname,
      },
    };
    Auth.signUp(signupData).then(response => {
      console.log(response);
      // this.viewConfirm = true;
      this.spinner.hide();
      Swal.fire({
        title: 'You’re almost there!',
        text: 'Please check your email for a verification link',
        icon: 'success',
      })
      this.router.navigate(['/auth/login']);
    }).catch(error => {
      this.spinner.hide();
      Swal.fire({
        title: 'Email already in use!',
        // text: error.message,
        text: "Please log in. If you've forgotten your password, please click the Forgot Password link",
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
      })
    });
  }

  onConfirmCode() {
    if (

      this.userData.email &&
      this.verification_code
    ) {
      this.confirmSignUp();
    } else {
      Swal.fire({
        text: 'Please fill all the fields.',
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
      })
    }
  }

  confirmSignUp() {
    this.spinner.show();
    Auth.confirmSignUp(this.user_email, this.verification_code).then(response => {
      console.log(response);
      this.spinner.hide();
      Swal.fire({
        title: 'Account Verified!',
        text: 'Please log in',
        icon: 'success',
      })
      this.router.navigate(['/auth/login']);
    }).catch(error => {
      this.spinner.hide();
      Swal.fire({
        title: 'Something went wrong!',
        text: 'Invalid verification code provided, please try again.',
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
      })
    });
  }

}
