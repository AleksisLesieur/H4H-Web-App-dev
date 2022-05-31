import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, SharedService } from '../../../services';
import { LocalStorageService } from 'ngx-localstorage';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-explore-resume',
  templateUrl: './explore-resume.component.html',
  styleUrls: ['./explore-resume.component.scss']
})
export class ExploreResumeComponent implements OnInit {
  public category_list: any = [];
  public resume_list: any = [];
  public portfolioFiles: any = ['', '', '', ''];
  public portfolioData: any = ['', '', '', ''];
  public resumeData: any = {};
  public exp_year: any = [
    { key: 0, value: '0 Years' },
    { key: 1, value: '1+ Years' },
    { key: 2, value: '2+ Years' },
    { key: 3, value: '3+ Years' },
    { key: 4, value: '4+ Years' },
    { key: 5, value: '5+ Years' },
    { key: 6, value: '6+ Years' },
    { key: 7, value: '7+ Years' },
    { key: 8, value: '8+ Years' },
    { key: 9, value: '9+ Years' },
    { key: 10, value: '10+ Year' },
  ];
  public radius: any = [
    { key: 5, value: '5 miles' },
    { key: 10, value: '10 miles' },
    { key: 25, value: '25 miles' },
    { key: 50, value: '50 miles' },
    { key: 100, value: '100 miles' },
    { key: 3950, value: 'Anywhere' },
  ];
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
  loadmore: boolean = false;
  public selectedExprience: any = 0;
  public selectedRadius: any = '';
  public selectedResume: any = {};
  public location: any = '';
  public lat: any = '';
  public lng: any = '';
  public keyword: any = '';
  public shortType: any = 'any_time';
  public offset: number = 0;
  public myPlan: any = {
    status: false,
    package_id: ''
  };

  constructor(
    private router: Router,
    private homeService: HomeService,
    private localStorage: LocalStorageService,
    private spinner: NgxSpinnerService,
    private sharedService: SharedService,
    private sanitizer: DomSanitizer
  ) {
    router.events
      .subscribe((event: any) => {
        if (event.navigationTrigger === 'popstate') {
          // Perform actions
          (<HTMLInputElement>document.getElementById('closePopup1')).click();
          console.log('backbutton click');
        }
      });
  }

  ngOnInit(): void {
    this.homeService.setTitle('Explore Resumes');
    this.setResumeData();
    this.sharedService.currentMessage.subscribe(message => {
      this.loadCategoryList();
      if (this.localStorage.get('sub_id') && this.localStorage.get('user_type') == '1') {
        this.checkCurrentSubscription();
      }
    })
  }
  setResumeData() {
    this.resumeData = {
      user_sub_id: '',
      user_name: '',
      user_email: '',
      phone_number: '',
      location: '',
      personal_statement: '',
      professional_title: '',
      resume_category: '',
      category_name: '',
      user_photo: '',
      user_video: '',
      instagram: '',
      facebook: '',
      urls: [],
      portfolio: [],
      states_territories: '',
      states_territories_name: '',
      school_id: '',
      school_name: '',
      other_school: '',
      other_school_flag: '',
      apprentice_program_flag: '',
      apprentice_program: '',
      certificate_license_flag: '',
      license_year: '',
      license_month: '',
      certificate_license: '',
      job_exp: [],
      skills: '',
      is_full_time: false,
      is_part_time: false,
      is_contractor: false,
      is_temporary: false,
      is_booth_rent: false,
      is_hourly: false,
    }
  }

