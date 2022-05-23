import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private apiservice: ApiService,
    private titleService: Title
  ) { }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  getResumeList(payload): Observable<any> {
    return this.apiservice.post('resume-search', payload);
  }
  getusersJobDetails(payload): Observable<any> {
    return this.apiservice.post('job-post-details-by-user', payload);
  }
  getJobList(payload): Observable<any> {
    return this.apiservice.post('job-search', payload);
  }
  jobApply(payload): Observable<any> {
    return this.apiservice.post('job-apply', payload);
  }
  inviteCandidate(payload): Observable<any> {
    return this.apiservice.post('invite-candidate', payload);
  }
  getCategoryList(payload): Observable<any> {
    return this.apiservice.post('category-list', payload);
  }
  getBlogList(payload): Observable<any> {
    return this.apiservice.post('blog-list-front', payload);
  }
  getMyPackagesList(payload): Observable<any> {
    return this.apiservice.post('recruiter-subscription-list', payload);
  }
  modifySubscription(payload): Observable<any> {
    return this.apiservice.post('subscription_modify', payload);
  }
  getPackagesList(payload): Observable<any> {
    return this.apiservice.post('package-list', payload);
  }
  checkSubscription(payload): Observable<any> {
    return this.apiservice.post('subscription-check', payload);
  }
  getPopularBlogList(payload): Observable<any> {
    return this.apiservice.post('blog-popular-front', payload);
  }
  getBlogData(payload): Observable<any> {
    return this.apiservice.post('blog-details', payload);
  }
  readCount(payload): Observable<any> {
    return this.apiservice.post('blog-read-count', payload);
  }
  getJobDetails(payload): Observable<any> {
    return this.apiservice.post('job-post-details', payload);
  }
  getResumeDetails(payload): Observable<any> {
    return this.apiservice.post('resume-details', payload);
  }
  getCandidateNotifications(payload): Observable<any> {
    return this.apiservice.post('notify-candidate', payload);
  }
  getRecruterNotifications(payload): Observable<any> {
    return this.apiservice.post('notify-recruiter', payload);
  }
  switchAccount(payload): Observable<any> {
    return this.apiservice.post('profile-switch', payload);
  }
  formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    } else {
      return phoneNumberString;
    }
  }

  convertDate(date) {
    var strDateTime = date;
    strDateTime = new Date(strDateTime.replace(/-/g, "/"));
    var myDate = new Date(Date.UTC(strDateTime.getFullYear(), strDateTime.getMonth(), strDateTime.getDate(), strDateTime.getHours(), strDateTime.getMinutes(), strDateTime.getSeconds()));
    return myDate
  }

  convertModifiedDate(date) {
    var strDateTime = date.replace(/-/g, "/");
    return strDateTime
  }
}
