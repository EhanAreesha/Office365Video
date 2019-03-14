interface IVideoService {
    chapterId?:string;
    isLoopTrue?:boolean;
    prevMaterialId?:string;
    materialId?:string;
    videoElement?: any;
    currentPath?: string;
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

interface IVideoPlayTracking {
  isVideoProgess?: boolean; 
  updateTrackAfter?: number;
  isVideoFinished?: boolean; 
}