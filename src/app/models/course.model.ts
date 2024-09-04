import { Topic } from "./topic.model";

export interface Course {
  _id: string;
  title: string;
  description: string;
  sections: Topic[];
  teacher: string;
  courseSpace: object;
  commentaires: string;
  avis: string;
  students: string[];
  __v: number;
}