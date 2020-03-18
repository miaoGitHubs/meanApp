import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRountingModule} from './app-routing.module';
import { AuthInterceptor} from './auth/auth-interceptor';
import { ErrorInterceptor} from './error-interceptor';
import { ErrorComponent} from './error/error.component';
import { AngularMaterialModule} from './angular-material.module';
import { PostsModule} from './posts/posts.module';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import * as  Cloudinary from 'cloudinary-core';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRountingModule,
    AngularMaterialModule,
    CloudinaryModule.forRoot(Cloudinary, { cloud_name: 'miaocloud'}),
    PostsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
    ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
