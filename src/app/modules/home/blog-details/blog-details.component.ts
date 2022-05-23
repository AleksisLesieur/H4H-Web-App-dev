import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeService } from '../../../services';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit {
  public blogData: any = {};

  constructor(
    private router: Router,
    private homeService: HomeService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.homeService.setTitle('Blog Details');
    this.loadData();
  }

  loadData() {
    this.spinner.show();
    let payload = {
      id_blog: atob(this.activatedRoute.snapshot.params['id'])
    };

    this.homeService.getBlogData(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response);
          if (response.statusCode == 200) {
            this.blogData = response.body;
            this.incrementReadCount();
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

  incrementReadCount() {
    // this.spinner.show();
    let payload = {
      id_blog: atob(this.activatedRoute.snapshot.params['id'])
    };

    this.homeService.readCount(payload)
      .subscribe(
        (response) => {
          // this.spinner.hide();
          console.log(response);
          // if (response.statusCode == 200) {
          //   this.blogData = response.body;
          // }
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
    this.router.navigate(['blog'])
  }

}
