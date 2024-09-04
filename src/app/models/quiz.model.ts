export interface Quiz {
  _id: string;
  name: string;
  summary: string;
  questions: string[]; 
  timing: number; 
  numberOfQuestions: number;
}
