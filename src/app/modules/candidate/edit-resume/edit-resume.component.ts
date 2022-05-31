import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CandidateService } from '../../../services';
import { LocalStorageService } from 'ngx-localstorage';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageCompressorService, CompressorConfig } from 'ngx-image-compressor';
import * as S3 from 'aws-sdk/clients/s3';
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'app-edit-resume',
  templateUrl: './edit-resume.component.html',
  styleUrls: ['./edit-resume.component.scss']
})
export class EditResumeComponent implements OnInit {
  contactInformation!: FormGroup;
  personalInformation!: FormGroup;
  educationalInformation!: FormGroup;
  workInformation!: FormGroup;
  skillsInformation!: FormGroup;
  step = 1;
  reasumeData = { states_territories: '', resume_category: '', user_photo: '' };
  contactInformationStep: boolean = false;
  personalInformationStep: boolean = false;
  educationalInformationStep: boolean = false;
  workInformationStep: boolean = false;
  skillsInformationStep: boolean = false;
  public school_list: any = [];
  public state_list: any = [];
  public resumeId: any = '';
  public selectedCategory: any = {
    category_image: "",
    category_name: "",
    id_category: "20",
    is_active: ""
  };
  selectedItems = [];
  dropdownSettings = {};
  public userData: any = {};
  public profileUpdated: boolean = true;
  public hitSubmit: boolean = false;
  public resumeForm: FormGroup;
  public base64textString: any = '';
  public portfolioFiles: any = ['', '', '', ''];
  public portfolioData: any = ['', '', '', ''];
  public states_territories_name: any = "";
  public school_name: any = '';
  public other_school_flag: any = '0';
  public certificateFiles: any = [];
  result: string = '';
  isCurrentlyWorking: boolean = false;
  public category_list: any = [];
  public phone: any = '';
  public resumeData: any = {
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
  };
  public months: any = [
    { key: 1, value: "Jan" },
    { key: 2, value: "Feb" },
    { key: 3, value: "Mar" },
    { key: 4, value: "Apr" },
    { key: 5, value: "May" },
    { key: 6, value: "Jun" },
    { key: 7, value: "Jul" },
    { key: 8, value: "Aug" },
    { key: 9, value: "Sep" },
    { key: 10, value: "Oct" },
    { key: 11, value: "Nov" },
    { key: 12, value: "Dec" },
  ];
  public years: any = [
    { key: 2022, value: "2022" },
    { key: 2021, value: "2021" },
    { key: 2020, value: "2020" },
    { key: 2019, value: "2019" },
    { key: 2018, value: "2018" },
    { key: 2017, value: "2017" },
    { key: 2016, value: "2016" },
    { key: 2015, value: "2015" },
    { key: 2014, value: "2014" },
    { key: 2013, value: "2013" },
    { key: 2012, value: "2012" },
    { key: 2011, value: "2011" },
    { key: 2010, value: "2010" },
    { key: 2009, value: "2009" },
    { key: 2008, value: "2008" },
    { key: 2007, value: "2007" },
    { key: 2006, value: "2006" },
    { key: 2005, value: "2005" },
    { key: 2004, value: "2004" },
    { key: 2003, value: "2003" },
    { key: 2002, value: "2002" },
    { key: 2001, value: "2001" },
    { key: 2000, value: "2000" }
  ];
  public exp_year: any = [
    { key: 0, value: '0 years' },
    { key: 1, value: '1 year' },
    { key: 2, value: '2 years' },
    { key: 3, value: '3 years' },
    { key: 4, value: '4 years' },
    { key: 5, value: '5 years' },
    { key: 6, value: '6 years' },
    { key: 7, value: '7 years' },
    { key: 8, value: '8 years' },
    { key: 9, value: '9 years' },
    { key: 10, value: '10+ years' },
  ];
  public exp_month: any = [
    { key: 0, value: '0 month' },
    { key: 1, value: '1 month' },
    { key: 2, value: '2 months' },
    { key: 3, value: '3 months' },
    { key: 4, value: '4 months' },
    { key: 5, value: '5 months' },
    { key: 6, value: '6 months' },
    { key: 7, value: '7 months' },
    { key: 8, value: '8 months' },
    { key: 9, value: '9 months' },
    { key: 10, value: '10 months' },
    { key: 11, value: '11 months' },
  ];

