export interface Lesson {
  _id: string;
  name: string;
  content: string;
  videoUrl: string;
 /* phrasesFile: string; 
  subtitlesFile: string;
  timed_phrasesFile: string;*/
  transcription: string; 
  videoDuration: number;
  exerciseUrls: string[];
  }
  