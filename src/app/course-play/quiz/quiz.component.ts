import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuizService } from './quiz.service';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {


  form = new FormGroup({
    qanswer: new FormControl(),
  });
  constructor(public quizService: QuizService) { }

  ngOnInit() {

  }


}
