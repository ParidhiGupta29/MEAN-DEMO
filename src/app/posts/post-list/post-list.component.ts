import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {


  posts: Post[] = [];
  private PostSub: Subscription;
  private authStatusSubs :Subscription
  isLoading = false;
  totalPost = 10;
  postPerPage = 2;
  currentPage=1
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated= false;
  userId:string;

  constructor(private postsService: PostService, private authService:AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postPerPage,this.currentPage);
    this.userId= this.authService.getUserId();
    this.PostSub = this.postsService.getPostUpdateListener()
      .subscribe((postData:{posts: Post[], postCount:number}) => {
        this.isLoading = false;
        this.totalPost= postData.postCount;
        this.posts = postData.posts;
      });
      this.userIsAuthenticated= this.authService.getIsAuth();
    this.authStatusSubs=this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated=>{
      this.userIsAuthenticated= isAuthenticated;
      this.userId= this.authService.getUserId();
    });
  }

  onDelete(postId: string) {
    this.isLoading=true;
    this.postsService.deletePost(postId)
    .subscribe(()=>{
      this.postsService.getPosts(this.postPerPage, this.currentPage);
    },()=>{
      this.isLoading=false;
    })

  }

  onChangePage(pageData: PageEvent) {
    this.isLoading= true;
    this.currentPage= pageData.pageIndex+1;
    this.postPerPage= pageData.pageSize;
    this.postsService.getPosts(this.postPerPage,this.currentPage)
  }

  ngOnDestroy() {
    this.PostSub.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }

}
