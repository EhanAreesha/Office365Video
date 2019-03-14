import { Component, OnInit } from '@angular/core';
import { CourseData, Chapter, Material, Status } from 'src/app/utils/coursedata';
import { OfficeService } from './office.service';
import { CoursePlayService } from '../course-play.service';
import { STATUS } from 'src/app/utils/constant';

declare var $: any;

@Component({
    selector: 'app-office365',
    templateUrl: './office365.component.html',
    styleUrls: ['./office365.component.scss']
})
export class Office365Component implements OnInit {
   
    courseData: CourseData;
    chapterData: Chapter[];
    icoursePlayComponent: ICoursePlayComponent;

    constructor(public _officeService: OfficeService, private _dataService: CoursePlayService) {
    }

    ngOnInit() {
        this.initVideo()
    }

    initVideo() {
        this.courseData = this._dataService.courseData;
        this.icoursePlayComponent = { chapterId: "" };
        this.chapterData = this.courseData["chapters"];

        $("#durationId").text(this._officeService.getMinuteSecondsfromSeconds(this._officeService.getTotalPlayedTime()) + " of " + this.courseData.duration);

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
                        if (materialElement.type == 'Office') {                           
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
                if (element.sequenceNo == '1') {
                    element['show'] = true;
                    element.materials.forEach(materialElement => {
                        if (materialElement.type == 'Office') {
                            if (materialElement.sequenceNo == '1') {
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


    ngAfterViewInit() {
        $("#" + this.icoursePlayComponent.chapterId).attr("src", "../../../assets/images/down.png");
        this.updateMaterialIcon();
    }


    private playVideo(material: Material) {
        this.previousVideoIconSet();
        setTimeout(() => {
            this._officeService.appSetup(material);
            if (this.icoursePlayComponent.prevMaterialId == material.materialId) {
                if (material.type == 'Office') {
                    if (this._officeService.iofficeService.isPlaying) {
                        $("#" + material.materialId).attr("src", "../../../assets/images/pause.png");
                    } else {
                        $("#" + material.materialId).attr("src", "../../../assets/images/inprogress.png");
                    }
                } else {
                    if (this._officeService.iofficeService.isPlaying) {
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
                    if (melement.type == 'Office') {
                        if (this._officeService.iofficeService.isPlaying) {
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
                if (melement.type == 'Office') {
                    if (melement[STATUS] == Status.Completed) {
                        $("#" + melement.materialId).attr("src", "../../../assets/images/completed.png");
                    } else if (melement[STATUS] == Status.InProgress) {
                        $("#" + melement.materialId).attr("src", "../../../assets/images/inprogress.png");
                    } else {
                        $("#" + melement.materialId).attr("src", "../../../assets/images/video.png");
                    }
                }
            });
        });
    }

}
