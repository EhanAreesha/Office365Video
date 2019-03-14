import { NgModule } from '@angular/core';
import { CoursePlayService } from '../course-play/course-play.service';
import { CourseComponent } from './course.component';

@NgModule({
  imports: [
  ],
  declarations: [CourseComponent],
  providers: [CoursePlayService]
})
export class CourseModule {
}