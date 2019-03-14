import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CourseData } from './utils/coursedata';
import { CourseJSON as data } from '../assets/data/data';
import { CourseModule } from './course/course.module';
import { CoursePlayModule } from './course-play/course-play.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,  
    AppRoutingModule,
    CourseModule,
    CoursePlayModule.forRoot({ courseData: <CourseData>JSON.parse(JSON.stringify(data)) })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }

}
