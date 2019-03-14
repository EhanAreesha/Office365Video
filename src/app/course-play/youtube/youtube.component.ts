import { Component, OnInit } from '@angular/core';
import { YoutubeService } from './youtube.service';
import { CoursePlayService } from '../course-play.service';
import { CourseData, Chapter, Status, Material } from 'src/app/utils/coursedata';
import { STATUS } from 'src/app/utils/constant';

declare var $: any;

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.scss'],
  providers: [CoursePlayService]
})
export class YoutubeComponent implements OnInit {

  public YT: any;
  videoId: string;
  courseData: CourseData;
  chapterData: Chapter[];
  icoursePlayComponent: ICoursePlayComponent;

  constructor(public _youtubeService: YoutubeService, private _dataService: CoursePlayService) {
  }

 ngOnInit() {
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    this.initVideo()
    this.videoId = this.icoursePlayComponent.videoId; //video id
    window['onYouTubeIframeAPIReady'] = () => {
      this.YT = window['YT'];
      this._youtubeService.player = new window['YT'].Player('player', {
        height: '600',
        width: '100%',
        videoId: this.videoId,
        events: {
          'onStateChange': this.onPlayerStateChange.bind(this),
          'onReady': this.onPlayerReady.bind(this),
          'onPlayerError': this.onPlayerError.bind(this)
        }
      });
    };
  }

  
  initVideo() {
        this.courseData = this._dataService.courseData;
        this.icoursePlayComponent = { chapterId: ""};
        this.chapterData = this.courseData["chapters"];
        $("#durationId").text(this._youtubeService.getMinuteSecondsfromSeconds(this._youtubeService.getTotalPlayedTime()) + " of " + this.courseData.duration);
        this.chapterData.forEach(element => {
            if (this.courseData.resumeCourseAtLevel == 'chapter') {
                if (this.courseData.resumeCourseAtGUID == element.chapterId) {
                    element['show'] = true;
                    console.log("Show the material of chapter " + element.title);
                } else {
                    element['show'] = false;
                }
            } else if (this.courseData.resumeCourseAtLevel == 'material') {
                var bool = false;
                element.materials.forEach(materialElement => {
                    if (this.courseData.resumeCourseAtGUID == materialElement.materialId) {
                        if(materialElement.type == 'Youtube') {
                          this._youtubeService.appSetup(materialElement);
                          this.icoursePlayComponent.chapterId = element.chapterId;
                          this.icoursePlayComponent.videoId = materialElement.embedScript;
                          this.icoursePlayComponent.prevMaterialId = materialElement.materialId;
                          bool = true;
                        }
                    }
                });
                if (bool) {
                    element['show'] = true;
                } else {
                    element['show'] = false;
                }
                console.log("Show the material of chapter " + element.title);
            } else {
                if(element.sequenceNo == '1') {
                    element['show'] = true;
                    element.materials.forEach(materialElement => {
                      if(materialElement.type == 'Youtube') {
                        if (materialElement.sequenceNo == '1') {
                            this._youtubeService.appSetup(materialElement);
                            this.icoursePlayComponent.chapterId = element.chapterId;
                            this.icoursePlayComponent.videoId = materialElement.embedScript;
                            this.icoursePlayComponent.prevMaterialId = materialElement.materialId;
                        }
                      }
                    });
                } else {
                    element['show'] = false;
                }
            }
        });
  }
  onPlayerReady(e) {
    e.target.playVideo();
    this._youtubeService.videoGetPrepare();
  }

  onPlayerStateChange(e) {
    let duration = e.target.getDuration();
    let currentTimeRounded = Math.round(e.target.getCurrentTime());
    let currentTime = e.target.getCurrentTime();
    switch (e.data) {
      case window['YT'].PlayerState.PLAYING:
        if (currentTimeRounded == 0) {
          console.log('started ' + currentTime);
        } else {
          console.log('playing ' + currentTime)
          this._youtubeService.updateTime()
        };
        break;
      case window['YT'].PlayerState.PAUSED:
        if (duration - currentTime != 0) {
          console.log('paused' + ' @ ' + currentTime);
        };
        break;
      case window['YT'].PlayerState.ENDED:
        console.log('ENDED' + ' @ ' + currentTime);
        this._youtubeService.updateTime()
        break;
      case window['YT'].PlayerState.BUFFERING:
        console.log('BUFFERING ' + currentTime)
        break;
      case window['YT'].PlayerState.CUED:
        console.log('CUED ' + currentTime)
        break;
    };
  };

