import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { CourseData } from '../utils/coursedata';
import { CoursePlayService } from '../course-play/course-play.service';


@Component({
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.scss']
})
export class CourseComponent {

    courseData: CourseData;
    isTrue: boolean = true;

    constructor(private router: Router, private _dataService: CoursePlayService) {
        this.courseData = this._dataService.courseData;
        console.log(this.courseData)
    }

    startCourse() {
        console.log("Start Course!")
        this.router.navigate(["course/play", this.courseData.courseId]);
    }
    resumeCourse() {
        console.log("Resume Course!")
        if (this.courseData.resumeCourseAtLevel == "" || this.courseData.resumeCourseAtGUID == "") {
            this.router.navigate(["course/play", this.courseData.courseId]);
        } else {
            this.router.navigate(["course/play", this.courseData.courseId, this.courseData.resumeCourseAtLevel, this.courseData.resumeCourseAtGUID]);
        }
    }
    playCourseAtChpater() {
        console.log("Play Course at Chapter: " + this.courseData.resumeCourseAtLevel)
        this.router.navigate(["course/play", this.courseData.courseId, this.courseData.resumeCourseAtLevel, this.courseData.resumeCourseAtGUID]);
    }
    youtubeCourse() {
        console.log("Youtube course play!")
        this.router.navigate(["youtube"]);
    }
    officeCourse() {
        console.log("Office course play!")
        this.router.navigate(["office365"]);
    }
}