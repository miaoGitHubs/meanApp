import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService} from '../../auth/auth.service';
import {AuthData} from '../../auth/auth-data.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    posts: Post[] = [];
    userId: string;
    private postsSub: Subscription;
    private authStatusSub: Subscription;
    userIsAuthenticated = false;
    isLoading = false;
    totalPosts = 0;
    postPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10];

    constructor(private postService: PostsService, private authService: AuthService) {
    }

    ngOnInit(): void {
      this.isLoading = true;
      this.buildPostList();
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.userId = this.authService.getUserId();
      this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
        isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
            this.userId = this.authService.getUserId();
            console.log('user id : ' + this.userId);
        });
    }

    buildPostList() {
      this.postService.getPosts(this.postPerPage, this.currentPage);

      this.postsSub = this.postService.getPostUpdatedListener()
        .subscribe((postData: {posts: Post[], postCount: number}) => {
          this.isLoading = false;
          this.totalPosts = postData.postCount;

          postData.posts.forEach( post => {
            this.authService.getUserById(post['creator']).subscribe( user => {
              post['username'] = user['email'];
            });
          });
          this.posts = postData.posts;

        });
    }

    onChangedPage(pageData: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postPerPage = pageData.pageSize;
        this.postService.getPosts(this.postPerPage, this.currentPage);
    }

    onDelete(postId: string) {
      this.postService.deletePost(postId).subscribe(() => {
        this.postService.getPosts(this.postPerPage, this.currentPage);
      }, () => {
        this.isLoading = false;
      });
    }

    ngOnDestroy(): void {
      this.postsSub.unsubscribe();
      this.authStatusSub.unsubscribe();
    }

}
