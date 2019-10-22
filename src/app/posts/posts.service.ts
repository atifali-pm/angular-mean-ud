import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();


  constructor(private http: HttpClient, private router: Router) {
  }

  getPosts() {
    return this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData => {
            return postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id
              };
            });
          })
        ))
      .subscribe(transformedPost => {
        this.posts = transformedPost;
        this.postsUpdated.next([ ...this.posts ]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string }>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title, content };
    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post).subscribe((postData) => {
      const postId = postData.postId;
      post.id = postId;
      this.posts.push(post);
      console.log(this.posts);
      this.router.navigate(['/']);
      this.postsUpdated.next([ ...this.posts ]);
    });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id, title, content };
    this.http.put('http://localhost:3000/api/posts/' + id, post)
      .subscribe(response => {
        console.log(response);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        console.log('Deleted!');
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([ ...this.posts ]);
      });
  }
}
