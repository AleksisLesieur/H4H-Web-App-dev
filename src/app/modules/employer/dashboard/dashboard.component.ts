import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../../../services';
import { NgxSpinnerService } from "ngx-spinner";
import { LocalStorageService } from 'ngx-localstorage';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public package_list: any = [];
  public my_package_list: any = [];
  constructor(
    private router: Router,
    private homeService: HomeService,
    private spinner: NgxSpinnerService,
    private localStorage: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.loadMyPackagesList();
    this.loadPackagesList();
  }

  loadMyPackagesList() {
    this.spinner.show();
    let payload = {
      user_sub_id: this.localStorage.get('sub_id')
    };

    this.homeService.getMyPackagesList(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.statusCode == 200) {
            // this.package_list = response.body;
            // const temp = this.package_list.map(p => ({
            //   ...p,
            //   package_description: JSON.parse(p.package_description)
            // }));
            // this.package_list = temp;
            // console.log(this.package_list);
            this.my_package_list = response.body.data;
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


  loadPackagesList() {
    // this.spinner.show();
    let payload = {
    };

    this.homeService.getPackagesList(payload)
      .subscribe(
        (response) => {
          // this.spinner.hide();
          if (response.statusCode == 200) {
            this.package_list = response.body;
            const temp = this.package_list.map(p => ({
              ...p,
              package_description: JSON.parse(p.package_description)
            }));
            this.package_list = temp;
            console.log(this.package_list);
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

  onPlanSelect(plan) {
    if (this.localStorage.get('user_type') == '1') {
      this.localStorage.set('selected_plan', JSON.stringify(plan));
      this.router.navigate(['/employer/check-out']);
    } else {
      Swal.fire({
        title: 'Hold On!',
        text: "Please login as an Recruiter.",
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
      });
    }
  }

  onAutoRenew(data, i) {
    if (data.hard_cancel == '1' && i == '0') {
      Swal.fire({
        title: 'Sorry!',
        text: "Looks like admin has modified your subcription. You can't update your subcription auto-renew status.",
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
      })
    } else if (i != '0') {
      Swal.fire({
        title: 'Sorry!',
        text: "You can only update your active subcription auto-renew status.",
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
      })
    } else {
      Swal.fire({
        text: "Are you sure to update subcription auto-renew status?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          this.setAutoRenew(data);
        }
      })
    }

  }

  setAutoRenew(data) {
    this.spinner.show();
    let payload = {
      "body-json": {
        autorenew_id: data.autorenew_id,
        is_autorenew: data.is_autorenew == 1 ? 0 : 1,
        subscription_id: data.subscription_id,
      }
    };

    this.homeService.modifySubscription(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.loadMyPackagesList();
          Swal.fire({
            title: 'Updated Successfully',
            text: 'Subcription updated successfully.',
            icon: 'success',
          })
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
