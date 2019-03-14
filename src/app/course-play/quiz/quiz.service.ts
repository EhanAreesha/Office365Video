import { Injectable } from '@angular/core';
import { CourseData, Quiz, Option, Chapter, Material, Question, Status } from 'src/app/utils/coursedata';
import { CoursePlayService } from '../course-play.service';
import { STATUS } from 'src/app/utils/constant';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  iquizService: IQuizService;
  courseData: CourseData;
  quizData: Quiz;
  optionsArray: Option[];
  questions: Question[];

  constructor(private _dataService: CoursePlayService) {
    this.courseData = this._dataService.courseData
    this.iquizService = {
      isLoopTrue: false,
      imageBase64: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
      isFinalQuiz: false
    }
  }

  /**
  * quizSetup: current selected question, optins and image display 
  * @author  ...
  * @version 1.0
  * @since   19-01-2019
  */
  quizSetup(chapterId: string) {
    debugger;
    this.iquizService.isFinalQuiz = false;
    this.iquizService.isAnswered = false;
    this.iquizService.enableButton = false;
    this.iquizService.chapterId = chapterId;
    this.courseData.chapters.forEach(chapterElement => {
      if (chapterElement.chapterId == chapterId) {
        this.quizData = chapterElement.Quiz;
        this.questions = this.quizData.questions;
        this.iquizService.noOfQuestions = this.questions.length;
        if (this.quizData[STATUS] != Status.Completed) {
          this.questions.forEach(qElement => {
            if (!this.iquizService.isLoopTrue) {
              if (qElement[STATUS] != Status.Completed) {
                this.optionsArray = qElement.options;
                this.iquizService.currentTitle = qElement.title;
                this.iquizService.imageBase64 = qElement.imageBase64;
                this.iquizService.questionSequenceNo = qElement.sequenceNo;
                this.iquizService.isLoopTrue = true;
                console.log("Your selected question id : " + qElement.sequenceNo);
                console.log("Please Answered");
              } else {
                console.log("Your question sequence no : " + qElement.sequenceNo);
                console.log("Already Answered");
              }
            }
          });
          if (!this.iquizService.isLoopTrue) {
            console.log("Already you have answered all question!");
            alert("Already you have answered all question! If you want to attend again. Refresh your browser!");
          } else {
            this.setOptions();
          }
        }
      }
    });
    this.iquizService.isLoopTrue = false;
  }

  /**
    * quizSetup: current selected question, optins and image display 
    *
    * @author  ...
    * @version 1.0
    * @since   19-01-2019
    */
  finalQuizSetup(quizData: Quiz) {
    debugger;
    this.iquizService.isFinalQuiz = true;
    this.iquizService.isAnswered = false;
    this.iquizService.enableButton = false;
    this.iquizService.noOfQuestions = quizData.questions.length;
    if (quizData['Status'] != 'Completed') {
      quizData.questions.forEach(qElement => {
        if (!this.iquizService.isLoopTrue) {
          if (qElement['Status'] != 'Completed') {
            this.optionsArray = qElement.options;
            this.iquizService.currentTitle = qElement.title;
            this.iquizService.imageBase64 = qElement.imageBase64;
            this.iquizService.questionSequenceNo = qElement.sequenceNo;
            this.iquizService.isLoopTrue = true;
            console.log("Your selected question id : " + qElement.sequenceNo);
            console.log("Please Answered");
          } else {
            console.log("Your question sequence no : " + qElement.sequenceNo);
            console.log("Already Answered");
          }
        }
      });
      if (!this.iquizService.isLoopTrue) {
        console.log("Already you have answered all question!");
        alert("Already you have answered all question! If you want to attend again. Refresh your browser!");
      } else {
        this.setOptions();
        this.quizData = quizData;
      }
    }
    this.iquizService.isLoopTrue = false;
  }
  /**
  * submitAnswer: submit answer and getting result 
  *
  * @author  ...
  * @version 1.0
  * @since   19-01-2019
  */

  submitAnswer() {
    debugger;
    console.log("Submit Answer!")
    if (this.iquizService.isFinalQuiz) {
      this.submitFinalQuiz();
    } else {
      this.submitChapterQuiz()
    }
  }

  submitFinalQuiz() {
    debugger;
    this.iquizService.isFinalQuiz = true;
    this.questions = this.quizData.questions;
    this.iquizService.noOfQuestions = this.questions.length;
    this.iquizService.quizStatus = this.quizData[STATUS];
    if (this.iquizService.quizStatus != Status.Completed) {
      this.questions.forEach(qElement => {
        if (!this.iquizService.isLoopTrue) {
          if (qElement[STATUS] != Status.Completed) {
            if (parseInt(this.iquizService.questionSequenceNo) == this.iquizService.noOfQuestions) {
              qElement[STATUS] = Status.Completed
              this.quizData[STATUS] = Status.Completed;
            } if (parseInt(this.iquizService.questionSequenceNo) < this.iquizService.noOfQuestions) {
              qElement[STATUS] = Status.InProgress;
              this.quizData[STATUS] = Status.InProgress;
            }
            if (this.iquizService.questionSequenceNo == qElement.sequenceNo) {
              if (this.iquizService.selectedValue == qElement.rightAnswer) {
                this.iquizService.answerStatus = "Correct!"
                qElement.questionPassed = "Completed";
                console.log("User Answer is: Correct")
                console.log("Answer Completed")
              } else {
                this.iquizService.answerStatus = "Wrong!"
                qElement.questionPassed = "Failed";
                console.log("User Answer is: Wrong!")
                console.log("Answer Completed")
              }
              this.iquizService.rightAnswer = qElement.rightAnswer;
              console.log("Right Answer is: " + qElement.rightAnswer)
              this.iquizService.isAnswered = true;
              this.iquizService.enableButton = false;
              qElement.userAnswer = this.iquizService.selectedValue;
              qElement[STATUS] = Status.Completed;
              this.iquizService.isLoopTrue = true;


            }
          }
        }
      });
    }
    this.courseData.Quiz = this.quizData;
    if (parseInt(this.iquizService.questionSequenceNo) == this.iquizService.noOfQuestions) {
      $("#finalQId").attr("src", "../../../assets/images/completed.png");
    }

    this.iquizService.isLoopTrue = false;
  }

  submitChapterQuiz() {
    debugger;
    this.iquizService.isFinalQuiz = false;
    this.courseData.chapters.forEach(chapterElement => {
      if (chapterElement.chapterId == this.iquizService.chapterId) {
        this.quizData = chapterElement.Quiz;
        this.questions = this.quizData.questions;
        this.iquizService.noOfQuestions = this.questions.length;
        this.iquizService.quizStatus = this.quizData[STATUS];
        var bool = false;
        if (this.iquizService.quizStatus != Status.Completed) {
          this.questions.forEach(qElement => {
            if (!bool) {
              if (qElement[STATUS] != Status.Completed) {
                if (parseInt(this.iquizService.questionSequenceNo) == this.iquizService.noOfQuestions) {
                  qElement[STATUS] = Status.Completed
                  this.quizData[STATUS] = Status.Completed;
                  chapterElement[STATUS] = Status.Completed;
                } if (parseInt(this.iquizService.questionSequenceNo) < this.iquizService.noOfQuestions) {
                  qElement[STATUS] = 'In Progress'
                  this.quizData[STATUS] = 'In Progress';
                  chapterElement[STATUS] = 'In Progress';
                }
                if (this.iquizService.questionSequenceNo == qElement.sequenceNo) {
                  if (this.iquizService.selectedValue == qElement.rightAnswer) {
                    this.iquizService.answerStatus = "Correct!"
                    qElement.questionPassed = Status.Completed;
                    console.log("User Answer is: Correct")
                    console.log("Answer Completed")
                  } else {
                    this.iquizService.answerStatus = "Wrong!"
                    qElement.questionPassed = "Failed";
                    console.log("User Answer is: Wrong!")
                    console.log("Answer Completed")
                  }
                  this.iquizService.rightAnswer = qElement.rightAnswer;
                  console.log("Right Answer is: " + qElement.rightAnswer)
                  this.iquizService.isAnswered = true;
                  this.iquizService.enableButton = false;
                  qElement.userAnswer = this.iquizService.selectedValue;
                  qElement[STATUS] = Status.Completed;
                  bool = true;
                }
              }
            }
          });
        }
      }

      if (parseInt(this.iquizService.questionSequenceNo) == this.iquizService.noOfQuestions) {
        $("#" + this.quizData.quizid).attr("src", "../../../assets/images/completed.png");
      }
    });

    this.iquizService.isLoopTrue = false;
  }
  /**
    * nextQuizSetup: next quiz displayed if available 
    * @author  ...
    * @version 1.0
    * @since   19-01-2019
    */
  nextQuizSetup() {
    debugger;
    this.iquizService.isAnswered = false;
    this.iquizService.questionSequenceNo = (parseInt(this.iquizService.questionSequenceNo) + 1).toString();
    if (this.iquizService.isFinalQuiz) {
      this.finalQuiz();
    } else {
      this.chapterQuiz();
    }
    this.setOptions();
    this.iquizService.isLoopTrue = false;
  }

  finalQuiz() {
    debugger;
    this.iquizService.isFinalQuiz = true;
    this.questions = this.quizData.questions;
    this.iquizService.noOfQuestions = this.questions.length;
    this.iquizService.quizStatus = this.quizData[STATUS];
    if (this.iquizService.quizStatus != Status.Completed) {
      this.questions.forEach(qElement => {
        if (!this.iquizService.isLoopTrue) {
          if (qElement[STATUS] != Status.Completed) {
            if (this.iquizService.questionSequenceNo == qElement.sequenceNo) {
              this.optionsArray = qElement.options;
              this.iquizService.currentTitle = qElement.title;
              this.iquizService.imageBase64 = qElement.imageBase64;
              this.iquizService.questionSequenceNo = qElement.sequenceNo;
              this.iquizService.isLoopTrue = true;
            }
          }
        }
      });
    }
  }

  chapterQuiz() {
    debugger;
    this.iquizService.isFinalQuiz = false;
    this.courseData.chapters.forEach(chapterElement => {
      if (chapterElement.chapterId == this.iquizService.chapterId) {
        this.quizData = chapterElement.Quiz;
        this.questions = this.quizData.questions;
        this.iquizService.noOfQuestions = this.questions.length;
        this.iquizService.quizStatus = this.quizData[STATUS];
        if (this.iquizService.quizStatus != Status.Completed) {
          this.questions.forEach(qElement => {
            if (!this.iquizService.isLoopTrue) {
              if (qElement[STATUS] != Status.Completed) {
                if (this.iquizService.questionSequenceNo == qElement.sequenceNo) {
                  this.optionsArray = qElement.options;
                  this.iquizService.currentTitle = qElement.title;
                  this.iquizService.imageBase64 = qElement.imageBase64;
                  this.iquizService.questionSequenceNo = qElement.sequenceNo;
                  this.iquizService.isLoopTrue = true;
                }
              }
            }
          });
        }
      }
    });
  }

  setOptions() {
    this.iquizService.options = [];
    debugger;
    for (var enumMember in this.optionsArray) {
      if (enumMember == '0') {
        this.iquizService.options.push(this.optionsArray[enumMember].a)
      }
      if (enumMember == '1') {
        this.iquizService.options.push(this.optionsArray[enumMember].b)
      }
      if (enumMember == '2') {
        this.iquizService.options.push(this.optionsArray[enumMember].c)
      }
      if (enumMember == '3') {
        this.iquizService.options.push(this.optionsArray[enumMember].d)
      }
    }
    if (parseInt(this.iquizService.questionSequenceNo) < this.iquizService.noOfQuestions) {
      this.iquizService.hasNextQuestion = true;
    } else {
      this.iquizService.hasNextQuestion = false;
    }
  }

  handleChange(val) {
    this.iquizService.selectedValue = val;
    this.iquizService.enableButton = true;
    console.log(this.iquizService.selectedValue)
  }
  ngOnInit() {
  }
}
