import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(
    private apiservice: ApiService,
  ) { }

  goOnTop() {
    // let scrollToTop = window.setInterval(() => {
    //   let pos = window.pageYOffset;
    //   if (pos > 0) {
    //     window.scrollTo(0, pos - 20); // how far to scroll on each step
    //   } else {
    //     window.clearInterval(scrollToTop);
    //   }
    // }, 16);
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  imageUpload(payload): Observable<any> {
    return this.apiservice.post('single_image_upload', payload);
  }
  profileDetails(payload): Observable<any> {
    return this.apiservice.post('candidate-profile-details', payload);
  }
  getResumeList(payload): Observable<any> {
    return this.apiservice.post('resume-list-by-candidate', payload);
  }
  getCategoryList(payload): Observable<any> {
    return this.apiservice.post('category-list', payload);
  }
  getApplicationStatusList(payload): Observable<any> {
    return this.apiservice.post('candidate-applied-job-list', payload);
  }
  getApplicationAcceptedList(payload): Observable<any> {
    return this.apiservice.post('candidate-applied-job-accepted-list', payload);
  }
  getApplicationDeclineList(payload): Observable<any> {
    return this.apiservice.post('candidate-applied-job-list', payload);
  }
  getApplicationReviewList(payload): Observable<any> {
    return this.apiservice.post('candidate-applied-job-reviewed-list', payload);
  }

  getApplicationPendingList(payload): Observable<any> {
    return this.apiservice.post('candidate-applied-job-pending-list', payload);
  }

  getApplicationDeclinedList(payload): Observable<any> {
    return this.apiservice.post('candidate-applied-job-declined-list', payload);
  }

  getJobDetails(payload): Observable<any> {
    return this.apiservice.post('job-post-details', payload);
  }

  getStatusCount(payload): Observable<any> {
    return this.apiservice.post('application-status-count-for-candidate', payload);
  }

  getStateList(payload): Observable<any> {
    return this.apiservice.post('states-territories-list', payload);
  }
  getSchoolList(payload): Observable<any> {
    return this.apiservice.post('school-by-state-territories', payload);
  }
  updateProfile(payload): Observable<any> {
    return this.apiservice.post('candidate-profile-edit', payload);
  }
  saveContactInfo(payload): Observable<any> {
    return this.apiservice.post('resume-step-insert-post', payload);
  }
  updateContactInfo(payload): Observable<any> {
    return this.apiservice.post('resume-step-insert-edit', payload);
  }
  savePersonalInfo(payload): Observable<any> {
    return this.apiservice.post('resume-personal-info-update', payload);
  }
  saveEducationalInfo(payload): Observable<any> {
    return this.apiservice.post('resume-education-info-update', payload);
  }
  saveWorkInfo(payload): Observable<any> {
    return this.apiservice.post('resume-work-exp-info-update', payload);
  }
  saveSkillsInfo(payload): Observable<any> {
    return this.apiservice.post('resume-skils-info-update', payload);
  }
  deleteResume(payload): Observable<any> {
    return this.apiservice.post('resume-delete', payload);
  }
  duplicateResume(payload): Observable<any> {
    return this.apiservice.post('resume-duplicate', payload);
  }
  makeAsDefault(payload): Observable<any> {
    return this.apiservice.post('default-resume', payload);
  }
  getResumeDetails(payload): Observable<any> {
    return this.apiservice.post('resume-details', payload);
  }
  getUsersResumeDetails(payload): Observable<any> {
    return this.apiservice.post('resume-details-by-user', payload);
  }
}
