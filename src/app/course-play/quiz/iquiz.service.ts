interface IQuizService {
    currentTitle?: string;
    sequenceNo?: string;
    options?: string[];
    status?: string;
    isLoopTrue?: boolean;
    imageBase64?: string;
    chapterLength?: number;
    isAnswered?:boolean;
    enableButton?:boolean;
    hasNextQuestion?:boolean;
    questionSequenceNo?:string;
    noOfQuestions?:number;
    quizStatus?: string; 
    prevMaterialId?:string;
    selectedValue?:string;
    chapterId?: string;
    isFinalQuiz?:boolean;
    rightAnswer?: string;
    userAnswer?: string;
    questionPassed?: string;
    answerStatus?: string;
}