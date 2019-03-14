import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoursePlayComponent } from './course-play/course-play.component';
import { CourseComponent } from './course/course.component';
import { YoutubeComponent } from './course-play/youtube/youtube.component';
import { Office365Component } from './course-play/office365/office365.component';

const routes: Routes = [
  { path: '', redirectTo: 'course', pathMatch: 'full'},
  { path: 'course', component: CourseComponent},
  { path: 'course/play/:courseGUID', component: CoursePlayComponent },
  { path: 'course/play/:courseGUID/:resumeAtLevel/:resumeGUID', component: CoursePlayComponent },
  { path: 'youtube', component: YoutubeComponent},
  { path: 'office365', component: Office365Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
