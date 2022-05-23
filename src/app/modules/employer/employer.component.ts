import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services';

@Component({
  selector: 'app-employer',
  templateUrl: './employer.component.html',
  styleUrls: ['./employer.component.scss']
})
export class EmployerComponent implements OnInit {

  constructor(private homeService: HomeService,) { }

  ngOnInit(): void {
    this.homeService.setTitle('Employer Account');
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
