import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {NgbModal } from '@ng-bootstrap/ng-bootstrap';

const imgPool = [
  'http://res.cloudinary.com/miaocloud/image/upload/v1509318387/pic01_vfkyim.jpg',
  'http://res.cloudinary.com/miaocloud/image/upload/v1509318393/pic06_rnzrl2.jpg',
  'http://res.cloudinary.com/miaocloud/image/upload/v1509318399/pic10_rkb4x8.jpg',
  'http://res.cloudinary.com/miaocloud/image/upload/v1509318347/pic02_afbi1r.jpg'
];

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
    private mode = 'create';
    private postId: string;
    private userId: string;
    private authStatusSub: Subscription;
    post: Post;
    form: FormGroup;
    imagePreview: string;
    isLoading = false;
    selctedImage: null;
    myImagePool: any[];
    imageWarning: boolean;

    constructor(private postService: PostsService, public route: ActivatedRoute,
                private authService: AuthService, private modelService: NgbModal) {}

    ngOnInit() {
      this.imageWarning = false;
      this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
        authStatus => {
          this.isLoading = false;
        });
      this.userId = this.authService.getUserId();

      this.initFormGroup();
      this.myImagePool = imgPool;
      this.route.paramMap.subscribe( (paramMap: ParamMap) => {
        if (paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          this.isLoading = true;
          this.postService.getPost(this.postId).subscribe(postData => {
            this.isLoading = false;
            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content,
              imagePath: postData.imagePath,
              creator: postData.creator
            };
            this.form.setValue({
              'title': this.post.title,
              'content': this.post.content,
              'image': this.post.imagePath,
              'creator': postData.creator
            });
          });
        } else {
          this.mode = 'create';
          this.postId = null;
        }
      });
    }

    initFormGroup() {
      this.form = new FormGroup({
        title: new FormControl(null, {
          validators: [Validators.required, Validators.minLength(3)]
        }),
        content: new FormControl(null, {validators: [Validators.required]}),
        image: new FormControl(null, {validators: [Validators.required]}),
        creator: new FormControl()
      });
    }

    openSelectingDialog(content: string) {
        this.modelService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
    }

    onImagePicked(event: any) {
      this.selctedImage = event.target.src;
      this.form.get('image').setValue(this.selctedImage);
    }

    removeSelected() {
      this.selctedImage = null;
      this.form.get('image').setValue(null);
      this.modelService.dismissAll();
    }

    selectedStyle(src: string) {
      if (this.selctedImage === src) {
        return {'border': '2px solid blue', 'border-radius': '5px'};
      } else {
        return {};
      }
    }

    onSavePost() {
        if (this.form.invalid) {
          if (!this.form.get('image').valid) {
            this.imageWarning = true;
          }
          return;
        } else {
          this.imageWarning = false;
        }

        this.isLoading = true;
        if (this.mode === 'create') {
          this.postService.addPost(
            this.form.value.title,
            this.form.value.content,
            this.form.value.image
          );
        } else {
          this.postService.updatePost(
            this.postId,
            this.form.value.title,
            this.form.value.content,
            this.form.value.image
          );
        }
        this.form.reset();
    }

    ngOnDestroy() {
      this.authStatusSub.unsubscribe();
    }
}
