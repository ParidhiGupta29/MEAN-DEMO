import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'

const Backend_Url = environment.apiUrl + '/posts/'

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, posts: any, maxPosts: number }>(Backend_Url + queryParams)
      .pipe(map((postData) => {
        return {
          post: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            }
          }),
          maxPosts: postData.maxPosts,
        }
      })
      )
      .subscribe((transformedData) => {
        console.log(transformedData);
        this.posts = transformedData.post;
        this.postsUpdated.next({ posts: [...this.posts], postCount: transformedData.maxPosts });
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData
    if (typeof (image) == 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    // const post:Post = { id:id, title: title, content: content, imagePath:null}; 
    this.http.put(Backend_Url + `${id}`, postData)
      .subscribe(response => {
        // const updatedPost = [...this.posts]
        // const oldPostIndex = updatedPost.findIndex(p => p.id === id);
        // const post:Post={
        //   id:id,
        //   title:title,
        //   content: content,
        //   imagePath: null
        // };        
        // updatedPost[oldPostIndex] = post;
        // this.posts = updatedPost;
        // this.postsUpdated.next({posts:[...this.posts]});
        this.router.navigate(["/"]);
      })
  }

  deletePost(postId: string) {
    return this.http.delete(Backend_Url + postId)
    // .subscribe(() => {
    //   const updatePosts = this.posts.filter(post => post.id !== postId);
    //   this.posts = updatePosts;
    //   this.postsUpdated.next([...this.posts])
    // })
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string, title: string,
      content: string, imagePath: string, creator: string
    }>
      (Backend_Url + id);
    // {...this.posts.find(p=>p.id= id)};
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image);

    // const post: Post = { id: null, title: title, content: content };
    this.http.post<{ message: string, post: Post }>(Backend_Url, postData)
      .subscribe((respnseData) => {
        console.log(respnseData);
        // const post: Post = { id: respnseData.post.id, title: respnseData.post.title, content: respnseData.post.content, imagePath: respnseData.post.imagePath }
        // // const postId = respnseData.postId
        // // post.id = postId;
        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }
}