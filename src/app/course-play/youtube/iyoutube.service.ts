interface IYoutubeService {
    chapterId?:string;
    isLoopTrue?:boolean;
    materialId?:string;
    videoId?:string;
    currentTitle?: string;
    currentTime?: number;
    totalTime?: number;
    calculatedWidth?: number;
    calculatedScrubY?: number;
    isMuted?: boolean;
    isPlaying?: boolean;
    isDragging?: boolean;
    durationInSeconds?:number;
    totalPlayedInSeconds?: number;
    minutes?: number;
    seconds?: number;
    timeArray?:string[];
}

interface IYoutubePlayTracking {
  isVideoProgess?: boolean; 
  updateTrackAfter?: number;
  isVideoFinished?: boolean; 
}