  public urlPattern = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  public locationPattern = "^[a-zA-Z,.' ]+$";
  public namePattern = '^[a-zA-Z ]+$';
  public textareaPattern = "^[a-zA-Z0-9,.' ]+$";

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private localStorage: LocalStorageService,
    private spinner: NgxSpinnerService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private imageCompressor: ImageCompressorService
  ) { }

  ngOnInit(): void {
    this.createForms();
    this.loadCategoryList();
    this.loadStateList();


  }

  createForms() {
    this.contactInformation = this.fb.group({
      user_sub_id: [this.localStorage.get('sub_id'), Validators.required],
      user_name: ['', [Validators.required]],
      user_email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.maxLength(14), Validators.minLength(14)]],
      location: ['', [Validators.required]],
      lat: ['', [Validators.required]],
      lng: ['', [Validators.required]]
    });

    this.personalInformation = this.fb.group({
      personal_statement: ['', [Validators.required]],
      professional_title: ['', [Validators.required]],
      resume_category: ['', Validators.required],
      user_photo: [''],
      portfolio: this.fb.array([]),
      user_video: ['', [Validators.pattern(this.urlPattern)]],
      instagram: ['', [Validators.pattern(this.urlPattern)]],
      facebook: ['', [Validators.pattern(this.urlPattern)]],
      urls: this.fb.array([])
    });

    this.educationalInformation = this.fb.group({
      states_territories: [''],
      school_id: [''],
      other_school: [''],
      other_school_flag: [''],
      apprentice_program_flag: ['', Validators.required],
      apprentice_program: [''],
    });

    this.workInformation = this.fb.group({
      certificate_license_flag: ['', Validators.required],
      license_year: ['', Validators.required],
      license_month: ['0', Validators.required],
      certificate_license: [''],
      job_exp: this.fb.array([]),
    });
    // this.addWorkHistory();
    this.skillsInformation = this.fb.group({
      skills: ['', [Validators.required]],
      is_full_time: false,
      is_part_time: false,
      is_contractor: false,
      is_temporary: false,
      is_booth_rent: false,
      is_hourly: false,
    });
    this.dropdownSettings = {
      singleSelection: true,
      text: "Category",
      classes: "multiselect form-control",
      showCheckbox: false,
    };
  }

  onItemSelect(item: any) {
    if (item.id_category != '20') {
      this.selectedCategory = item;
    }
  }

  OnItemDeSelect(item: any) {
    this.selectedCategory = {
      category_image: "",
      category_name: "",
      id_category: "",
      is_active: ""
    };
    console.log(this.personalInformation.value.resume_category);
  }
  onDeSelectAll(item: any) {
    this.selectedCategory = {
      category_image: "",
      category_name: "",
      id_category: "",
      is_active: ""
    };
    console.log(this.personalInformation.value.job_tag);
  }

  loadCategoryList() {
    this.spinner.show();
    let payload = {
      limit: 10,
      offset: 0,
    };

    this.candidateService.getCategoryList(payload)
      .subscribe(
        (response) => {
          // this.spinner.hide();
          if (response.statusCode == 200) {
            this.category_list = response.body;
            this.getResumeData();
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
    if (item.id_category != '20') {
      this.selectedCategory = item;
      this.personalInformation.patchValue({
        resume_category: item.id_category,
      });
    }

  }

  onChangeTraining() {
    this.educationalInformationStep = false;
    this.educationalInformation.get('other_school').clearValidators()
    if (this.educationalInformation.controls.apprentice_program_flag.value == 0) {
      this.educationalInformation.get('apprentice_program').clearValidators();
      this.educationalInformation.get('states_territories').setValidators([Validators.required]);
      this.educationalInformation.get('school_id').setValidators([Validators.required]);
    } else {
      this.educationalInformation.get('apprentice_program').setValidators([Validators.required]);
      this.educationalInformation.get('states_territories').clearValidators();
      this.educationalInformation.get('school_id').clearValidators();
    }
    this.educationalInformation.get('apprentice_program').updateValueAndValidity();
    this.educationalInformation.get('states_territories').updateValueAndValidity();
    this.educationalInformation.get('school_id').updateValueAndValidity();
    this.educationalInformation.patchValue({
      states_territories: '',
      school_id: '',
      apprentice_program: '',
    });
  }

  setSchool(id) {
    this.educationalInformationStep = false;
    if (id != 61) {
      this.other_school_flag = '0';
      let index = this.school_list.findIndex(s => s.idschool == id)
      this.school_name = this.school_list[index].school_name;
      console.log(this.school_name)
      this.educationalInformation.get('other_school').clearValidators()
    } else {
      this.other_school_flag = '1';
      this.educationalInformation.get('other_school').setValidators([Validators.required]);
    }
    this.educationalInformation.get('other_school').updateValueAndValidity();
    this.educationalInformation.patchValue({
      other_school: '',
    });
  }

  loadStateList() {
    // this.spinner.show();
    let payload = {
    };

    this.candidateService.getStateList(payload)
      .subscribe(
        (response) => {
          // this.spinner.hide();
          if (response.statusCode == 200) {
            this.state_list = response.body;
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

  loadSchoolList(stateId) {
    if (stateId) {
      let index = this.state_list.findIndex(s => s.idstates_territories == stateId);
      this.states_territories_name = this.state_list[index].states_territories_name;
    }
    this.spinner.show();
    let payload = {
      idstates_territories: stateId
    };

    this.candidateService.getSchoolList(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.statusCode == 200) {
            this.school_list = response.body;
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

  getResumeData() {
    // this.spinner.show();
    this.resumeId = atob(this.activatedRoute.snapshot.params['id']);
    let payload = {
      id_resume_post: atob(this.activatedRoute.snapshot.params['id']),
      user_sub_id: this.localStorage.get('sub_id')
    };
    this.candidateService.getUsersResumeDetails(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response);
          if (response.statusCode == 200) {
            this.reasumeData = response.body;
            this.portfolioFiles[0] = response.body.portfolio[0] ? response.body.portfolio[0] : '';
            this.portfolioFiles[1] = response.body.portfolio[1] ? response.body.portfolio[1] : '';
            this.portfolioFiles[2] = response.body.portfolio[2] ? response.body.portfolio[2] : '';
            this.portfolioFiles[3] = response.body.portfolio[3] ? response.body.portfolio[3] : '';
            this.portfolioData[0] = response.body.portfolio[0] ? response.body.portfolio[0] : '';
            this.portfolioData[1] = response.body.portfolio[1] ? response.body.portfolio[1] : '';
            this.portfolioData[2] = response.body.portfolio[2] ? response.body.portfolio[2] : '';
            this.portfolioData[3] = response.body.portfolio[3] ? response.body.portfolio[3] : '';
            this.setFormValue(this.reasumeData);
            this.loadSchoolList(this.reasumeData.states_territories);
            var index = this.category_list.findIndex(x => x.id_category == this.reasumeData.resume_category);
            console.log('+++++++++++++++', index);
            if (index != -1 && this.category_list[index].id_category != '20') {
              this.selectedCategory = this.category_list[index];
              this.selectedItems = [this.selectedCategory]
            }
          }
          // else if (response.statusCode == 204) {
          //   Swal.fire({
          //     title: 'Authorization Denied!',
          //     text: "You are not a authorized to access it.",
          //     icon: 'warning',
          //   });
          //   this.goBack();
          // } 
          else {
            // Swal.fire({
            //   title: 'Authorization Denied!',
            //   text: "You are not a authorized to access it.",
            //   icon: 'warning',
            // });
            this.goBack();
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

  goBack() {
    this.location.back();
  }

  setFormValue(resume) {

    this.contactInformation.patchValue({
      user_sub_id: resume.user_name,
      user_name: resume.user_name,
      user_email: resume.user_email,
      phone_number: resume.phone_number,
      location: resume.location,
      lat: resume.lat,
      lng: resume.lng
    });

    this.personalInformation.patchValue({
      personal_statement: resume.personal_statement,
      professional_title: resume.professional_title,
      resume_category: resume.resume_category == '20' ? '' : parseInt(resume.resume_category),
      user_video: resume.user_video,
      user_photo: '',
      instagram: resume.instagram,
      facebook: resume.facebook,
    });

    JSON.parse(resume.urls).forEach(element => {
      this.urls().push(this.newUrl(element.url));
    });

    this.educationalInformation.patchValue({
      states_territories: resume.states_territories,
      school_id: resume.school_id,
      other_school: resume.other_school ? resume.other_school : '',
      other_school_flag: resume.other_school_flag,
      apprentice_program_flag: resume.apprentice_program_flag,
      apprentice_program: resume.apprentice_program,
    });

    this.workInformation.patchValue({
      certificate_license_flag: resume.certificate_license_flag,
      license_year: resume.license_year,
      license_month: '0',
      certificate_license: resume.certificate_license,
    });

    JSON.parse(resume.job_exp).forEach((element, index) => {
      if (index == 0) {
        this.isCurrentlyWorking = element.is_current;
      }
      this.addedWorkHistory(element);
    });

    this.skillsInformation.patchValue({
      skills: resume.skills,
      is_full_time: resume.is_full_time == 'True' ? true : false,
      is_part_time: resume.is_part_time == 'True' ? true : false,
      is_contractor: resume.is_contractor == 'True' ? true : false,
      is_temporary: resume.is_temporary == 'True' ? true : false,
      is_booth_rent: resume.is_booth_rent == 'True' ? true : false,
      is_hourly: resume.is_hourly == 'True' ? true : false,
    });

  }

  onSaveResume() {
    if (
      this.personalInformation.valid &&
      this.contactInformation.valid &&
      this.educationalInformation.valid &&
      this.workInformation.valid &&
      this.workInformation.valid
    ) {
      this.submitSkillsInformation();
    } else {
      Swal.fire({
        title: 'Required fields!',
        text: "Please fill all the required fields.",
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
      })
    }
  }


  submitContactInformation() {
    this.spinner.show();
    let payload = this.contactInformation.value;
    payload.id_resume_post = this.resumeId;
    this.candidateService.updateContactInfo(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.statusCode == 200) {
            // Swal.fire({
            //   title: 'Success!',
            //   text: 'Updated Successfully',
            //   icon: 'success',
            // });
            // this.submitPersonalInformation();
          }
        },
        (error) => {
          this.spinner.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Updated Successfully',
            imageUrl: 'assets/images/smile.png',
            imageHeight: 150,
            imageAlt: 'A tall image',
          })
        }
      );
  }

  submitPersonalInformation() {
    this.spinner.show();
    let payload = this.personalInformation.value;
    payload.id_resume_post = this.resumeId;
    payload.resume_category = this.selectedCategory.id_category;
    if (this.base64textString.length != 0) {
      payload.user_photo = this.base64textString;
    } else {
      payload.user_photo = this.reasumeData.user_photo;
    }
    payload.portfolio = this.portfolioFiles;
    this.candidateService.savePersonalInfo(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.statusCode == 200) {
            // Swal.fire({
            //   title: 'Success!',
            //   text: 'Updated Successfully',
            //   icon: 'success',
            // });
            // this.submitEducationalInformation();
          }
        },
        (error) => {
          this.spinner.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Updated Successfully',
            imageUrl: 'assets/images/smile.png',
            imageHeight: 150,
            imageAlt: 'A tall image',
          })
        }
      );
  }

  submitEducationalInformation() {
    this.spinner.show();
    let payload = this.educationalInformation.value;
    payload.id_resume_post = this.resumeId;
    if (payload.school_id == '61') {
      payload.other_school_flag = '1';
    } else {
      payload.other_school_flag = '0';
    }
    this.candidateService.saveEducationalInfo(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.statusCode == 200) {
            // Swal.fire({
            //   title: 'Success!',
            //   text: 'Updated Successfully',
            //   icon: 'success',
            // });
            // this.submitWorkInformation();
          }
        },
        (error) => {
          this.spinner.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Updated Successfully',
            imageUrl: 'assets/images/smile.png',
            imageHeight: 150,
            imageAlt: 'A tall image',
          })
        }
      );
  }

  submitWorkInformation() {
    this.spinner.show();
    let payload = this.workInformation.value;
    payload.id_resume_post = this.resumeId;
    this.candidateService.saveWorkInfo(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.statusCode == 200) {
            // Swal.fire({
            //   title: 'Success!',
            //   text: 'Updated Successfully',
            //   icon: 'success',
            // });
            // this.submitSkillsInformation()
          }
        },
        (error) => {
          this.spinner.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Updated Successfully',
            imageUrl: 'assets/images/smile.png',
            imageHeight: 150,
            imageAlt: 'A tall image',
          })
        }
      );
  }

  submitSkillsInformation() {
    this.spinner.show();
    let payload = this.skillsInformation.value;
    payload.id_resume_post = this.resumeId;
    this.candidateService.saveSkillsInfo(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.statusCode == 200) {
            Swal.fire({
              title: 'Success!',
              text: 'Resume Updated Successfully',
              icon: 'success',
            });
            this.router.navigate(['candidate/resume']);
          }
        },
        (error) => {
          this.spinner.hide();
          Swal.fire({
            title: 'Success!',
            text: 'Updated Successfully',
            imageUrl: 'assets/images/smile.png',
            imageHeight: 150,
            imageAlt: 'A tall image',
          })
        }
      );
  }

  convertToArray(json) {
    var newJson = json.replace(/([a-zA-Z0-9]+?):/g, '"$1":');
    newJson = newJson.replace(/'/g, '"');
    var data = JSON.parse(newJson);
    return data;
  }



  numericOnly(event): boolean {
    let patt = /^([0-9.$])$/;
    let result = patt.test(event.key);
    return result;
  }

  returnBase64(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let base64textString = reader.result;
      console.log(base64textString);
    };
  }

  handleAddressChange(address: any) {
    this.contactInformation.patchValue({
      location: address.formatted_address,
      lat: JSON.stringify(address.geometry.location.lat()),
      lng: JSON.stringify(address.geometry.location.lng()),
    });
  }


  handleFileSelect(event) {
    const file = event.target.files[0];
    // if (file.size > 10000000) {
    //   Swal.fire({
    //     title: 'File size is too long.',
    //     text: 'Please select a valid image within 10MB size.',
    //     imageUrl: 'assets/images/smile.png',
    //     imageHeight: 150,
    //     imageAlt: 'A tall image',
    //   })
    //   return;
    // }
    const fileType = file['type'];
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    if (validImageTypes.includes(fileType)) {
      this.base64textString = 'assets/images/loader.gif';
      this.compressProfilePic(event);
    } else {
      Swal.fire({
        title: 'Something went wrong!',
        text: 'Please select valid image file.',
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
      })
    }
  }

  public compressProfilePic(event: any): void {
    const rawFiles: File[] = [].slice.call(event.target.files);
    rawFiles.forEach(async (file: File) => {
      const config: CompressorConfig = { orientation: 1, ratio: 50, quality: 50, enableLogs: true };
      const compressedFile: File = await this.imageCompressor.compressFile(file, config);
      this.s3profilePicUpload(compressedFile);
    });
  }


  s3profilePicUpload(file) {
    const contentType = file.type;
    const bucket = new S3(environment.s3config);
    console.log(new Date());
    const params = {
      Bucket: 'hfh-resume-files',
      Key: this.localStorage.get('sub_id') + '_' + new Date().toISOString().replace(/[-:.]/g, ""),
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };
    const options = { partSize: 10 * 1024 * 1024, queueSize: 1 }
    bucket.upload(params, options, function (err, data) {
      if (err) {
        this.removeProfileImage();
        Swal.fire({
          title: 'Something went wrong!',
          text: 'Upload process was not Successful',
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
        })
      } else {
        console.log(data);
        this.base64textString = data.Location;
      }
    }.bind(this));
  }



  removeProfileImage() {

    this.base64textString = '';
    this.personalInformation.patchValue({
      user_photo: '',
    });
    this.resumeData.user_photo = '';
    this.reasumeData.user_photo = '';

  }



  handlePortpolioSelect(event, i) {
    const file = event.target.files[0];
    if (file.size > 10000000) {
      Swal.fire({
        title: 'File size is too long.',
        text: 'Please select a valid image within 10MB size.',
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
      })
      return;
    }
    const fileType = file['type'];
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    if (validImageTypes.includes(fileType)) {
      this.portfolioFiles[i] = 'assets/images/loader.gif';
      this.onSelectPortfolioPic(event, i);
    } else {
      Swal.fire({
        title: 'Something went wrong!',
        text: 'Please select valid image file.',
        imageUrl: 'assets/images/smile.png',
        imageHeight: 150,
        imageAlt: 'A tall image',
      })
    }
  }

  public onSelectPortfolioPic(event: any, i): void {
    const rawFiles: File[] = [].slice.call(event.target.files);
    rawFiles.forEach(async (file: File) => {
      const config: CompressorConfig = { orientation: 1, ratio: 50, quality: 50, enableLogs: true };
      const compressedFile: File = await this.imageCompressor.compressFile(file, config);
      this.s3portfolioPicUpload(compressedFile, i);
    });
  }

  s3portfolioPicUpload(file, i) {
    const contentType = file.type;
    const bucket = new S3(environment.s3config);
    console.log(new Date());
    const params = {
      Bucket: 'hfh-resume-files',
      Key: this.localStorage.get('sub_id') + '_' + new Date().toISOString().replace(/[-:.]/g, ""),
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };
    const options = { partSize: 10 * 1024 * 1024, queueSize: 1 }
    bucket.upload(params, options, function (err, data) {
      if (err) {
        this.portfolioFiles[i] = '';
        Swal.fire({
          title: 'Something went wrong!',
          text: 'Upload process was not Successful',
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
        })
      } else {
        console.log(data);
        this.portfolioFiles[i] = data.Location;
      }
    }.bind(this));
  }

  uploadProfileImage(data) {
    let payload = {
      image: data
    }
    this.candidateService.imageUpload(payload)
      .subscribe(
        (response) => {

          if (response.body.image_url) {
            this.base64textString = response.body.image_url;
          } else {
            this.removeProfileImage();
            Swal.fire({
              title: 'Something went wrong!',
              text: 'Upload process was not Successful',
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
            text: 'Upload process was not Successful',
            imageUrl: 'assets/images/smile.png',
            imageHeight: 150,
            imageAlt: 'A tall image',
          })
        }
      );
  }

  uploadImage(data, i) {
    let payload = {
      image: data
    }
    this.candidateService.imageUpload(payload)
      .subscribe(
        (response) => {
          if (response.body.image_url) {
            this.portfolioFiles[i] = response.body.image_url;
          } else {
            this.portfolioFiles[i] = '';
            Swal.fire({
              title: 'Something went wrong!',
              text: 'Upload process was not Successful',
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
            text: 'Upload process was not Successful',
            imageUrl: 'assets/images/smile.png',
            imageHeight: 150,
            imageAlt: 'A tall image',
          })
        }
      );
  }

  removePortPholioImage(i) {
    this.portfolioData[i] = '';
    this.portfolioFiles[i] = '';
  }

  multihandleFileSelect(event) {
    if (event.target.files && event.target.files[0]) {
      this.portfolioFiles = [];
      this.portfolioData = [];
      // (<FormArray>this.personalInformation.get('portfolio')).clear();
      var filesAmount = event.target.files.length;
      if (filesAmount < 5) {
        for (let i = 0; i < filesAmount; i++) {
          var reader = new FileReader();
          reader.onload = (event: any) => {

            this.portfolioFiles.push(event.target.result);
            // console.log(this.portfolioFiles);
            this.portfolioData.push(event.target.result.split(",")[1]);
            // console.log(this.portfolioData);
            // this.personalInformation.controls['portfolio'].setValue(this.portfolioFiles);
            // this.portfolios().push(this.newPortfolio(event.target.result));
          }
          reader.readAsDataURL(event.target.files[i]);
        }
      } else {
        Swal.fire({
          title: 'Something went wrong!',
          text: 'You are only allowed to upload a maximum of 4 images.',
          imageUrl: 'assets/images/smile.png',
          imageHeight: 150,
          imageAlt: 'A tall image',
        })
      }

    }
  }

  transform() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.base64textString);
  }
  transformUrl(data) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(data);
  }

  gotoStep(tab) {
    if (this.step == 1) {
      this.contactInformationStep = true;
      if (this.contactInformation.invalid) { return }
      this.submitContactInformation();
      this.step = tab
    }
    else if (this.step == 2) {
      this.personalInformationStep = true;
      if (this.personalInformation.invalid) { return }
      this.submitPersonalInformation();
      this.step = tab
    }
    else if (this.step == 3) {
      this.educationalInformationStep = true;
      if (this.educationalInformation.invalid) { return }
      this.submitEducationalInformation();
      this.step = tab
    }
    else if (this.step == 4) {
      this.workInformationStep = true;
      if (this.workInformation.invalid) { return }
      this.submitWorkInformation();
      this.step = tab
    } else if (this.step == 5) {
      this.skillsInformationStep = true;
      if (this.skillsInformation.invalid) { return }
      // this.submitSkillsInformation();
      this.step = tab
    }
  }


  next() {

    if (this.step == 1) {
      this.contactInformationStep = true;
      if (this.contactInformation.invalid) { return }
      this.submitContactInformation();
      this.candidateService.goOnTop();
      this.step++
    }
    else if (this.step == 2) {
      this.personalInformationStep = true;
      if (this.personalInformation.invalid) { return }
      this.submitPersonalInformation();
      this.candidateService.goOnTop();
      this.step++
    }
    else if (this.step == 3) {
      this.educationalInformationStep = true;
      if (this.educationalInformation.invalid) { return }
      this.submitEducationalInformation();
      this.candidateService.goOnTop();
      this.step++
    }
    else if (this.step == 4) {
      // this.workInformationStep = true;
      // if (this.workInformation.invalid) { return }
      // // this.submitWorkInformation();
      // this.step++
      if (this.checkWorkExp()) {
        console.log(this.workInformation.value);
        this.workInformationStep = true;
        if (this.workInformation.invalid) { return }
        this.submitWorkInformation();
        this.candidateService.goOnTop();
        this.step++
      }
    } else if (this.step == 5) {
      this.skillsInformationStep = true;
      if (this.skillsInformation.invalid) { return }
      this.onSaveResume();
      // this.submitSkillsInformation();
    }
  }

  checkWorkExp() {
    var exp = this.workInformation.controls.job_exp.value;
    var counter = 0;
    if (exp.length != 0) {
      exp.map(element => {
        if (element.is_current) {
          element.valid = true;
          counter = counter + 1;
        } else {
          if (parseInt(element.start_year) > parseInt(element.end_year)) {
            element.valid = false;
            counter = counter + 1;
          } else if ((element.start_year == element.end_year) && (parseInt(element.start_month) > parseInt(element.end_month))) {
            element.valid = false;
            counter = counter + 1;
          } else {
            element.valid = true;
            counter = counter + 1;
          }
        }
      });
      if (counter == exp.length) {
        console.log(exp);
        const index = exp.findIndex(e => e.valid === false);
        if (index == -1) {
          return true;
        } else {
          var job = index + 1;
          Swal.fire({
            title: 'Something went wrong!',
            text: "Please select valid start date and end date for Job(" + job + ").",
            imageUrl: 'assets/images/smile.png',
            imageHeight: 150,
            imageAlt: 'A tall image',
          })
          return false;
        }
      }

    } else {
      return true;
    }

  }

  previous() {
    this.step--
    this.candidateService.goOnTop();
    if (this.step == 1) {
      this.contactInformationStep = false;
    }
    if (this.step == 2) {
      this.personalInformationStep = false;
    }
    if (this.step == 3) {
      this.educationalInformationStep = false;
    }
    if (this.step == 4) {
      this.workInformationStep = false;
    }
    if (this.step == 5) {
      this.skillsInformationStep = false;
    }
  }

  // ************** portfolio **************

  portfolios(): FormArray {
    return this.personalInformation.get("portfolio") as FormArray
  }

  newPortfolio(data?): FormGroup {
    return this.fb.group({ image: [data ? data : ''] })
  }

  // ************** URLS **************

  urls(): FormArray {
    return this.personalInformation.get("urls") as FormArray
  }

  newUrl(data?): FormGroup {
    return this.fb.group({
      url: [data ? data : '', [Validators.required, Validators.pattern(this.urlPattern)]],
      // url: [data ? data : '', Validators.required],
    })
  }

  addUrl() {
    this.urls().push(this.newUrl());
  }

  removeUrl(i: number) {
    this.urls().removeAt(i);
  }

  // ************** Work History **************

  workHistorys(): FormArray {
    return this.workInformation.get("job_exp") as FormArray
  }

  newWorkHistory(): FormGroup {
    return this.fb.group({
      company_name: "",
      position_held: "",
      start_year: "",
      start_month: "",
      end_year: "",
      end_month: "",
      is_current: false
    })
  }

  addWorkHistory() {
    this.workHistorys().push(this.newWorkHistory());
  }

  removeWorkHistory(i: number) {
    this.workHistorys().removeAt(i);
  }

  removeEndDate() {
    this.isCurrentlyWorking = !this.isCurrentlyWorking;
    console.log(this.isCurrentlyWorking);
  }

  newAddedWorkHistory(data): FormGroup {
    return this.fb.group({
      company_name: data.company_name,
      position_held: data.position_held,
      start_year: data.start_year,
      start_month: data.start_month,
      end_year: data.end_year,
      end_month: data.end_month,
      is_current: data.is_current
    })
  }

  addedWorkHistory(data) {
    this.workHistorys().push(this.newAddedWorkHistory(data));
  }

  onPreview() {
    this.resumeData = {
      user_sub_id: this.contactInformation.controls.user_sub_id.value,
      user_name: this.contactInformation.controls.user_name.value,
      user_email: this.contactInformation.controls.user_email.value,
      phone_number: this.contactInformation.controls.phone_number.value,
      location: this.contactInformation.controls.location.value,
      personal_statement: this.personalInformation.controls.personal_statement.value,
      professional_title: this.personalInformation.controls.professional_title.value,
      resume_category: this.personalInformation.controls.personal_statement.value,
      category_name: this.selectedCategory.category_name,
      user_photo: this.personalInformation.controls.user_photo.value ? this.personalInformation.controls.user_photo.value : this.reasumeData.user_photo,
      user_video: this.personalInformation.controls.user_video.value,
      instagram: this.personalInformation.controls.instagram.value,
      facebook: this.personalInformation.controls.facebook.value,
      urls: this.personalInformation.controls.urls.value,
      states_territories: this.educationalInformation.controls.states_territories.value,
      states_territories_name: this.states_territories_name,
      school_name: this.school_name,
      school_id: this.educationalInformation.controls.school_id.value,
      other_school: this.educationalInformation.controls.other_school.value,
      other_school_flag: this.other_school_flag,
      apprentice_program_flag: this.educationalInformation.controls.apprentice_program_flag.value,
      apprentice_program: this.educationalInformation.controls.apprentice_program.value,
      certificate_license_flag: this.workInformation.controls.certificate_license_flag.value,
      license_year: this.workInformation.controls.license_year.value,
      license_month: this.workInformation.controls.license_month.value,
      certificate_license: this.workInformation.controls.certificate_license.value,
      job_exp: this.workInformation.controls.job_exp.value,
      skills: this.skillsInformation.controls.skills.value,
      is_full_time: this.skillsInformation.controls.is_full_time.value,
      is_part_time: this.skillsInformation.controls.is_part_time.value,
      is_contractor: this.skillsInformation.controls.is_contractor.value,
      is_temporary: this.skillsInformation.controls.is_temporary.value,
      is_booth_rent: this.skillsInformation.controls.is_booth_rent.value,
      is_hourly: this.skillsInformation.controls.is_hourly.value,
    }
    this.phone = this.contactInformation.controls.phone_number.value;
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

}
