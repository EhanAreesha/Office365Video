import { Injectable } from '@angular/core';
import { CourseData, Material, Status } from 'src/app/utils/coursedata';
import { CoursePlayService } from '../course-play.service';
import { STATUS } from 'src/app/utils/constant';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  ivideoService: IVideoService;
  playTracking: IVideoPlayTracking;
  courseData: CourseData;

  constructor(private _dataService: CoursePlayService) {
    this.courseData = this._dataService.courseData
    this.playTracking = { isVideoFinished: false, isVideoProgess: false, updateTrackAfter: 15 }
    this.ivideoService = { currentPath: "", currentTitle: "", currentTime: 0, totalTime: 0, isMuted: false, isPlaying: false, isDragging: false }
  }

  // Start video
  public appSetup(material: Material) {
    this.playTracking = { isVideoFinished: false, isVideoProgess: false, updateTrackAfter: 15 }
    this.ivideoService = { currentPath: "", currentTitle: "", currentTime: 0, totalTime: 0, isMuted: false, isPlaying: false, isDragging: false }

    this.ivideoService.videoElement = <HTMLVideoElement>document.getElementById("videoDisplay");
    this.ivideoService.videoElement.addEventListener("loadedmetadata", this.updateData);
    this.ivideoService.videoElement.addEventListener("timeupdate", this.updateTime);
    this.ivideoService.currentTitle = material.title;
    this.ivideoService.currentPath = material.link;
    this.ivideoService.materialId = material.materialId;
    this.ivideoService.durationInSeconds = 0;
    window.setInterval(this.timerFired, 500);
  }

  // Video Duration
  updateData = (e: any) => {
    this.ivideoService.totalTime = this.ivideoService.videoElement.duration;
  }

  // Current Time
  updateTime = (e: any) => {
    this.ivideoService.currentTime = this.ivideoService.videoElement.currentTime;

    // Video Progess > 15 sec    
    if (this.ivideoService.currentTime >= this.playTracking.updateTrackAfter) {
      this.playTracking.updateTrackAfter = this.playTracking.updateTrackAfter + 15;
      this.playTracking.isVideoProgess = true;
      this.updateJSON();
    } else {
      this.playTracking.isVideoProgess = false;
    }

    // Is Video Finished Watching
    if (this.ivideoService.isPlaying && this.ivideoService.currentTime == this.ivideoService.totalTime) {
      this.playTracking.isVideoFinished = true;
      this.updateJSON();
    } else {
      this.playTracking.isVideoFinished = false;
    }
  }

  // Time Second to String Formatter
  getMinuteSecondsfromSeconds(time: number) {
    this.ivideoService.minutes = Math.floor(time / 60);
    this.ivideoService.seconds = time - this.ivideoService.minutes * 60;
    return this.ivideoService.minutes + "m" + " " + Math.floor(this.ivideoService.seconds) + "s";
  }

  // Time String to Second Formatter
  getSecondsfromString(time: string) {
    let secArr = time.split(".");
    let minTotal = parseInt(secArr[0].slice(0, -1)) * 60;
    let secTotal = parseInt(secArr[1].slice(0, -1));
    return minTotal + secTotal;
  }

  updateJSON() {
    if (this.playTracking.isVideoProgess) {
      this.courseData.chapters.forEach(element => {
        element.materials.forEach(materialElement => {
          if (this.ivideoService.materialId == materialElement.materialId) {
            if(materialElement.type == 'Video') {
              materialElement[STATUS] = Status.InProgress;
              this.ivideoService.durationInSeconds += 15;
              materialElement.playedTime = this.getMinuteSecondsfromSeconds(this.ivideoService.durationInSeconds);
              console.log(materialElement.playedTime);
              console.log('Video saved after 15 sec:' + JSON.stringify(materialElement));
            }
          }
        });
      });
    }
    if (this.playTracking.isVideoFinished) {
      this.courseData.chapters.forEach(element => {
        element.materials.forEach(materialElement => {
          if (this.ivideoService.materialId == materialElement.materialId) {
            if(materialElement.type == 'Video') {
              materialElement[STATUS] = Status.Completed;
              var videoDuration = this.getTimeFromString(materialElement.duration);
              this.ivideoService.durationInSeconds += videoDuration - this.ivideoService.durationInSeconds;
              materialElement.playedTime = this.getMinuteSecondsfromSeconds(this.ivideoService.durationInSeconds);
              console.log(materialElement.playedTime);
              console.log('Video Completed Watching:' + JSON.stringify(materialElement));
              this.ivideoService.chapterId = element.chapterId;
            }
          }
        });
      });
      this.changeFinisheVideoMenu();
      this.nextVideoPlay();
    }
    this.updatedPlayedTimeInRunning();
  }

  nextVideoPlay() {
    this.ivideoService.isLoopTrue = false;
    this.courseData.chapters.forEach(element => {
      element.materials.forEach(materialElement => {
        if (element.chapterId == this.ivideoService.chapterId) {
          element['show'] = true;
          if (this.ivideoService.materialId == materialElement.materialId) {
            this.ivideoService.isLoopTrue = true;
          } else {
            if (this.ivideoService.isLoopTrue) {
              this.ivideoService.isLoopTrue = false;
              $("#" + materialElement.materialId).attr("src", "../../../assets/images/inprogress.png");
              this.appSetup(materialElement);
              setTimeout(() => {
                this.playVideo();
              }, 1500);
            }
          }
        }
      });
    });
  }

  updatedPlayedTimeInRunning() {
    $("#durationId").text(this.getMinuteSecondsfromSeconds(this.getTotalPlayedTime()) + " of " + this.courseData.duration);
  }

  // Calculate total chapters video played time in seconds
  getTotalPlayedTime() {
    this.ivideoService.totalPlayedInSeconds = 0;
    this.courseData = this._dataService.courseData
    this.courseData.chapters.forEach(element => {
      element.materials.forEach(element => {
        if (element.playedTime != "") {
          this.ivideoService.totalPlayedInSeconds += this.getTimeFromString(element.playedTime);
        }
      });
    });
    return this.ivideoService.totalPlayedInSeconds;
  }

  getTimeFromString(time: string) {
    this.ivideoService.timeArray = time.split(" ");
    this.ivideoService.minutes = parseInt(this.ivideoService.timeArray[0].slice(0, -1)) * 60;
    this.ivideoService.seconds = parseInt(this.ivideoService.timeArray[1].slice(0, -1));
    return this.ivideoService.minutes + this.ivideoService.seconds;
  }

  changeFinisheVideoMenu() {
    $("#" + this.ivideoService.materialId).attr("src", "../../../assets/images/completed.png");
  }

  timerFired = () => {
    if (!this.ivideoService.isDragging) {
      this.ivideoService.calculatedScrubY = this.ivideoService.videoElement.offsetHeight;
      this.ivideoService.calculatedWidth = (this.ivideoService.videoElement.currentTime / this.ivideoService.videoElement.duration
        * this.ivideoService.videoElement.offsetWidth);
    }
  }

  muteVideo() {
    if (this.ivideoService.videoElement.volume == 0) {
      this.ivideoService.videoElement.volume = 1;
      this.ivideoService.isMuted = false;
    } else {
      this.ivideoService.videoElement.volume = 0;
      this.ivideoService.isMuted = true;
    }
  }


  // Video play Toggle
  public playVideo() {
    if (this.ivideoService.videoElement.paused) {
      this.ivideoService.videoElement.play();
      this.ivideoService.isPlaying = true;
    } else {
      this.ivideoService.videoElement.pause();
      this.ivideoService.isPlaying = false;
    }
  }

  // Video play at certain point after dragging
  seekVideo(e: any) {
    let w = document.getElementById('progressMeterFull').offsetWidth;
    let d = this.ivideoService.videoElement.duration;
    let s = Math.round(e.pageX / w * d);
    this.ivideoService.videoElement.currentTime = s;
  }

  dragStart = function (e: any) {
    this.isDragging = true;
  };

  dragMove = function (e: any) {
    if (this.isDragging) {
      this.calculatedWidth = e.x;
    }
  };

  dragStop = function (e: any) {
    if (this.isDragging) {
      this.isDragging = false;
      this.seekVideo(e);
    }
  };

  fullScreen() {
    if (this.ivideoService.videoElement.requestFullscreen) {
      this.ivideoService.videoElement.requestFullscreen();
    } else if (this.ivideoService.videoElement.mozRequestFullScreen) {
      this.ivideoService.videoElement.mozRequestFullScreen();
    } else if (this.ivideoService.videoElement.webkitRequestFullScreen) {
      this.ivideoService.videoElement.webkitRequestFullScreen();
    } else if (this.ivideoService.videoElement.msRequestFullScreen) {
      this.ivideoService.videoElement.msRequestFullScreen();
    }
  }
}
