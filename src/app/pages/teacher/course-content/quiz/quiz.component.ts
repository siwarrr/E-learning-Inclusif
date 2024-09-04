import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { Topic } from 'src/app/models/topic.model';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/course.service';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  @Input() courseId: string = '';
  sections: any[] = [];
  quizId: string = '';
  topicId: string = '';
  quiz: any = {};
  questions: any[] = [];
  currentQuestionIndex: number = 0;
  totalQuestions: number = 0;
  selectedOptions: (string | string[])[] = [];
  quizCompleted: boolean = false;
  score: number | undefined;
  scoreString: string | undefined;
  percentage: string | undefined;
  performance: string | undefined;
  userId: string = '';

  quizIndex: number = 0; // Par exemple, initialisez quizIndex à 0
  quizzes: any[] = []; // Initialisez quizzes à un tableau vide
  topics: any[] = []; // Initialisez topics à un tableau vide
  topicIndex: number = 0; // Par exemple, initialisez topicIndex à 0
  correctAnswers: any[] = [];
  isVisible: boolean = false;

  constructor(private route: ActivatedRoute, 
              private quizService: QuizService,
              private authService: AuthService,
              private courseService: CourseService,
              private message: NzMessageService,
              private translateService: TranslateService,
              private router: Router,
              private modalService: NzModalService
             ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.quizId = params['quizId'];
      this.topicId = params['topicId']; // Extrait de l'`id` du topic parent de l'URL
      this.courseId = params['courseId'];
      // Récupérer les sections du cours
      this.courseService.getCourseSections(this.courseId).subscribe(
        (sections) => {
          this.sections = sections;

          // Extraire les quizzes de chaque section et les stocker dans this.quizzes
          this.sections.forEach(section => {
            this.quizzes.push(...section.quizzes);
          });

          console.log('Quizzes du cours:', this.quizzes);
        },
        (error) => {
          console.error('Erreur lors de la récupération des sections du cours:', error);
        }
      );
      this.loadQuiz(this.topicId, this.quizId); // Charge le quiz en utilisant l'`id` du topic parent
      this.loadQuestions(this.topicId, this.quizId);
      this.loadNumberOfQuestions(this.topicId, this.quizId);
    });
    console.log("quizId:", this.quizId);
    this.authService.getCurrentUser().subscribe(
      (user: any) => {
        console.log('Current user:', user);
        if (user && user._id) {
          this.userId = user._id;
          console.log('User ID:', this.userId);
        } else {
          console.error('User ID not found');
        }
      },
      (error: any) => {
        console.error('Error getting current user:', error);
      }
    );
  }

  loadQuiz(topicId: string, quizId: string): void {
    this.quizService.getQuizById(topicId, quizId).subscribe(
      (quiz) => {
        this.quiz = quiz;
        console.log("Quiz loaded:", this.quiz);
      },
      (error) => {
        console.error('Error fetching quiz:', error);
      }
    );
  }

  loadQuestions(topicId: string, quizId: string): void {
    this.quizService.getQuestionsByQuizId(topicId, quizId).subscribe(
      (questions: any[]) => {
        this.questions = questions.map(question => {
          if (question.type === 'multiple choice' && !Array.isArray(question.correctAnswer)) {
            question.correctAnswer = []; // Initialize as empty array if not already an array
          }
          return question;
        });
        console.log("Questions loaded:", this.questions);
        this.questions.forEach((question, index) => {
          console.log(`Question ${index + 1}:`, question);
        });
        this.speakCurrentQuestion();
      },
      (error) => {
        console.error('Error fetching questions:', error);
      }
    );
  }

  loadNumberOfQuestions(topicId: string, quizId: string): void {
    this.quizService.getNumberOfQuestionsInQuiz(topicId, quizId).subscribe(
      (data) => {
        this.totalQuestions = data.numberOfQuestions;
        console.log("Total questions:", this.totalQuestions);
      },
      (error) => {
        console.error('Error fetching total questions:', error);
      }
    );
  }

  selectAnswer(optionId: string): void {
    this.selectedOptions[this.currentQuestionIndex] = optionId;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.totalQuestions - 1) {
      this.currentQuestionIndex++;
    }
    this.speakCurrentQuestion();
  }

  submitQuiz(): void {
    this.quizCompleted = true;

    const { _id } = this.quiz;
    const answers = this.selectedOptions.map(answer => 
      Array.isArray(answer) ? answer.join(',') : answer
    );

    console.log("quizId:", _id);
    console.log("answers:", answers);

    this.quizService.submitQuiz(_id, this.userId, answers).subscribe(
      (result) => {
        console.log("Quiz submitted successfully. Score:", result.score);
        this.score = result.score;
        this.scoreString = result.scoreString;
        this.percentage = result.percentage;
        this.performance = result.performance;
        this.correctAnswers = result.correctAnswers;
        this.speakQuizResult();
      },
      (error) => {
        console.error("Error submitting quiz:", error);
      }
    );
  }

  speakCurrentQuestion(): void {
    const question = this.questions[this.currentQuestionIndex]?.question;
    const options = this.questions[this.currentQuestionIndex]?.options?.map((option: { label: any; }) => option.label).join(', ');
    const textToSpeak = `Question: ${question}. Options: ${options}`;

    console.log('Trying to speak:', textToSpeak);
    window.speechSynthesis.cancel(); // Videz la file d'attente de synthèse vocale
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = this.getLangCode(this.detectLanguage(textToSpeak));

    // Ajoutez des écouteurs d'événements
    utterance.onend = () => {
      console.log('Speech synthesis finished.');
    };
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
    };

    // Vérifiez si le navigateur est prêt pour la synthèse vocale
    if (window.speechSynthesis.speaking) {
      console.warn('Speech synthesis is already speaking.'); // Avertir si déjà en cours de lecture
    }

    // Démarrez la synthèse vocale
    window.speechSynthesis.speak(utterance);
  }

  cancelSpeech(): void {
    window.speechSynthesis.cancel();
  }

  getLangCode(detectedLang: string): string {
    const langMap: { [key: string]: string } = {
      english: 'en-US',
      french: 'fr-FR',
      arabic: 'ar-SA',
      // Add more language mappings as needed
    };
    return langMap[detectedLang] || 'en-US'; // Default to English if language is not mapped
  }

  detectLanguage(text: string): string {
    // Convertir le texte en minuscules pour une correspondance insensible à la casse
    const lowerCaseText = text.toLowerCase();

    // Liste des mots-clés pour détecter les langues
    const languageKeywords: { [key: string]: string } = {
      'en': 'english',
      'fr': 'french',
      'ar': 'arabic'
      // Ajouter d'autres langues avec leurs mots-clés correspondants
    };

    // Parcourir les mots-clés et vérifier s'ils sont présents dans le texte
    for (const keyword in languageKeywords) {
      if (lowerCaseText.includes(keyword)) {
        return languageKeywords[keyword]; // Retourner la langue correspondante
      }
    }

    // Si aucune langue n'est détectée, retourner une valeur par défaut
    return 'english'; // Par défaut, retourner l'anglais si aucune détection n'est effectuée
  }

  speakQuizResult(): void {
    const resultText = `Great! The quiz is finished. Your score is ${this.scoreString}. Your percentage is ${this.percentage}. Your performance is ${this.performance}.`;
    const utterance = new SpeechSynthesisUtterance(resultText);
    utterance.lang = this.getLangCode(this.detectLanguage(resultText));

    // Ajoutez des écouteurs d'événements
    utterance.onend = () => {
      console.log('Speech synthesis finished.');
    };
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
    };

    // Vérifiez si le navigateur est prêt pour la synthèse vocale
    if (window.speechSynthesis.speaking) {
      console.warn('Speech synthesis is already speaking.'); // Avertir si déjà en cours de lecture
    }

    // Démarrez la synthèse vocale
    window.speechSynthesis.speak(utterance);
  }

  proceedToNextQuizOrTopic(type: string): void {
    // Récupérez l'ID du quiz actuel
    const currentQuizId = this.quiz._id;
    console.log("current quiz: ", currentQuizId);

    // Récupérez l'ID du dernier quiz dans la liste des quizzes du cours
    const lastQuizId = this.quizzes[this.quizzes.length - 1];

    // Vérifiez si l'ID du quiz actuel est égal à l'ID du dernier quiz
    const isLastQuiz = currentQuizId === lastQuizId;

    // Si c'est le dernier quiz, affichez "Cours terminé" et naviguez vers la page 'course-completed'
    if (isLastQuiz) {
      const messageKey = 'Congratulations! You have completed the course.';
      this.translateService.get(messageKey).subscribe((translatedMessage: string) => {
        this.message.create(type, translatedMessage);
        this.router.navigate(['learner/course-content', this.courseId, 'course-completed']);
      });
    } else {
      // Redirigez simplement vers la page 'course-content'
      this.router.navigate(['learner/course-content', this.courseId]);
    }
  }
  showModal(): void {
    this.isVisible = true;
    
    this.correctAnswers = this.questions.map((question, index) => {
      const learnerAnswer = this.selectedOptions[index];
      const isCorrect = Array.isArray(learnerAnswer)
        ? this.areArraysEqual(learnerAnswer, question.correctAnswer)
        : learnerAnswer === question.correctAnswer;
      
      return {
        question: question.question,
        correctAnswer: question.correctAnswer,
        learnerAnswer: learnerAnswer,
        isCorrect: isCorrect
      };
    });
  }
  
  areArraysEqual(arr1: string[], arr2: string[]): boolean {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value === arr2[index]);
  }
  

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}