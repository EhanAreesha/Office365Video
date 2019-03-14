import { Component, OnInit } from '@angular/core';
import { VideoService } from './video.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  constructor(public videoService: VideoService) { }

  ngOnInit() {
  }

}
