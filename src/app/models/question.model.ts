export interface Question {
  _id: string;
  question: string;
  type: 'true/false' | 'single choice' | 'multiple choice' | 'short answer';
  options?: { value: string, label: string }[]; // Liste des options de réponse
  correctAnswer: string | string[]; // Accepte les deux types pour différentes questions
}
