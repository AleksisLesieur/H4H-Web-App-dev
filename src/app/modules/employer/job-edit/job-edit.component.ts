import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployerService } from '../../../services';
import { LocalStorageService } from 'ngx-localstorage';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { ImageCompressorService, CompressorConfig } from 'ngx-image-compressor';

@Component({
  selector: 'app-job-edit',
  templateUrl: './job-edit.component.html',
  styleUrls: ['./job-edit.component.scss']
})
export class JobEditComponent implements OnInit {
  jobInformation!: FormGroup;
  jobDescription!: FormGroup;
  companyDescription!: FormGroup;
  socialInformation!: FormGroup;
  jobInformation_step = false;
  jobDescription_step = false;
  companyDescription_step = false;
  socialInformation_step = false;
  public base64textString: any = '';
  public selectedCategory: any = {
    category_image: "",
    category_name: "",
    id_category: "",
    is_active: ""
  };
  step = 1;
  myDate = new Date();
  public category_list: any = [];
  public jobData: any = {};
  public urlPattern = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  public locationPattern = "^[a-zA-Z,.' ]+$";
  public namePattern = '^[a-zA-Z ]+$';
  public textareaPattern = "^[a-zA-Z0-9,.' ]+$";
  public jobId = '';
  selectedItems = [];
  dropdownSettings = {};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private employerService: EmployerService,
    private localStorage: LocalStorageService,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private imageCompressor: ImageCompressorService
  ) { }

  ngOnInit(): void {
    this.jobId = atob(this.activatedRoute.snapshot.params['id'])
    this.createFroms();
    this.loadCategoryList();

  }

  createFroms() {
    this.jobInformation = this.fb.group({
      job_title: ['', [Validators.required]],
      job_phone: ['', [Validators.maxLength(14), Validators.minLength(14)]],
      job_location: ['', [Validators.required]],
      lat: ['', [Validators.required]],
      lng: ['', [Validators.required]],
      job_email: ['', [Validators.required, Validators.email]],
      job_tag: [[], Validators.required],
      is_full_time: [false, Validators.required],
      is_part_time: [false, Validators.required],
      is_contractor: [false, Validators.required],
      is_temporary: [false, Validators.required],
      is_booth_rent: [false, Validators.required],
      is_hourly: [false, Validators.required],
      no_of_opening: ['', [Validators.pattern(/^[1-9]\d*$/)]],
    });
    this.jobDescription = this.fb.group({
      job_summary: ['', [Validators.required]],
      job_duties: [''],
      job_skills: [''],

    });
    this.companyDescription = this.fb.group({
      company_name: ['', Validators.required],
      company_website: ['', [Validators.pattern(this.urlPattern)]],
      company_image: ['', Validators.required],
      company_summary: [''],
    });
    this.socialInformation = this.fb.group({
      facebook: ['', [Validators.pattern(this.urlPattern)]],
      instagram: ['', [Validators.pattern(this.urlPattern)]],
    });
    this.dropdownSettings = {
      singleSelection: true,
      text: "Category",
      classes: "multiselect form-control",
      showCheckbox: false,
    };
  }

  onItemSelect(item: any) {
    this.selectedCategory = item;
    console.log(this.jobInformation.value.job_tag);
  }

  OnItemDeSelect(item: any) {
    this.selectedCategory = {
      category_image: "",
      category_name: "",
      id_category: "",
      is_active: ""
    };
    console.log(this.jobInformation.value.job_tag);
  }
  onDeSelectAll(item: any) {
    this.selectedCategory = {
      category_image: "",
      category_name: "",
      id_category: "",
      is_active: ""
    };
    console.log(this.jobInformation.value.job_tag);
  }


  loadCategoryList() {
    this.spinner.show();
    let payload = {
      limit: 10,
      offset: 0,
    };

    this.employerService.getCategoryList(payload)
      .subscribe(
        (response) => {
          // this.spinner.hide();
          if (response.statusCode == 200) {
            this.category_list = response.body;
            this.getjobData();
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

  onCategorySelect(item) {
    this.selectedCategory = item;
    this.jobInformation.patchValue({
      job_tag: item.id_category,
    });
  }

  getjobData() {
    let payload = {
      id_job_post: this.jobId,
      user_sub_id: this.localStorage.get('sub_id')
    };
    this.employerService.getusersJobDetails(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response);
          if (response.statusCode == 200) {
            this.jobData = response.body;
            this.setFormValue(this.jobData);
            var index = this.category_list.findIndex(x => x.id_category == this.jobData.job_tag);
            console.log(index);
            if (index != -1) {
              this.selectedCategory = this.category_list[index];
              console.log(this.selectedCategory);
              this.selectedItems = [this.selectedCategory]
            }
          } else {
            this.goBack();
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

  goBack() {
    this.location.back();
  }


  setFormValue(jobData) {
    this.jobInformation.patchValue({
      job_title: jobData.job_title,
      job_phone: jobData.job_phone,
      job_location: jobData.job_location,
      lat: jobData.lat,
      lng: jobData.lng,
      job_email: jobData.job_email,
      job_tag: this.selectedItems,
      is_full_time: jobData.is_full_time == 'True' ? true : false,
      is_part_time: jobData.is_part_time == 'True' ? true : false,
      is_contractor: jobData.is_contractor == 'True' ? true : false,
      is_temporary: jobData.is_temporary == 'True' ? true : false,
      is_booth_rent: jobData.is_booth_rent == 'True' ? true : false,
      is_hourly: jobData.is_hourly == 'True' ? true : false,
      no_of_opening: jobData.no_of_opening ? jobData.no_of_opening : ''
    });
    this.jobDescription.patchValue({
      job_summary: jobData.job_summary,
      job_duties: jobData.job_duties,
      job_skills: jobData.job_skills,

    });
    this.companyDescription.patchValue({
      company_name: jobData.company_name,
      company_website: jobData.company_website,
      company_image: jobData.company_image,
      company_summary: jobData.company_summary ? jobData.company_summary : '',
    });
    this.socialInformation.patchValue({
      facebook: jobData.facebook,
      instagram: jobData.instagram,
    });

  }


  submitResume() {
    this.spinner.show();
    let payload = {
      id_job_post: this.jobId,
      user_sub_id: this.localStorage.get('sub_id'),
      job_title: this.jobInformation.value.job_title,
      job_phone: this.jobInformation.value.job_phone,
      job_location: this.jobInformation.value.job_location,
      lat: this.jobInformation.value.lat,
      lng: this.jobInformation.value.lng,
      job_email: this.jobInformation.value.job_email,
      job_tag: this.selectedCategory.id_category,
      no_of_opening: this.jobInformation.value.no_of_opening,
      is_full_time: this.jobInformation.value.is_full_time,
      is_part_time: this.jobInformation.value.is_part_time,
      is_contractor: this.jobInformation.value.is_contractor,
      is_temporary: this.jobInformation.value.is_temporary,
      is_booth_rent: this.jobInformation.value.is_booth_rent,
      is_hourly: this.jobInformation.value.is_hourly,
      job_summary: this.jobDescription.value.job_summary,
      job_duties: this.jobDescription.value.job_duties,
      job_skills: this.jobDescription.value.job_skills,
      company_name: this.companyDescription.value.company_name,
      company_website: this.companyDescription.value.company_website,
      company_image: this.base64textString.length != 0 ? this.base64textString.split(",")[1] : '',
      company_summary: this.companyDescription.value.company_summary,
      facebook: this.socialInformation.value.facebook,
      instagram: this.socialInformation.value.instagram,
    }

    this.employerService.editJob(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.statusCode == 200) {
            Swal.fire({
              title: 'Success!',
              text: 'Updated Successfully',
              icon: 'success',
            });
            this.router.navigate(['/employer/job']);
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

  get jobInfo() { return this.jobInformation.controls; }
  get jobDes() { return this.jobDescription.controls; }
  get companyDes() { return this.companyDescription.controls; }
  get socialInfo() { return this.socialInformation.controls; }

  next() {

    if (this.step == 1) {
      this.companyDescription_step = true;
      if (this.companyDescription.invalid) { return }
      this.employerService.goOnTop();
      this.step++
    }
    else if (this.step == 2) {
      this.jobInformation_step = true;
      if (this.jobInformation.invalid) { return }
      this.employerService.goOnTop();
      this.step++
    }
    else if (this.step == 3) {
      this.jobDescription_step = true;
      if (this.jobDescription.invalid) { return }
      this.employerService.goOnTop();
      this.step++
    }
    else if (this.step == 4) {
      this.socialInformation_step = true;
      if (this.socialInformation.invalid) { return }
      this.submitResume();
    }
  }
  previous() {
    this.step--
    if (this.step == 1) {
      this.jobInformation_step = false;
      this.employerService.goOnTop();
    }
    if (this.step == 2) {
      this.jobDescription_step = false;
      this.employerService.goOnTop();
    }
    if (this.step == 3) {
      this.companyDescription_step = false;
      this.employerService.goOnTop();
    }
    if (this.step == 4) {
      this.socialInformation_step = false;
      this.employerService.goOnTop();
    }
  }
  submit() {
    if (this.step == 4) {
      this.socialInformation_step = true;
      if (this.socialInfo.invalid) { return }
    }
  }


  handleFileSelect(event) {
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
      this.base64textString = 'assets/images/loader.gif';
      this.companyDescription.patchValue({
        company_image: 'assets/images/loader.gif',
      });
      this.compressLogoPic(event);
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

  public compressLogoPic(event: any): void {
    const rawFiles: File[] = [].slice.call(event.target.files);
    rawFiles.forEach(async (file: File) => {
      const config: CompressorConfig = { orientation: 1, ratio: 50, quality: 50, enableLogs: true };
      const compressedFile: File = await this.imageCompressor.compressFile(file, config);
      // this.s3profilePicUpload(compressedFile);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onload = () => {
        this.base64textString = reader.result;
        this.companyDescription.patchValue({
          company_image: reader.result,
        });
      };
    });
  }

  transform() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.base64textString);
  }

  numericOnly(event): boolean {
    let patt = /^([0-9.$])$/;
    let result = patt.test(event.key);
    return result;
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


  removeImage() {
    this.base64textString = '';
    this.companyDescription.patchValue({
      company_image: '',
    });
    this.jobData.company_image = '';
  }

  handleAddressChange(address: any) {
    this.jobInformation.patchValue({
      job_location: address.formatted_address,
      lat: JSON.stringify(address.geometry.location.lat()),
      lng: JSON.stringify(address.geometry.location.lng()),
    });
  }


  onPreview() {
    this.jobData = {
      user_sub_id: this.localStorage.get('sub_id'),
      job_title: this.jobInformation.value.job_title,
      job_phone: this.jobInformation.value.job_phone,
      job_location: this.jobInformation.value.job_location,
      job_email: this.jobInformation.value.job_email,
      job_tag: this.selectedCategory.id_category,
      category_name: this.selectedCategory.category_name,
      no_of_opening: this.jobInformation.value.no_of_opening,
      is_full_time: this.jobInformation.value.is_full_time,
      is_part_time: this.jobInformation.value.is_part_time,
      is_contractor: this.jobInformation.value.is_contractor,
      is_temporary: this.jobInformation.value.is_temporary,
      is_booth_rent: this.jobInformation.value.is_booth_rent,
      is_hourly: this.jobInformation.value.is_hourly,
      job_summary: this.jobDescription.value.job_summary,
      job_duties: this.jobDescription.value.job_duties,
      job_skills: this.jobDescription.value.job_skills,
      company_name: this.companyDescription.value.company_name,
      company_website: this.companyDescription.value.company_website,
      company_image: this.base64textString.length != 0 ? this.base64textString : this.jobData.company_image,
      company_summary: this.companyDescription.value.company_summary,
      facebook: this.socialInformation.value.facebook,
      instagram: this.socialInformation.value.instagram,
    }
  }

}