  checkCurrentSubscription() {
    // this.spinner.show();
    let payload = {
      user_sub_id: this.localStorage.get('sub_id'),
    };

    this.homeService.checkSubscription(payload)
      .subscribe(
        (response) => {
          // this.spinner.hide();
          this.myPlan = response;
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
            const temp = this.category_list.map(p => ({
              ...p,
              is_selected: false
            }));
            this.category_list = temp;
            console.log(temp);
            this.loadResumeList();
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

  getSelectedCategory() {
    const value = [];
    this.category_list.forEach(element => {
      if (element.is_selected) {
        value.push(element.id_category);
      }
    });
    return value;
  }

  onCategorySelect(item) {
    this.selectedCategory = item;
    this.loadResumeList()
  }

  onSearch() {
    this.offset = 0;
    this.loadResumeList();
  }
  handleAddressChange(address: any) {
    this.location = address.formatted_address;
    this.lat = JSON.stringify(address.geometry.location.lat());
    this.lng = JSON.stringify(address.geometry.location.lng());
    this.loadResumeList();
  }
  onReset() {
    this.offset = 0;
    // this.selectedCategory = {
    //   category_image: "",
    //   category_name: "",
    //   id_category: "",
    //   is_active: ""
    // };
    (<HTMLInputElement>document.getElementById('placeAutocomplete')).value = '';
    const temp = this.category_list.map(p => ({
      ...p,
      is_selected: false
    }));
    this.category_list = temp;
    this.selectedExprience = 0;
    this.selectedRadius = '',
      this.location = '';
    this.lat = '';
    this.lng = '';
    this.keyword = '';
    this.shortType = 'any_time';
    this.loadResumeList();
  }

  loadMore() {
    this.offset = this.offset + 1;
    this.loadResumeList();
  }

  loadResumeList() {
    this.spinner.show();
    let payload = {
      data_query: {
        professional_title: this.keyword,
        resume_category: this.getSelectedCategory(),
        location: this.location,
        experience: {
          min_year: parseInt(this.selectedExprience),
          max_year: parseInt(this.selectedExprience) == 0 ? 0 : parseInt(this.selectedExprience) + 10
        }
      },
      latitude: this.lat,
      longitude: this.lng,
      radius: this.lat && this.selectedRadius == '' ? '15' : this.selectedRadius,
      recruiter_sub_id: this.localStorage.get('user_type') == '1' ? this.localStorage.get('sub_id') : '',
      data_sort: this.shortType,
      offset: this.offset,
    };

    this.homeService.getResumeList(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.statusCode == 200) {
            if (response.body.length == 10) {
              this.loadmore = true;
            } else {
              this.loadmore = false;
            }
            if (this.offset > 0) {
              response.body.forEach(element => {
                this.resume_list.push(element)
              });
            } else {
              this.resume_list = response.body;
              // const temp = this.resume_list.map(resume => ({
              //   ...resume,
              //   // is_invited: job_applied_by_user.findIndex(x => x == job.id_job_post) == -1 ? false : true
              //   is_invited: false
              // }));
              // this.resume_list = temp;
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

  onLoadMore() {
    this.offset = this.offset + 10;
    this.loadResumeList();
  }

  onInvite(resume) {
    if (!this.localStorage.get('sub_id')) {
      Swal.fire({
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
        title: 'Access Unavailable',
        text: "To invite this resume, please create an account.",
      });
    } else if (this.localStorage.get('sub_id') && this.localStorage.get('user_type') == '2') {
      Swal.fire({
        title: "Access Unavailable",
        text: "Please log in or switch your account status to Recruiter for access.",
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
      });
    } else if (!this.myPlan.status) {
      Swal.fire({
        title: "Want to Send an Invite?",
        text: "You need an active Plus package to invite a candidate to apply. Take a look at our packages and see which option is right for you!",
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
        showCancelButton: true,
        cancelButtonText: 'Later',
        confirmButtonText: 'See options'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/all-access']);
        };
      })
    } else if (this.myPlan.status &&
      (this.myPlan.package_id == 3 || this.myPlan.package_id == 4)) {
      this.sendInvite(resume);
    } else {
      Swal.fire({
        title: "Want to Send an Invite?",
        text: "You need an active Plus package to invite a candidate to apply. Take a look at our packages and see which option is right for you!",
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
        showCancelButton: true,
        cancelButtonText: 'Later',
        confirmButtonText: 'See options'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/all-access']);
        };
      });
    }


  }

  sendInvite(resume) {
    this.spinner.show();
    console.log('resueme', resume)
    let payload = {
      recruiter_sub_id: this.localStorage.get('sub_id'),
      candidate_sub_id: resume.user_sub_id,
    }

    this.homeService.inviteCandidate(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.statusCode == 200) {
            Swal.fire({
              title: 'Sent Successfully!',
              text: 'Invitation sent successfully',
              icon: 'success',
            })
            resume.is_invited = true;

          } else {
            Swal.fire({
              title: 'Warning!',
              text: response.errorMessage,
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

  onViewResume(resume) {
    if (!this.localStorage.get('sub_id')) {
      Swal.fire({
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
        title: 'Login Required',
        text: "To view this resume, please create an account.",
      });
    } else if (this.localStorage.get('sub_id') && this.localStorage.get('user_type') == '2') {
      Swal.fire({
        title: "Valid login required.",
        text: "You are not a Recruiter. Please login or switch your account as Recruiter.",
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
      });
    } else if (!this.myPlan.status) {
      Swal.fire({
        title: "Subscription required",
        text: "Please purchase a subscription plan to view resumes",
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
      });
    } else if (this.myPlan.status &&
      (this.myPlan.package_id == 3 || this.myPlan.package_id == 4)) {
      this.selectedResume = resume;
      this.getResumeData(resume);
    } else {
      Swal.fire({
        title: "Subcription required.",
        text: "To view this resume, Please purchase suitable subscription plan.",
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
      });
    }

  }

  viewResume(resume) {
    // this.router.navigate(['/resume/resume-details', { 'id': btoa(resume.id_resume_post) }])
  }

  getResumeData(resume) {
    this.setResumeData();
    this.spinner.show();
    let payload = {
      id_resume_post: resume.id_resume_post
    };
    this.homeService.getResumeDetails(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response);
          if (response.statusCode == 200) {
            this.resumeData = response.body;
            // console.log(response.body.job_exp);
            this.resumeData.urls = JSON.parse(response.body.urls);
            this.resumeData.job_exp = JSON.parse(response.body.job_exp);
            // console.log(this.resumeData);
            (<HTMLInputElement>document.getElementById('viewResume')).click();
          } else {
            Swal.fire({
              title: 'Something went wrong!',
              text: "Resume Data not found.",
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

  transformUrl(data) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(data);
  }

  validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
  }

  onScroll(){
    this.onLoadMore()
  }

}
