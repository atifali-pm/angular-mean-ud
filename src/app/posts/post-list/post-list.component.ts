import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: [ './post-list.component.css' ]
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'first post', content: 'this is the new post'},
  //   {title: 'first post', content: 'this is the new post'},
  //   {title: 'first post', content: 'this is the new post'}
  // ];
  private isAuthenticated = false;
  posts: Post[] = [];
  private postsSub: Subscription;
  private authSub: Subscription;
  isLoading = false;

  constructor(public postsService: PostsService, private authService: AuthService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
    this.authSub = this.authService.getAuthStatus().subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
    this.isAuthenticated = this.authService.getIsAuth();
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}
