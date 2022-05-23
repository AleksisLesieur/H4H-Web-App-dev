import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployerService } from '../../../services';
import { LocalStorageService } from 'ngx-localstorage';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit {
  checkOutInformation!: FormGroup;
  checkOutInformation_submit = false;
  package_details = {
    id_package: '',
    package_description: "",
    package_discount_rate: "",
    package_duration: "",
    package_is_active: "",
    package_is_featured: "",
    package_name: "",
    package_price: ""
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private employerService: EmployerService,
    private localStorage: LocalStorageService,
    private spinner: NgxSpinnerService,
  ) {
    this.package_details = JSON.parse(this.localStorage.get('selected_plan'));
    console.log(this.package_details);
    if (!this.package_details.id_package || this.package_details.id_package.length == 0) {
      this.router.navigate(['/employer/dashboard']);
    }
  }

  ngOnInit(): void {
    this.checkOutInformation = this.fb.group({
      user_sub_id: [this.localStorage.get('sub_id'), Validators.required],
      id_package: [this.package_details.id_package, Validators.required],
      cardnumber: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/), Validators.minLength(16), Validators.maxLength(16)]],
      expyear: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/), Validators.minLength(4), Validators.maxLength(4), Validators.min((new Date()).getFullYear())]],
      expmonth: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/), Validators.minLength(1), Validators.maxLength(2), Validators.max(12)]],
      card_cvv: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/), Validators.minLength(3), Validators.maxLength(3)]],
      auto_renew: [false, Validators.required],
    });
  }

  onSubmit() {
    this.checkOutInformation_submit = true;
    if (this.checkOutInformation.invalid) { return }
    this.makePayment();
    console.log(this.checkOutInformation.value.auto_renew);
  }

  makePayment() {
    this.spinner.show();
    let payload = this.checkOutInformation.value;
    payload.auto_renew = this.checkOutInformation.value.auto_renew ? '1' : '0';
    this.employerService.submitPayment(payload)
      .subscribe(
        (response) => {
          // this.spinner.hide();
          console.log(response);
          if (response.status) {
            this.cancelAllPreviousSubscriptions();
          } else {
            Swal.fire({
              title: 'Transaction Failed.',
              text: response.message,
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


  cancelAllPreviousSubscriptions() {
    let payload = {
      user_sub_id: this.localStorage.get('sub_id')
    }
    this.employerService.cancelPreviousSubscriptions(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response);
          if (response.statusCode == 200) {
            Swal.fire({
              title: 'Transaction Successful',
              text: response.message,
              icon: 'success',
            });
            this.router.navigate(['/employer/dashboard']);
            this.localStorage.set('selected_plan', '');
          } else {
            Swal.fire({
              title: 'Transaction cancelation Failed.',
              text: response.message,
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

  numericOnly(event): boolean {
    let patt = /^([0-9.$])$/;
    let result = patt.test(event.key);
    return result;
  }
  checkMonth() {

  }


}
