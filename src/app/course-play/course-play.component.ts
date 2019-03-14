import { Component } from '@angular/core';
import { CourseData, Chapter, Material, Status } from 'src/app/utils/coursedata';
import { STATUS } from 'src/app/utils/constant';
import { CoursePlayService } from './course-play.service';
import { VideoService } from './video/video.service';
import { QuizService } from './quiz/quiz.service';
declare var $: any;

@Component({
    selector: 'course-play',
    templateUrl: './course-play.component.html',
    styleUrls: ['./course-play.component.scss'],
    providers: [CoursePlayService]
})
export class CoursePlayComponent {

    courseData: CourseData;
    chapterData: Chapter[];
    icoursePlayComponent: ICoursePlayComponent;

    constructor(private _dataService: CoursePlayService, private _videoService: VideoService, private _quizService: QuizService) {
    }

    ngOnInit() {
        this.courseData = this._dataService.courseData;
        this.icoursePlayComponent = { isActivePart: false };
        this.chapterData = this.courseData["chapters"];
        $("#durationId").text(this._videoService.getMinuteSecondsfromSeconds(this._videoService.getTotalPlayedTime()) + " of " + this.courseData.duration);

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
                        if(materialElement.type == 'Video') {
                            this.playVideo(materialElement);
                            this.icoursePlayComponent.chapterId = element.chapterId;
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
                        if(materialElement.type == 'Video') {
                            if (materialElement.sequenceNo == '1') {
                                this.playVideo(materialElement);
                                this.icoursePlayComponent.chapterId = element.chapterId;
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

    /**
    * The method hide the video content 
    * And also display the requested final course quiz by click on final quiz menu
    * @author  ...
    * @version 1.0
    * @since   19-01-2019
    */
    setFinalQuiz() {
        this.icoursePlayComponent.isActivePart = true;
        if (this._videoService.ivideoService.isPlaying) {
            this._videoService.playVideo();
        }
        this._quizService.finalQuizSetup(this.courseData.Quiz);
    }

    /**
    * The method hide the video content 
    * And also display the requested quiz by click on quiz menu
    * @author  ...
    * @version 1.0
    * @since   19-01-2019
    */
    setQuiz(chapterId: string, ) {
        debugger;
        this.previousQuizIconSet();
        this.icoursePlayComponent.isActivePart = true;
        console.log("Last updated coursedata: ");
        console.log(this._dataService.courseData);

        this._quizService.quizSetup(chapterId);
        this.courseData.resumeCourseAtLevel = "material";
        this.courseData.resumeCourseAtGUID = chapterId;

        console.log("You last attended chapter id  : " + chapterId);
        console.log("Recent updated coursedata: ");
        console.log(this.courseData = this._dataService.courseData);
    }

    previousQuizIconSet() {
        this.courseData = this._dataService.courseData
        this.courseData.chapters.forEach(element => {
            element.materials.forEach(melement => {
                if (melement.materialId == this.icoursePlayComponent.prevMaterialId) {

                    if (melement[STATUS] == Status.Completed) {
                        $("#" + this.icoursePlayComponent.prevMaterialId).attr("src", "../../../assets/images/completed.png");
                    } else {
                        $("#" + this.icoursePlayComponent.prevMaterialId).attr("src", "../../../assets/images/inprogress.png");
                    }
                }
            });
        });

        if (this._videoService.ivideoService.isPlaying) {
            this._videoService.playVideo();
        }
    }

    /**
    * 
    * The method hide the quiz content 
    * The method is called when click on video material 
    * @author  ...
    * @version 1.0
    * @since   19-01-2019
    */
    private playVideo(material: Material) {
        this.previousVideoIconSet();
        this.icoursePlayComponent.isActivePart = false;
        this._videoService.ivideoService.currentPath = material.link;
        this._videoService.appSetup(material);
        setTimeout(() => {
            this._videoService.playVideo();
            if (this.icoursePlayComponent.prevMaterialId == material.materialId) {
                if (this._videoService.ivideoService.isPlaying) {
                    $("#" + material.materialId).attr("src", "../../../assets/images/pause.png");
                } else {
                    $("#" + material.materialId).attr("src", "../../../assets/images/inprogress.png");
                }
            } else {
                if (this._videoService.ivideoService.isPlaying) {
                    $("#" + material.materialId).attr("src", "../../../assets/images/inprogress.png");
                } else {
                    $("#" + material.materialId).attr("src", "../../../assets/images/pause.png");
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
                    if (this._videoService.ivideoService.isPlaying) {
                        if (melement[STATUS] == Status.Completed) {
                            $("#" + this.icoursePlayComponent.prevMaterialId).attr("src", "../../../assets/images/completed.png");
                        } else {
                            $("#" + this.icoursePlayComponent.prevMaterialId).attr("src", "../../../assets/images/inprogress.png");
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
    * @since   19-01-2019
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
                if (melement[STATUS] == Status.Completed) {
                    $("#" + melement.materialId).attr("src", "../../../assets/images/completed.png");
                } else if (melement[STATUS] == Status.InProgress) {
                    $("#" + melement.materialId).attr("src", "../../../assets/images/inprogress.png");
                } else {
                    $("#" + melement.materialId).attr("src", "../../../assets/images/video.png");
                }
            });
            if (element.Quiz[STATUS] == Status.Completed) {
                $("#" + element.Quiz.quizid).attr("src", "../../../assets/images/completed.png");
            } else if (element.Quiz[STATUS] == Status.InProgress) {
                $("#" + element.Quiz.quizid).attr("src", "../../../assets/images/inprogress.png");
            } else {
                $("#" + element.Quiz.quizid).attr("src", "../../../assets/images/circle.png");
            }
        });
        if (this.courseData.Quiz[STATUS] == Status.Completed) {
            $("#finalQId").attr("src", "../../../assets/images/completed.png");
        } else if (this.courseData.Quiz[STATUS] == Status.InProgress) {
            $("#finalQId").attr("src", "../../../assets/images/inprogress.png");
        }
    }

}