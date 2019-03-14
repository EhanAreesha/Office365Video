import { Injectable } from '@angular/core';
import { CourseData, Material, Status } from 'src/app/utils/coursedata';
import { CoursePlayService } from '../course-play.service';
import { STATUS } from 'src/app/utils/constant';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  public YT: any;
  videoId: string;
  interval: any;
  player: any;
  courseData: CourseData;
  iyoutubeService: IYoutubeService;
  iyoutubePlayTracking: IYoutubePlayTracking;

  constructor(private _dataService: CoursePlayService) {
    this.courseData = this._dataService.courseData
    this.iyoutubePlayTracking = { isVideoFinished: false, isVideoProgess: false, updateTrackAfter: 15 }
    this.iyoutubeService = { currentTitle: "", currentTime: 0, totalTime: 0, isMuted: false, isPlaying: false, isDragging: false }
  }

  public appSetup(material: Material) {
    this.iyoutubePlayTracking = { isVideoFinished: false, isVideoProgess: false, updateTrackAfter: 15 }
    this.iyoutubeService = { currentTitle: "", currentTime: 0, totalTime: 0, isMuted: false, isPlaying: false, isDragging: false }

    this.iyoutubeService.currentTitle = material.title;
    this.iyoutubeService.videoId = material.embedScript;
    this.iyoutubeService.materialId = material.materialId;
    this.iyoutubeService.durationInSeconds = 0;
  }

  playVideo(videoId: string) {
    this.player.loadVideoById(videoId);
    this.videoGetPrepare()
  }

  loadNextVideo() {
    this.iyoutubeService.isLoopTrue = false;
    this.courseData.chapters.forEach(element => {
      element.materials.forEach(materialElement => {
        if (element.chapterId == this.iyoutubeService.chapterId) {
          element['show'] = true;
          if (this.iyoutubeService.materialId == materialElement.materialId) {
            if (materialElement.type == 'Youtube') {
              this.iyoutubeService.isLoopTrue = true;
            }
          } else {
            if (this.iyoutubeService.isLoopTrue) {
              this.iyoutubeService.isLoopTrue = false;
              $("#" + materialElement.materialId).attr("src", "../../../assets/images/inprogress.png");
              this.appSetup(materialElement);
              setTimeout(() => {
                this.playVideo(materialElement.embedScript);
              }, 1500);
            }
          }
        }
      });
    });
  }

  videoGetPrepare() {
    var self = this;
    this.iyoutubePlayTracking.updateTrackAfter = 15;
    this.iyoutubeService.isPlaying = true;
    this.interval = setInterval(function () {
      self.updateTime();
    }, 15000)
  }
  // Video Duration
  updateData() {
    this.iyoutubeService.totalTime = Math.ceil(this.player.getDuration());
  }

  // Current Time
  updateTime() {
    if (((this.player.getDuration() - 1) - this.iyoutubePlayTracking.updateTrackAfter) <= 15) {
      clearInterval(this.interval);
    }
    this.iyoutubeService.currentTime = Math.ceil(this.player.getCurrentTime());
    // Video Progess > 15 sec    
    if (this.iyoutubeService.currentTime >= this.iyoutubePlayTracking.updateTrackAfter) {
      this.iyoutubePlayTracking.updateTrackAfter = this.iyoutubePlayTracking.updateTrackAfter + 15;
      this.iyoutubePlayTracking.isVideoProgess = true;
      this.updateJSON();
    } else {
      this.iyoutubePlayTracking.isVideoProgess = false;
    }

    if (this.iyoutubeService.totalTime == undefined || this.iyoutubeService.totalTime == 0) {
      this.updateData();
    }
    // Is Video Finished Watching
    if (this.iyoutubeService.isPlaying && this.iyoutubeService.currentTime == this.iyoutubeService.totalTime) {
      this.iyoutubePlayTracking.isVideoFinished = true;
      this.updateJSON();
    } else {
      this.iyoutubePlayTracking.isVideoFinished = false;
    }

  }

  updateJSON() {
    if (this.iyoutubePlayTracking.isVideoProgess) {
      this.courseData.chapters.forEach(element => {
        element.materials.forEach(materialElement => {
          if (this.iyoutubeService.materialId == materialElement.materialId) {
            if (materialElement.type == 'Youtube') {
              materialElement[STATUS] = Status.InProgress;
              this.iyoutubeService.durationInSeconds += 15;
              materialElement.playedTime = this.getMinuteSecondsfromSeconds(this.iyoutubeService.durationInSeconds);
              console.log(materialElement.playedTime);
              console.log('Video saved after 15 sec:' + JSON.stringify(materialElement));
            }
          }
        });
      });
    }
    if (this.iyoutubePlayTracking.isVideoFinished) {
      this.courseData.chapters.forEach(element => {
        element.materials.forEach(materialElement => {
          if (this.iyoutubeService.materialId == materialElement.materialId) {
            if (materialElement.type == 'Youtube') {
              materialElement[STATUS] = Status.Completed;
              var videoDuration = this.getTimeFromString(materialElement.duration);
              this.iyoutubeService.durationInSeconds += videoDuration - this.iyoutubeService.durationInSeconds;
              materialElement.playedTime = this.getMinuteSecondsfromSeconds(this.iyoutubeService.durationInSeconds);
              console.log(materialElement.playedTime);
              console.log('Video Completed Watching:' + JSON.stringify(materialElement));
              this.iyoutubeService.chapterId = element.chapterId;
            }
          }
        });
      });
      this.changeFinisheVideoMenu();
      this.loadNextVideo();
    }
    this.updatedPlayedTimeInRunning();
  }


  // Time Second to String Formatter
  getMinuteSecondsfromSeconds(time: number) {
    this.iyoutubeService.minutes = Math.floor(time / 60);
    this.iyoutubeService.seconds = time - this.iyoutubeService.minutes * 60;
    return this.iyoutubeService.minutes + "m" + " " + Math.floor(this.iyoutubeService.seconds) + "s";
  }

  // Time String to Second Formatter
  getSecondsfromString(time: string) {
    let secArr = time.split(".");
    let minTotal = parseInt(secArr[0].slice(0, -1)) * 60;
    let secTotal = parseInt(secArr[1].slice(0, -1));
    return minTotal + secTotal;
  }
  updatedPlayedTimeInRunning() {
    $("#durationId").text(this.getMinuteSecondsfromSeconds(this.getTotalPlayedTime()) + " of " + this.courseData.duration);
  }

  // Calculate total chapters video played time in seconds
  getTotalPlayedTime() {
    this.iyoutubeService.totalPlayedInSeconds = 0;
    this.courseData.chapters.forEach(element => {
      element.materials.forEach(element => {
        if (element.playedTime != "") {
          this.iyoutubeService.totalPlayedInSeconds += this.getTimeFromString(element.playedTime);
        }
      });
    });
    return this.iyoutubeService.totalPlayedInSeconds;
  }

  getTimeFromString(time: string) {
    this.iyoutubeService.timeArray = time.split(" ");
    this.iyoutubeService.minutes = parseInt(this.iyoutubeService.timeArray[0].slice(0, -1)) * 60;
    this.iyoutubeService.seconds = parseInt(this.iyoutubeService.timeArray[1].slice(0, -1));
    return this.iyoutubeService.minutes + this.iyoutubeService.seconds;
  }

  changeFinisheVideoMenu() {
    $("#" + this.iyoutubeService.materialId).attr("src", "../../../assets/images/completed.png");
  }
}
