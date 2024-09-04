export interface QuizScore {
    _id: string;
    studentId: string;
    quizId: string;
    score: number;
    performance: string;
    completed: boolean;
  }
  