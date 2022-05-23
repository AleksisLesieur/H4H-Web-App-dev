import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CandidateService } from '../../../services';
import { LocalStorageService } from 'ngx-localstorage';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageCompressorService, CompressorConfig } from 'ngx-image-compressor';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public userData: any = {};
  public profileUpdated: boolean = true;
  public accountForm: FormGroup;
  public base64textString: any = '';
  public hitSubmit: boolean = false;
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
    private sanitizer: DomSanitizer,
    private imageCompressor: ImageCompressorService

  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getProfileDetails();
  }

  createForm() {
    this.accountForm = this.fb.group({
      user_sub_id: ['', Validators.required],
      user_fname: ['', [Validators.required]],
      user_lname: ['', [Validators.required]],
      user_phone_number: ["", [Validators.pattern(/^[1-9]\d*$/), Validators.minLength(10)]],
      user_professional_title: ['', [Validators.required]],
      user_bio: ['', [Validators.required]],
      user_address: [""],
      user_email: ['', [Validators.required]],
      user_image: "",
      user_instagram: [""],
      user_experience: ['', [Validators.required]],
      user_expected_salary: ["", [Validators.pattern(/^[1-9]\d*$/), Validators.required]],
    });
  }

  getProfileDetails() {
    this.spinner.show();
    let payload = {
      user_sub_id: this.localStorage.get('sub_id')
    };
    this.candidateService.profileDetails(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response);
          if (response.statusCode == 200) {
            this.userData = response.body;
            if (this.userData.user_bio == null) {
              this.profileUpdated = false;
            }
            this.accountForm.patchValue({
              user_sub_id: this.userData.user_sub_id,
              user_fname: this.userData.user_fname,
              user_lname: this.userData.user_lname,
              user_phone_number: this.userData.user_phone_number == null ? '' : this.userData.user_phone_number,
              user_professional_title: this.userData.user_professional_title == null ? '' : this.userData.user_professional_title,
              user_bio: this.userData.user_bio == null ? '' : this.userData.user_bio,
              user_address: this.userData.user_address == null ? '' : this.userData.user_address,
              user_image: this.userData.user_image == null ? '' : this.userData.user_image,
              user_email: this.userData.user_email,
              user_instagram: this.userData.user_instagram == null ? '' : this.userData.user_instagram,
              user_experience: this.userData.user_experience == null ? '' : this.userData.user_experience,
              user_expected_salary: this.userData.user_expected_salary == null ? '' : this.userData.user_expected_salary,
            });
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

  onUpdateAccountInfo() {
    this.hitSubmit = true;
    if (this.accountForm.invalid) { return }
    this.updateAccountInfo();
  }

  updateAccountInfo() {
    this.spinner.show();
    let payload = this.accountForm.value;
    if (this.base64textString.length != 0) {
      payload.user_image = this.base64textString.split(",")[1];
    }
    if (this.base64textString.length == 0) {
      payload.user_image = '';
    }
    this.candidateService.updateProfile(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.statusCode == 200) {
            Swal.fire({
              title: 'Success!',
              text: 'Updated Successfully',
              icon: 'success',
            });
            this.profileUpdated = true;
            this.getProfileDetails();
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

  numericOnly(event): boolean {
    let patt = /^([0-9.$])$/;
    let result = patt.test(event.key);
    return result;
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
      // this.s3profilePicUpload(compressedFile);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onload = () => {
        this.base64textString = reader.result;
      };
    });
  }

  transform() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.base64textString);
  }


}
