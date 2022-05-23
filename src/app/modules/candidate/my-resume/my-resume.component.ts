import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CandidateService, HomeService } from '../../../services';
import { LocalStorageService } from 'ngx-localstorage';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-resume',
  templateUrl: './my-resume.component.html',
  styleUrls: ['./my-resume.component.scss']
})
export class MyResumeComponent implements OnInit {
  public reasumeList: any = [];
  public inCompleteReasumeList: any = [];

  constructor(
    private router: Router,
    private homeService: HomeService,
    private candidateService: CandidateService,
    private localStorage: LocalStorageService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.getAllResume();
  }

  onViewResume(resume) {
    this.router.navigate(['/resume/resume-details', { 'id': btoa(resume.id_resume_post) }])
  }

  onEditResume(resume) {
    this.router.navigate(['/candidate/resume/edit', {
      'id': btoa(resume.id_resume_post)
    }])
  }

  getAllResume() {
    this.spinner.show();
    let payload = {
      offset: 0,
      is_completed: '1',
      user_sub_id: this.localStorage.get('sub_id')
    };
    this.candidateService.getResumeList(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response);
          if (response.statusCode == 200) {
            this.reasumeList = response.body;
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

  getAllInCompletedResume() {
    this.spinner.show();
    let payload = {
      offset: 0,
      is_completed: '0',
      user_sub_id: this.localStorage.get('sub_id')
    };
    this.candidateService.getResumeList(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response);
          if (response.statusCode == 200) {
            this.inCompleteReasumeList = response.body;
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

  onMakeAsDefault(item) {
    Swal.fire({
      title: 'Do you want to make this your default resume?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      console.log(result.isConfirmed);
      if (result.isConfirmed) {
        this.makeAsDefault(item.id_resume_post);
      }
    })
  }

  makeAsDefault(id) {
    this.spinner.show();
    let payload = {
      id_resume_post: id,
      user_sub_id: this.localStorage.get('sub_id')
    };
    this.candidateService.makeAsDefault(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response);
          if (response.statusCode == 200) {
            Swal.fire({
              title: 'Success!',
              text: 'Successfully set as default resume.',
              icon: 'success',
            });
            this.getAllResume();
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

  onCreateDuplicate(item) {
    Swal.fire({
      title: 'Are you sure want to duplicate this resume?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.duplicateResume(item.id_resume_post);
      }
    })
  }

  duplicateResume(id) {
    this.spinner.show();
    let payload = {
      id_resume_post: id,
      user_sub_id: this.localStorage.get('sub_id')
    };
    this.candidateService.duplicateResume(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response);
          if (response.statusCode == 200) {
            Swal.fire({
              title: 'Successfully Duplicated.',
              icon: 'success',
            });
            this.getAllResume();
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

  onDelete(item) {
    Swal.fire({
      title: 'Are you sure want to delete this resume?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteResume(item.id_resume_post);
      }
    })
  }

  deleteResume(id) {
    this.spinner.show();
    let payload = {
      id_resume_post: id,
      user_sub_id: this.localStorage.get('sub_id')
    };
    this.candidateService.deleteResume(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response);
          if (response.statusCode == 200) {
            Swal.fire({
              title: 'Successfully Deleted.',
              icon: 'success',
            });
            this.getAllResume();
            this.getAllInCompletedResume();
          } else {
            Swal.fire({
              title: 'Something went wrong!',
              text: response.body.msg,
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

}
