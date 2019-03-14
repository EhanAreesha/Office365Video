import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursePlayComponent } from './course-play.component';
import { YoutubeComponent } from './youtube/youtube.component';
import { ToolbarComponent } from './video/toolbar/toolbar.component';
import { ProgessComponent } from './video/progess/progess.component';
import { VideoComponent } from './video/video.component';
import { QuizComponent } from './quiz/quiz.component';
import { NumTwoCharPipe } from '../utils/numTochar.pipe';
import { TimedisplayPipe } from '../utils/timedisplay.pipe';

import { CoursePlayService, DataServiceConfig } from './course-play.service';
import { VideoService } from './video/video.service';
import { YoutubeService } from './youtube/youtube.service';
import { QuizService } from './quiz/quiz.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Office365Component } from './office365/office365.component';


@NgModule({
  declarations: [    
    TimedisplayPipe,
    NumTwoCharPipe,
    QuizComponent,
    VideoComponent,
    ProgessComponent,
    ToolbarComponent,
    YoutubeComponent,
    CoursePlayComponent,
    Office365Component
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  
  providers:[
    CoursePlayService,
    VideoService,
    YoutubeService,
    QuizService
  ]

})
export class CoursePlayModule { 

  constructor(@Optional() @SkipSelf() parentModule: CoursePlayModule) {
    if (parentModule) {
      throw new Error(
        'CoursePlayModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(config: DataServiceConfig): ModuleWithProviders {
    console.log("Called Course Module RooT")
    return {
      ngModule: CoursePlayModule,
      providers: [{ provide: DataServiceConfig, useValue: config }]
    };
  }
}
