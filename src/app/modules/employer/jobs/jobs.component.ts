import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EmployerService, HomeService } from '../../../services';
import { LocalStorageService } from 'ngx-localstorage';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';;

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

  public jobList: any = [];
  public myPlan: any = {
    status: false,
    package_id: ''
  };
  constructor(
    private router: Router,
    private homeService: HomeService,
    private employerService: EmployerService,
    private localStorage: LocalStorageService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {

    this.checkCurrentSubscription();
  }

  onEditJob(job) {
    console.log(job);
    this.router.navigate(['/employer/job/edit', { 'id': btoa(job.id_job_post) }])
  }

  getAllJobs() {
    this.spinner.show();
    let payload = {
      offset: 0,
      user_sub_id: this.localStorage.get('sub_id')
    };
    this.employerService.getJobList(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response);
          if (response.statusCode == 200) {
            this.jobList = response.body;
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
  onAddJob() {
    if (this.myPlan.status) {
      this.router.navigate(['/employer/job/add']);
    } else {
      Swal.fire({
        title: 'Want to post a job?',
        text: "You need an active employer package to create a job post. Take a look at our packages and see which option is right for you!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'See Options',
        cancelButtonText: 'Later'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/all-access']);
        }
      })
    }

  }

  onViewJob(job) {
    this.router.navigate(['/employer/job/details', { 'id': btoa(job.id_job_post) }])
  }

  onViewApplicationStatus(job) {
    this.router.navigate(['/employer/job/application-status', { 'id': btoa(job.id_job_post) }])
  }

  onDelete(item) {
    Swal.fire({
      title: 'Are you sure want to delete this job?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteJob(item.id_job_post);
      }
    })
  }

  deleteJob(id) {
    this.spinner.show();
    let payload = {
      id_job_post: id
    };
    this.employerService.deleteJob(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response);
          if (response.statusCode == 200) {
            Swal.fire({
              title: 'Successfully Deleted.',
              icon: 'success',
            });
            this.getAllJobs();
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

  checkCurrentSubscription() {
    this.spinner.show();
    let payload = {
      user_sub_id: this.localStorage.get('sub_id'),
    };

    this.employerService.checkSubscription(payload)
      .subscribe(
        (response) => {
          // this.spinner.hide();
          this.myPlan = response;
          this.getAllJobs();
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
