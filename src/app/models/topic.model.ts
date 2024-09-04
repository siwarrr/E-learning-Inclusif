import { Lesson } from "./lesson.model";
import { Quiz } from "./quiz.model";

export interface Topic {
  _id: string;
  name: string;
  description?: string;
  lessons: Lesson[]; // Utilisez le modèle Lesson
  quizzes: Quiz[]; // Utilisez le modèle Quiz
}