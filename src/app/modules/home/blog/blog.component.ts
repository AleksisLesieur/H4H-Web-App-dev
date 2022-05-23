import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../../../services';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  public blog_list: any = [];
  public popular_list: any = [];
  public offset: number = 0;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.homeService.setTitle('Blog');
    this.loadPopularBlogList();
  }

  loadPopularBlogList() {
    this.spinner.show();
    let payload = {
      offset: this.offset,
    };

    this.homeService.getPopularBlogList(payload)
      .subscribe(
        (response) => {
          // this.spinner.hide();
          if (response.statusCode == 200) {
            this.popular_list = response.body;
            this.loadBlogList();
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

  loadBlogList() {
    this.spinner.show();
    let payload = {
      offset: this.offset,
    };

    this.homeService.getBlogList(payload)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.statusCode == 200) {
            if (this.offset > 0) {
              response.body.forEach(element => {
                this.blog_list.push(element)
              });
            } else {
              this.blog_list = response.body;
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
    this.loadBlogList();
  }

  onBlogDetails(blog) {
    this.router.navigate(['blog/details', { 'id': btoa(blog.id_blog) }])
  }

}
