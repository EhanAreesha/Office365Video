import { Injectable } from '@angular/core';
import { CourseData, Material, Status } from 'src/app/utils/coursedata';
import { CoursePlayService } from '../course-play.service';
import { STATUS } from 'src/app/utils/constant';
import { SelectorFlags } from '@angular/compiler/src/core';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class OfficeService {

  public YT: any;
  videoId: string;
  interval: any;
  player: any;
  courseData: CourseData;
  iofficeService: IOfficeService;
  iofficePlayTracking: IOfficePlayTracking;

  constructor(private _dataService: CoursePlayService) {
    this.courseData = this._dataService.courseData
    this.iofficePlayTracking = { isVideoFinished: false, isVideoProgess: false, updateTrackAfter: 15 }
    this.iofficeService = { currentTitle: "", currentTime: 0, totalTime: 0, isMuted: false, isPlaying: false, isDragging: false }
  }

  public appSetup(material: Material) {

    this.iofficePlayTracking = { isVideoFinished: false, isVideoProgess: false, updateTrackAfter: 15 }
    this.iofficeService = { currentTitle: "", currentTime: 0, totalTime: 0, isMuted: false, isPlaying: false, isDragging: false }

    var myVideo = document.getElementById("player");
    myVideo.innerHTML = material.embedScript;

    this.iofficeService.currentTitle = material.title;
    this.iofficeService.videoId = material.embedScript;
    this.iofficeService.materialId = material.materialId;
    this.iofficeService.durationInSeconds = 0;
    this.iofficeService.isPlaying = true;

    var self = this;
    var seconds = 1;
    let totalVideoDuration = self.getSecondsfromString(material.duration);
    this.interval = setInterval(() => {
      seconds++;
      self.iofficeService.durationInSeconds = seconds;
      let minuteSeconds = self.getMinuteSecondsfromSeconds(seconds);
      if (minuteSeconds != "") {
        let totalPlaySeconds = self.getSecondsfromString(minuteSeconds);
        if (totalPlaySeconds >= totalVideoDuration) {
          clearInterval(this.interval);
          self.updateJSON();
        }
      }
    }, 1000)


  }

  updateJSON() {
    this.courseData.chapters.forEach(element => {
      element.materials.forEach(materialElement => {
        if (this.iofficeService.materialId == materialElement.materialId) {
          if (materialElement.type == 'Office') {
            materialElement[STATUS] = Status.Completed;
            var videoDuration = this.getTimeFromString(materialElement.duration);
            this.iofficeService.durationInSeconds += videoDuration - this.iofficeService.durationInSeconds;
            materialElement.playedTime = this.getMinuteSecondsfromSeconds(this.iofficeService.durationInSeconds);
            console.log(materialElement.playedTime);
            console.log('Video Completed Watching:' + JSON.stringify(materialElement));
            this.iofficeService.chapterId = element.chapterId;
          }
        }
      });
    });
    this.changeFinisheVideoMenu();
    this.updatedPlayedTimeInRunning();
  }

  // Time Second to String Formatter
  getMinuteSecondsfromSeconds(time: number) {
    this.iofficeService.minutes = Math.floor(time / 60);
    this.iofficeService.seconds = time - this.iofficeService.minutes * 60;
    return this.iofficeService.minutes + "m" + " " + Math.floor(this.iofficeService.seconds) + "s";
  }

  // Time String to Second Formatter
  getSecondsfromString(time: string) {
    let secArr = time.split(" ");
    let minTotal = parseInt(secArr[0].slice(0, -1)) * 60;
    let secTotal = parseInt(secArr[1].slice(0, -1));
    return minTotal + secTotal;
  }

  updatedPlayedTimeInRunning() {
    $("#durationId").text(this.getMinuteSecondsfromSeconds(this.getTotalPlayedTime()) + " of " + this.courseData.duration);
  }

  // Calculate total chapters video played time in seconds
  getTotalPlayedTime() {
    this.iofficeService.totalPlayedInSeconds = 0;
    this.courseData.chapters.forEach(element => {
      element.materials.forEach(element => {
        if (element.playedTime != "") {
          this.iofficeService.totalPlayedInSeconds += this.getTimeFromString(element.playedTime);
        }
      });
    });
    return this.iofficeService.totalPlayedInSeconds;
  }

  getTimeFromString(time: string) {
    this.iofficeService.timeArray = time.split(" ");
    this.iofficeService.minutes = parseInt(this.iofficeService.timeArray[0].slice(0, -1)) * 60;
    this.iofficeService.seconds = parseInt(this.iofficeService.timeArray[1].slice(0, -1));
    return this.iofficeService.minutes + this.iofficeService.seconds;
  }

  changeFinisheVideoMenu() {
    $("#" + this.iofficeService.materialId).attr("src", "../../../assets/images/completed.png");
  }
}
