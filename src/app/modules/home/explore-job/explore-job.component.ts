import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, SharedService } from '../../../services';
import { LocalStorageService } from 'ngx-localstorage';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';


@Component({
  selector: 'app-explore-job',
  templateUrl: './explore-job.component.html',
  styleUrls: ['./explore-job.component.scss']
})
export class ExploreJobComponent implements OnInit {
  @HostListener('window:popstate', ['$event'])
  public category_list: any = [];
  public job_list: any = [];
  public sortDataList: any = [
    { key: 'one_day', value: 'One Day' },
    { key: 'three_days', value: 'Three Days' },
    { key: 'seven_days', value: 'Seven Days' },
    { key: 'two_weeks', value: 'Two Weeks' },
    { key: 'one_month', value: 'One Month' },
    { key: 'any_time', value: 'Any Time' }
  ];
  public selectedCategory: any = {
    category_image: "",
    category_name: "",
    id_category: "",
    is_active: ""
  };
  public selectedJob: any = {};
  public jobData: any = {};
  public phone: any = '';
  public selectedExprience: any = '';
  public location: any = '';
  public lat: any = '';
  public lng: any = '';
  public keyword: any = '';
  public shortType: any = 'any_time';
  public offset: number = 0;
  is_full_time: boolean = false;
  is_part_time: boolean = false;
  is_contractor: boolean = false;
  is_temporary: boolean = false;
  is_booth_rent: boolean = false;
  is_hourly: boolean = false;
  loadmore: boolean = false;
  can_apply: boolean = false;
  public radius: any = [
    { key: 5, value: '5 miles' },
    { key: 10, value: '10 miles' },
    { key: 15, value: '15 miles' },
    { key: 25, value: '25 miles' },
    { key: 50, value: '50 miles' },
    { key: 100, value: '100 miles' },
    { key: 3950, value: 'Anywhere' },
  ];

  public selectedRadius: any = '';
  // public selectedRadius: any = 15;
  selectedItems = [];
  dropdownSettings = {};

  constructor(
    private router: Router,
    private homeService: HomeService,
    private localStorage: LocalStorageService,
    private spinner: NgxSpinnerService,
    private sharedService: SharedService,
  ) {
    router.events
      .subscribe((event: any) => {
        if (event.navigationTrigger === 'popstate') {
          // Perform actions
          (<HTMLInputElement>document.getElementById('closePopup')).click();
          console.log('backbutton click');
        }
      });
  }

  ngOnInit(): void {
    this.homeService.setTitle('Explore Jobs');
    this.sharedService.currentMessage.subscribe(message => {
      this.loadCategoryList();
      if (this.localStorage.get('sub_id') && this.localStorage.get('user_type') == '2') {
        this.can_apply = true;
      }
    })

    this.dropdownSettings = {
      singleSelection: true,
      text: "Category",
      classes: "myclass custom-class form-control",
      showCheckbox: false,
    };

  }


  onItemSelect(item: any) {
    this.selectedCategory = item;
    this.loadJobList();
  }

  handleAddressChange(address: any) {
    this.location = address.formatted_address;
    this.lat = JSON.stringify(address.geometry.location.lat());
    this.lng = JSON.stringify(address.geometry.location.lng());
    this.loadJobList();
  }

 

  OnItemDeSelect(item: any) {
    this.selectedCategory = {
      category_image: "",
      category_name: "",
      id_category: "",
      is_active: ""
    };
    this.loadJobList();
  }
  onDeSelectAll(item: any) {
    this.selectedCategory = {
      category_image: "",
      category_name: "",
      id_category: "",
      is_active: ""
    };
    this.loadJobList();
  }
  



