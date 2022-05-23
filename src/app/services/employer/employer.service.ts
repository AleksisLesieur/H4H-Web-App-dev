import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployerService {

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

  profileDetails(payload): Observable<any> {
    return this.apiservice.post('recruiter-profile-details', payload);
  }
  updateProfile(payload): Observable<any> {
    return this.apiservice.post('recruiter-profile-edit', payload);
  }
  getCategoryList(payload): Observable<any> {
    return this.apiservice.post('category-list', payload);
  }
  getStatusCount(payload): Observable<any> {
    return this.apiservice.post('application-status-count-for-recruiter', payload);
  }
  getStatusList(payload): Observable<any> {
    return this.apiservice.post('job-apply-status-list', payload);
  }
  getAcceptedStatusList(payload): Observable<any> {
    return this.apiservice.post('job-apply-status-accepted-list', payload);
  }
  getDeclinedStatusList(payload): Observable<any> {
    return this.apiservice.post('job-apply-status-declined-list', payload);
  }
  getReviewedStatusList(payload): Observable<any> {
    return this.apiservice.post('job-apply-status-reviewed-list', payload);
  }

  applicationAccept(payload): Observable<any> {
    return this.apiservice.post('job-apply-accepted', payload);
  }
  applicationDecline(payload): Observable<any> {
    return this.apiservice.post('job-apply-declined', payload);
  }
  applicationReview(payload): Observable<any> {
    return this.apiservice.post('job-apply-reviewed', payload);
  }
  checkSubscription(payload): Observable<any> {
    return this.apiservice.post('subscription-check', payload);
  }

  getJobList(payload): Observable<any> {
    return this.apiservice.post('job-list-by-recruiter', payload);
  }
  getJobDetails(payload): Observable<any> {
    return this.apiservice.post('job-post-details', payload);
  }
  getusersJobDetails(payload): Observable<any> {
    return this.apiservice.post('job-post-details-by-user', payload);
  }
  postJob(payload): Observable<any> {
    return this.apiservice.post('job-post', payload);
  }
  editJob(payload): Observable<any> {
    return this.apiservice.post('job-post-edit', payload);
  }
  deleteJob(payload): Observable<any> {
    return this.apiservice.post('job-delete', payload);
  }

  submitPayment(payload): Observable<any> {
    return this.apiservice.post('stripe-payment', payload);
  }
  cancelPreviousSubscriptions(payload): Observable<any> {
    return this.apiservice.post('subscription_cancelling', payload);
  }
}
