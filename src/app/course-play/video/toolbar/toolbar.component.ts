import { Component, OnInit } from '@angular/core';
import { VideoService } from '../video.service';


@Component({
  selector: 'video-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']

})
export class ToolbarComponent implements OnInit {

  constructor(public videoService: VideoService) { }

  ngOnInit() {
  }

}
