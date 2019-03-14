import { Component, OnInit } from '@angular/core';
import { VideoService } from '../video.service';

@Component({
  selector: 'video-progess',
  templateUrl: './progess.component.html',
  styleUrls: ['./progess.component.scss']
})
export class ProgessComponent implements OnInit {

  constructor(public videoService: VideoService) { }

  ngOnInit() {
  }

}