  ngAfterViewInit() {
    $("#" + this.icoursePlayComponent.chapterId).attr("src", "../../../assets/images/down.png");
    this.updateMaterialIcon();
   }

/**
* 
* The method hide the quiz content 
* The method is called when click on video material 
* @author  ...
* @version 1.0
* @since   01-02-2019
*/
private playVideo(material: Material) {
    this.previousVideoIconSet();
    this.videoId = material.embedScript;
    setTimeout(() => {
        this._youtubeService.playVideo(material.embedScript);
        if (this.icoursePlayComponent.prevMaterialId == material.materialId) {
            if(material.type == 'Youtube') {
                if (this._youtubeService.iyoutubeService.isPlaying) {
                    $("#" + material.materialId).attr("src", "../../../assets/images/pause.png");
                } else {
                    $("#" + material.materialId).attr("src", "../../../assets/images/inprogress.png");
                }
            } else {
                if (this._youtubeService.iyoutubeService.isPlaying) {
                    $("#" + material.materialId).attr("src", "../../../assets/images/inprogress.png");
                } else {
                    $("#" + material.materialId).attr("src", "../../../assets/images/pause.png");
                }
            }
        }
    }, 500)
    this.icoursePlayComponent.prevMaterialId = material.materialId;

    console.log("Last updated coursedata: ");
    console.log(this._dataService.courseData);

    this.courseData.resumeCourseAtLevel = "material";
    this.courseData.resumeCourseAtGUID = material.materialId;

    console.log("You last playing video id  : " + material.materialId);
    console.log("Recent updated coursedata: ");
    console.log(this.courseData = this._dataService.courseData);
}

previousVideoIconSet() {
    this.courseData = this._dataService.courseData
    this.courseData.chapters.forEach(element => {
        element.materials.forEach(melement => {
            if (melement.materialId == this.icoursePlayComponent.prevMaterialId) {
                if(melement.type == 'Youtube') {
                    if (this._youtubeService.iyoutubeService.isPlaying) {
                        if (melement[STATUS] == Status.Completed) {
                            $("#" + this.icoursePlayComponent.prevMaterialId).attr("src", "../../../assets/images/completed.png");
                        } else {
                            $("#" + this.icoursePlayComponent.prevMaterialId).attr("src", "../../../assets/images/inprogress.png");
                        }
                    }
                }
            }
        });
    });
}
/**
* The navbar right menu 
* simply displays and hide the child material and quiz.
* @author  ...
* @version 1.0
* @since   01-02-2019
*/
isOpen(title, status) {
    this.chapterData.forEach(element => {
        if (element.title == title) {
            if (this.courseData.resumeCourseAtLevel != "material") {                  
                this.courseData = this._dataService.courseData
                this.courseData.resumeCourseAtLevel = "chapter";
                this.courseData.resumeCourseAtGUID = element.chapterId;
                this.courseData = this._dataService.courseData
                console.log("Recent updated coursedata: ");
                console.log(this._dataService.courseData);
            }
            if (status) {
                $("#" + element.chapterId).attr("src", "../../../assets/images/straight.png");
                element['show'] = false;
            } else {
                $("#" + element.chapterId).attr("src", "../../../assets/images/down.png");
                element['show'] = true;
            }
        } else {
            $("#" + element.chapterId).attr("src", "../../../assets/images/straight.png");
            element['show'] = false;
        }
    });
    setTimeout(() => {
        this.updateMaterialIcon()
    }, 100);
}

updateMaterialIcon() {
    this.courseData = this._dataService.courseData
    this.courseData.chapters.forEach(element => {
        element.materials.forEach(melement => {
            if(melement.type == 'Youtube') {
                if (melement[STATUS] == Status.Completed) {
                    $("#" + melement.materialId).attr("src", "../../../assets/images/completed.png");
                } else if (melement[STATUS] == Status.InProgress) {
                    $("#" + melement.materialId).attr("src", "../../../assets/images/inprogress.png");
                } else {
                    $("#" + melement.materialId).attr("src", "../../../assets/images/video.png");
                }
                if(melement.materialId == this.icoursePlayComponent.prevMaterialId) {
                    if (melement[STATUS] == Status.NotStarted) {
                        $("#" + melement.materialId).attr("src", "../../../assets/images/inprogress.png");
                    }
                }
            }
        });
    }); 
}

  //utility
  onPlayerError(event) {
    switch (event.data) {
      case 2:
        console.log('' + this.videoId)
        break;
      case 100:
        break;
      case 101 || 150:
        break;
    };
  };


}
