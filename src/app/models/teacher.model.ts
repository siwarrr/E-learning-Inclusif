import { User } from './user.model';
export interface Teacher {
    courseSpaces: string[]; // Tableau des espaces de cours associés
    coursesCreated: string[]; // Tableau des cours créés par le professeur
    quizzesCreated: string[]; // Tableau des quiz créés par le professeur
  }