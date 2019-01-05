import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommentCreateComponent } from './comments/comment-create/comment-create.component';
import { CommentListComponent } from './comments/comment-list/comment-list.component';
import { VideoListComponent } from './videos/video-list/video-list.component';
import { VideoAnalyticsComponent } from './videos/video-analytics/video-analytics.component';
import { VideoIframeComponent } from './videos/video-iframe/video-iframe.component';
import { VideoThumbnailsComponent } from './videos/video-thumbnails/video-thumbnails.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './auth/login/login.component';
 

@NgModule({
  declarations: [
    AppComponent,
    CommentCreateComponent,
    CommentListComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent,
    VideoAnalyticsComponent,
    VideoListComponent,
    VideoIframeComponent,
    VideoThumbnailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [
   
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