  loadCategoryList() {
    this.spinner.show();
    let payload = {
      limit: 10,
      offset: 0,
    };

    this.homeService.getCategoryList(payload)
      .subscribe(
        (response) => {
          // this.spinner.hide();
          if (response.statusCode == 200) {
            this.category_list = response.body;
            this.loadJobList();
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

  onCategorySelect(item) {
    this.selectedCategory = item;
    this.loadJobList()
  }

  onSearch() {
    this.offset = 0;
    this.loadJobList();
  }

  onLoadMore() {
    this.offset = this.offset + 10;
    this.loadJobList();
  }

  onReset() {
    this.offset = 0;
    (<HTMLInputElement>document.getElementById('placeAutocomplete')).value = '';
    this.location = '';
    this.lat = '';
    this.lng = '';
    this.keyword = '';
    this.selectedItems = [];
    this.selectedRadius = '',
      this.shortType = 'any_time';
    this.selectedCategory = {
      category_image: "",
      category_name: "",
      id_category: "",
      is_active: ""
    };
    this.is_full_time = false;
    this.is_part_time = false;
    this.is_contractor = false;
    this.is_temporary = false;
    this.is_booth_rent = false;
    this.is_hourly = false;
    this.loadJobList();
  }
  onResetRadius() {
    this.selectedRadius = '';
    this.loadJobList();
  }

  loadJobList() {
    this.spinner.show();
    let jobTypes = [];
    if (this.is_full_time) {
      jobTypes.push('is_full_time');
    }
    if (this.is_part_time) {
      jobTypes.push('is_part_time');
    }
    if (this.is_contractor) {
      jobTypes.push('is_contractor');
    }
    if (this.is_temporary) {
      jobTypes.push('is_temporary');
    }
    if (this.is_booth_rent) {
      jobTypes.push('is_booth_rent');
    }
    if (this.is_hourly) {
      jobTypes.push('is_hourly');
    }
    let payload = {
      data_query: {
        job_title: this.keyword,
        job_tag: this.selectedCategory.id_category.toString(),
        job_location: this.location
      },
      latitude: this.lat,
      longitude: this.lng,
      radius: this.lat && this.selectedRadius == '' ? '15' : this.selectedRadius,
      data_sort: this.shortType,
      job_type: jobTypes,
      offset: this.offset,
      candidate_sub_id: this.localStorage.get('sub_id')
    };

    this.homeService.getJobList(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.statusCode == 200) {

            if (response.body.data.length == 10) {
              this.loadmore = true;
            } else {
              this.loadmore = false;
            }
            if (this.offset > 0) {
              response.body.data.forEach(element => {
                this.job_list.push(element)
              });
            } else {
              // let job_applied_by_user = [];
              // job_applied_by_user = response.body.job_applied_by_user;
              this.job_list = response.body.data;
              // const temp = this.job_list.map(job => ({
              //   ...job,
              //   is_applied: job_applied_by_user.findIndex(x => x == job.id_job_post) == -1 ? false : true
              // }));
              // this.job_list = temp;
              // console.log(this.job_list);
            }

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

  onJobApply(job) {
    if (this.can_apply) {
      this.jobApply(job);
    } else if (this.localStorage.get('sub_id') && this.localStorage.get('user_type') == '1') {
      Swal.fire({
        title: "Subcription required.",
        text: "You are not a Applicant. Please login or switch your account as Applicant.",
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
      });
    } else {
      Swal.fire({
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
        title: 'Login Required',
        text: "To apply on this job, please create a free account.",
      });
    }
  }

  jobApply(job) {
    console.log(job);
    this.spinner.show();
    let payload = {
      id_job_post: job.id_job_post,
      recruiter_sub_id: job.user_sub_id,
      candidate_sub_id: this.localStorage.get('sub_id'),
    }

    this.homeService.jobApply(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.statusCode == 200) {
            Swal.fire({
              title: 'Sent Successfully!',
              text: 'Application sent successfully.',
              icon: 'success',
            })
            job.is_applied = true;

          } else {
            Swal.fire({
              title: 'Oops!',
              text: 'Please create a resume before applying for a job',
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

  onViewJobDetails(job) {
    if (this.can_apply) {
      // this.router.navigate(['/explore-job/job-details', { 'id': btoa(job.id_job_post) }])
      this.selectedJob = job;
      this.getjobData(job.id_job_post);
    } else if (this.localStorage.get('sub_id') && this.localStorage.get('user_type') == '1') {
      Swal.fire({
        title: "Subcription required.",
        text: "You are not a Applicant. Please login or switch your account as Applicant.",
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
      });
    } else {
      Swal.fire({
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
        title: 'Login Required',
        text: "To view this job posting, please create a free account.",
      });
    }

  }

  getjobData(jobId) {
    this.spinner.show();
    let payload = {
      id_job_post: jobId,
      user_sub_id: this.localStorage.get('sub_id')
    };
    this.homeService.getJobDetails(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response);
          if (response.statusCode == 200) {
            this.jobData = response.body;
            (<HTMLInputElement>document.getElementById('viewJob')).click();
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


  validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    console.log(!!pattern.test(str));
    return !!pattern.test(str);
  }

  onScroll() {
    // console.log('it works')
    this.onLoadMore();
  }


}
