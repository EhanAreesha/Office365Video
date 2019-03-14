import { Injectable, Optional } from '@angular/core';
import { CourseData } from '../utils/coursedata';

declare var $: any;

export class DataServiceConfig {
  courseData: CourseData;
}

@Injectable({
  providedIn: 'root'
})
export class CoursePlayService {

  private _courseData: CourseData

  constructor(@Optional() config: DataServiceConfig) {
    console.log("Course Play Service called")
    if (config) {
      this._courseData = config.courseData;
    }
  }

  get courseData(): CourseData {
    return this._courseData;
  }

}

