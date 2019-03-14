export interface CourseData {
    userId: string;
    courseId: string;
    title: string;
    status: Status;
    coursePassed: string;
    locked: string;
    interventionRequired: string;
    playedTime: string;
    duration: string;
    passingPercentage: string;
    resumeCourseAtLevel: string;
    resumeCourseAtGUID: string;
    chapters: Chapter[];
    Quiz: Quiz;
}

export interface Quiz {
    quizid: string;
    title: string;
    status: Status;
    questions: Question[];
}

export interface Question {
    questionid: string;
    title: string;
    imageBase64: string;
    sequenceNo: string;
    status: Status;
    options: Option[];
    rightAnswer: string;
    userAnswer?: string;
    questionPassed: string;
    useranswer?: string;
}

export interface Option {
    a?: string;
    b?: string;
    c?: string;
    d?: string;
}

export interface Chapter {
    chapterId: string;
    title: string;
    status: Status;
    playedTime: string;
    duration: string;
    sequenceNo: string;
    materials: Material[];
    Quiz: Quiz;
    showChapterMenu?:boolean;
}

export interface Material {
    materialId: string;
    title: string;
    status: Status;
    type: string;
    embedScript: string;
    link: string;
    playedTime: string;
    duration: string;
    sequenceNo: string;
}

export enum Status {
    NotStarted = "Not Started",
    InProgress = "In Progress",
    Completed = "Completed",
    Failed = "Failed"
}