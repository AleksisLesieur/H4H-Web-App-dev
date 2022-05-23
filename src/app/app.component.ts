import { Component, OnInit } from '@angular/core';
import { SharedService } from './services';
import { LocalStorageService } from 'ngx-localstorage';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'HairForHire';
  constructor(
    private localStorage: LocalStorageService,
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    Auth.currentSession()
      .then(data => {

        if (this.localStorage.get('user_type') == null) {
          this.sharedService.changeMessage('0');
        } else {
          this.sharedService.changeMessage(this.localStorage.get('user_type'));
        }
      })
      .catch(err => console.log(err));

  }
  onActivate(event) {
    // let scrollToTop = window.setInterval(() => {
    //     let pos = window.pageYOffset;
    //     if (pos > 0) {
    //         window.scrollTo(0, pos - 20); // how far to scroll on each step
    //     } else {
    //         window.clearInterval(scrollToTop);
    //     }
    // }, 16);
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

}
