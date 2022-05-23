import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../../../services';
import { NgxSpinnerService } from "ngx-spinner";
import { LocalStorageService } from 'ngx-localstorage';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-access',
  templateUrl: './all-access.component.html',
  styleUrls: ['./all-access.component.scss']
})
export class AllAccessComponent implements OnInit {
  public package_list: any = [];
  constructor(
    private router: Router,
    private homeService: HomeService,
    private spinner: NgxSpinnerService,
    private localStorage: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.homeService.setTitle('Packages');
    this.loadPackagesList();
  }

  loadPackagesList() {
    this.spinner.show();
    let payload = {
    };

    this.homeService.getPackagesList(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
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

}
