import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { catchError, filter, finalize, throwError } from 'rxjs';
import { Lesson } from 'src/app/models/lesson.model';
import { Question } from 'src/app/models/question.model';
import { Quiz } from 'src/app/models/quiz.model';
import { Topic } from 'src/app/models/topic.model';
import { CourseService } from 'src/app/services/course.service';
import { LessonService } from 'src/app/services/lesson.service';
import { QuizService } from 'src/app/services/quiz.service';
import { TopicService } from 'src/app/services/topic.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-course-section',
  templateUrl: './course-section.component.html',
  styleUrls: ['./course-section.component.css']
})
export class CourseSectionComponent implements OnInit {

  size: NzButtonSize = 'small';
  visible = false;
  formData: any = {};
  lessonForm: FormGroup = new FormGroup({});

  topics: any[] = [];
  lessons: any[] = [];
  quizzes: any[] = [];
  questions: any[] = [];
  selectedTopicName: string = '';
  selectedQuestionType: 'true/false' | 'single choice' | 'multiple choice' | 'short answer' = 'true/false';
  showQuestionList = false;
  selectedOption: string = ''; 
  selectedOptions: string[] = [];
  additionalOption: string = '';
  shortAnswer: string = '';
  options: any[] = [];
  selectedTime: number | null = null;
  currentTopicId: string = '';
  topicIndex!: number; 
  currentTopicIndex!: number;
  lessonId: string | undefined = '';  
  quizId: string | undefined = '';  
  currentTopic: any;
  transcriptionFiles: NzUploadFile[] = [];

  isVisibleTopicModal = false;
  isOkLoading = false;
  http: any;

  isVisibleLessonModal = false;
  isVisibleQuizModal = false;

  @Input() courseId: string = ''; // Propriété d'entrée pour courseId
  @Input() topicsList: Topic[] = [];
  @Input() sectionData: any = {};
  @Output() sectionDataChange: EventEmitter<any> = new EventEmitter<any>();

  // Déclarez un objet pour stocker les topics pour chaque cours
  courseTopics: { [courseId: string]: any[] } = {};

  apiUploadUrl = environment.apiUploadUrl;
  uploading = false;
  fileList: NzUploadFile[] = [];
  videoFile: NzUploadFile[] = [];
  fb: any;

  constructor(private httpClient: HttpClient, 
    private msg: NzMessageService,
    private topicService: TopicService,
    private courseService: CourseService,
    private lessonService: LessonService,
    private quizService: QuizService,
    private translateService: TranslateService,
    private route: ActivatedRoute, 
    private formBuilder: FormBuilder,
     ){}
    
  ngOnInit(): void {
    this.apiUploadUrl = environment.apiUploadUrl;

    console.log('course ID :',this.courseId);
    this.loadTopics().then(() => {
      // Une fois que tous les topics sont chargés, vous pouvez charger les leçons
      // et les quizzes associés à chaque topic
      this.loadLessonsAndQuizzesForEachTopic();
    });
      // Assurez-vous que currentTopicId contient une valeur valide avant de charger les leçons
    if (this.currentTopicId) {
      this.loadLessons(this.currentTopicId);
      this.loadQuizzes(this.currentTopicId);
    }  
    // Charger les topics depuis le stockage local s'ils existent
    const storedTopics = localStorage.getItem('topics');
    if (storedTopics) {
      this.courseTopics = JSON.parse(storedTopics);
    }
  
    // Charger les leçons depuis le stockage local s'ils existent
    const storedLessons = localStorage.getItem('lessons');
    if (storedLessons) {
      this.lessons = JSON.parse(storedLessons);
    }
  
    // Charger les quizzes depuis le stockage local s'ils existent
    const storedQuizzes = localStorage.getItem('quizzes');
    if (storedQuizzes) {
      this.quizzes = JSON.parse(storedQuizzes);
    }

  }
  updateCurrentTopicId(topicId: string): void {
    this.currentTopicId = topicId;
  }
  loadTopics(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Charger d'abord le cours pour s'assurer que le courseId est défini
      this.courseService.getCourseById(this.courseId).subscribe(
        (course: any) => {
          if (course && course.sections && course.sections.length > 0) {
            // Si le cours est correctement chargé avec des sections, charger les sujets
            this.courseService.getCourseSections(this.courseId).subscribe(
              (topics: any[]) => {
                // Stocker les sujets dans this.courseTopics[this.courseId]
                this.courseTopics[this.courseId] = this.courseTopics[this.courseId] ? [...this.courseTopics[this.courseId], ...topics] : topics;
  
                // Vérifier si le sujet actuel appartient au cours en cours
                const currentTopic = this.courseTopics[this.courseId].find(topic => topic._id === this.currentTopicId);
  
                // Si le sujet actuel n'appartient pas au cours en cours, assigner le premier sujet du cours
                if (!currentTopic && this.courseTopics[this.courseId].length > 0) {
                  this.currentTopicId = this.courseTopics[this.courseId][0]._id;
                }
  
                // Pour chaque sujet, charger les leçons et les quizzes
                this.courseTopics[this.courseId].forEach(topic => {
                  this.loadLessons(topic._id);
                  this.loadQuizzes(topic._id);
                });
  
                // Afficher l'ID du sujet actuel après le chargement initial des sujets
                console.log('topic ID :', this.currentTopicId);
                resolve(); // Résoudre la promesse une fois que les sujets sont chargés
              },
              (error) => {
                console.error('Error loading topics:', error);
                reject(error); // Rejeter la promesse en cas d'erreur
              }
            );
          } else {
            console.error('Course not found or has no sections:', course);
            reject('Course not found or has no sections'); // Rejeter la promesse si le cours n'est pas trouvé ou n'a pas de sections
          }
        },
        (error: any) => {
          console.error('Error loading course:', error);
          reject(error); // Rejeter la promesse en cas d'erreur lors du chargement du cours
        }
      );
    });
  }
  
loadLessonsAndQuizzesForEachTopic(): void {
  // Pour chaque sujet, charger les leçons et les quizzes
  this.courseTopics[this.courseId].forEach(topic => {
    this.loadLessons(topic._id);
    this.loadQuizzes(topic._id);
  });
} 
  loadLessons(topicId: string): void {
    this.topicService.getLessons(this.courseId,topicId).subscribe(
      (lessons: any[]) => {
        // Mettre à jour les leçons du topic
        const currentTopic = this.courseTopics[this.courseId].find(topic => topic._id === topicId);

        if (currentTopic) {
          currentTopic.lessons = lessons;
        }
        console.log('Liste des leçons récupérées de la base de données du topic : ',topicId, lessons);
        return lessons;
      },
      (error) => {
        console.error('Error loading lessons:', error);
      }
    );
  }
  
  loadQuizzes(topicId: string): void {
    this.topicService.getQuizzes(this.courseId,topicId).subscribe(
      (quizzes: any[]) => {
        // Mettre à jour les quizzes du topic
        const currentTopic = this.courseTopics[this.courseId].find(topic => topic._id === topicId);
        if (currentTopic) {
          currentTopic.quizzes = quizzes;
        }
        console.log('Liste des quizzes récupérées de la base de données : ', quizzes);
        return quizzes;
      },
      (error) => {
        console.error('Error loading quizzes:', error);
      }
    );
  }
// Méthode pour mettre à jour les données de la deuxième section
updateSectionData(newData: any) {
  // Mettre à jour les données de la deuxième section en fusionnant les nouvelles données avec les anciennes
  this.sectionData = { ...this.sectionData, ...newData };

  // Émettre l'événement avec les nouvelles données
  this.sectionDataChange.emit(this.sectionData);

  // Sauvegarder localement les données mises à jour
  this.saveSectionDataLocally();
}
saveSectionDataLocally(): void {
  // Fusionner les nouvelles données avec les anciennes si elles existent déjà localement
  const storedSectionData = localStorage.getItem('sectionData');
  let mergedSectionData = storedSectionData ? { ...JSON.parse(storedSectionData), ...this.sectionData } : this.sectionData;

  // Sauvegarder les données fusionnées localement
  localStorage.setItem('sectionData', JSON.stringify(mergedSectionData));
}
  
//Topic Modal*******************************************************
  showTopicModal(): void {
    this.isVisibleTopicModal = true;
  }
  showEditTopicModal(topicId: string): void {
    console.log('topicId:', topicId);

    this.currentTopicId = topicId;

    if (this.courseTopics && this.courseTopics[this.courseId]) {
      const currentTopic = this.courseTopics[this.courseId].find(topic => topic._id === this.currentTopicId);

      console.log('currentTopic:', currentTopic);

      if (currentTopic) {
        // Pré-remplir les champs du formulaire avec les données du topic
        this.formData.topicId = currentTopic._id;
        this.formData.topicName = currentTopic.name;
        this.formData.topicSummary = currentTopic.summary;

        this.isVisibleTopicModal = true; // Ouvrir le modal
      } else {
        console.error("Topic not found for ID:", topicId);
      }
    } else {
      console.error("Invalid courseId or no topics found for courseId:", this.courseId);
    }
  }

  createTopic(): void {
    // Vérifiez si le tableau de topics pour ce cours existe déjà dans courseTopics
    if (!this.courseTopics[this.courseId]) {
    }
  
    const newTopicData = {
      name: this.formData.topicName,
      summary: this.formData.topicSummary,
      lessons: [], // Initialiser le tableau des leçons
      quizzes: []
    };
  
    console.log('Creating topic with data:', newTopicData);
    
    // Envoyer la requête HTTP pour créer le topic dans le backend
    this.topicService.createTopic(this.courseId, newTopicData).subscribe(
      (response) => {
        // Ajouter le nouveau sujet à la liste existante des sujets
        this.courseTopics[this.courseId] = this.courseTopics[this.courseId] ? [...this.courseTopics[this.courseId], response.newTopic] : [response.newTopic];
  
        // Mettre à jour les données de la deuxième section après la création du sujet
        this.updateSectionData({ topics: this.courseTopics[this.courseId] });
  
        // Réinitialiser le formulaire de sujet
        this.resetTopicForm();
        this.isVisibleTopicModal = false;
      },
      (error) => {
        console.error('Error creating topic:', error);
        // Gérer l'erreur ici
      }
    );
  }
  updateTopic(): void {
    const updatedTopicData = {
      name: this.formData.topicName,
      summary: this.formData.topicSummary,
    };
  
    console.log('Updating topic with data:', updatedTopicData);
  
    // Envoyer la requête HTTP pour mettre à jour le topic dans le backend
    this.topicService.updateTopic(this.courseId, this.formData.topicId, updatedTopicData).subscribe(
      (response) => {
        // Trouver et mettre à jour le sujet existant dans la liste
        const index = this.courseTopics[this.courseId].findIndex(topic => topic.id === this.formData.topicId);
        if (index !== -1) {
          this.courseTopics[this.courseId][index] = response; // Assumer que response est le topic mis à jour
        }
    
        // Réinitialiser le formulaire de sujet
        this.resetTopicForm();
        this.isVisibleTopicModal = false;
      },
      (error) => {
        console.error('Error updating topic:', error);
        // Gérer l'erreur ici
      }
    );
  }  

  emitSectionData(): void {
    this.sectionDataChange.emit({ topics: this.topics });
  }
  
  handleTopicOk(): void {
    this.isOkLoading = true;
    this.createTopic();
    setTimeout(() => {
      this.isOkLoading = false; 
      this.isVisibleTopicModal = false; 
    }, 3000);
  }
  createOrUpdateTopic(): void {
    if (this.formData.topicId) {
      this.updateTopic();
    } else {
      this.createTopic();
    }
  }
  addLessonToTopic(lesson: any, topic: any): void {
    // Vérifier si le topic existe et s'il a une propriété 'lessons'
    if (topic && topic.lessons) {
      // Ajouter la leçon au tableau des leçons du topic
      topic.lessons.push(lesson);
    } else {
      // Si le topic n'existe pas ou s'il n'a pas de propriété 'lessons', initialisez-le à un tableau vide
      topic.lessons = [lesson];
    }
  }
  addQuizToTopic(quiz: any, topic: any): void {
    // Vérifier si le topic existe et s'il a une propriété 'quizzes'
    if (topic && topic.quizzes) {
      // Ajouter le quiz au tableau des quizzes du topic
      topic.quizzes.push(quiz);
      console.log('Quiz added to topic:', topic); // Ajoutez cette ligne pour vérifier si le quiz est ajouté au topic

    } else {
      // Si le topic n'existe pas ou s'il n'a pas de propriété 'quizzes', initialisez-le à un tableau vide
      topic.quizzes = [quiz];
    }
  }

  resetTopicForm(): void {
    this.formData.topicName = '';
    this.formData.topicSummary = '';
  }
  hideTopicModal(): void {
    this.isVisibleTopicModal = false;
    this.resetTopicForm(); 
  }

//Lesson Modal******************************************************

// Ajoutez cette méthode pour ouvrir le modal de modification de leçon
showEditLessonModal(topicId: string, lessonId: string): void {
  console.log('topicId:', topicId);
  console.log('lessonId:', lessonId);
  
  this.currentTopicId = topicId;
  this.lessonId = lessonId;

  console.log('this.topics:', this.topics);

  const numericTopicId: number = parseInt(topicId);
  if (this.courseTopics && this.courseTopics[this.courseId]) {
    const currentTopic = this.courseTopics[this.courseId].find(topic => topic._id === this.currentTopicId);

    console.log('currentTopic:', currentTopic);

    if (currentTopic) {
      const currentLesson = currentTopic.lessons.find((lesson: Lesson) => lesson._id === lessonId);
      console.log('currentLesson:', currentLesson);

      if (currentLesson) {
        this.formData.lessonName = currentLesson.name;
        this.formData.content = currentLesson.content;
        this.formData.lessonVideo = currentLesson.videoUrl;
        this.formData.transcription = currentLesson.transcription;
        this.formData.videoDuration = currentLesson.videoDuration;
        this.isVisibleLessonModal = true;
      } else {
        console.error("Lesson not found for ID:", lessonId);
      }
    } else {
      console.error("Topic not found for ID:", topicId);
    }
  } else {
    console.error("Invalid topicId:", topicId);
  }
}



// Modifiez la méthode showLessonModal() pour gérer à la fois la création et la modification
showLessonModal(topicId: string, lessonId?: string): void {
  // Stocker l'ID du sujet actuel
  this.currentTopicId = topicId;
  this.lessonId = lessonId; // Stockez l'ID de la leçon si fourni

  if (lessonId) {
    // Si lessonId est fourni, ouvrez le modal de modification de leçon
    this.showEditLessonModal(topicId, lessonId);
  } else {
    // Sinon, ouvrez le modal de création de leçon avec un formulaire vide
    this.resetLessonForm();
    this.isVisibleLessonModal = true;
  }
}
// Modifiez la méthode createLessonForTopic() pour soumettre les données correctes en fonction de l'état de la leçon actuelle
createLessonForTopic(): void {
  console.log('Attempting to create/update lesson for topic:', this.currentTopicId);

  if (this.courseTopics && this.courseTopics[this.courseId]) {
    const currentTopic = this.courseTopics[this.courseId].find(topic => topic._id === this.currentTopicId);

    if (currentTopic) {
      const lessonData = {
        name: this.formData.lessonName,
        content: this.formData.content,
        videoUrl: this.formData.lessonVideo,
        transcription: this.formData.transcription,
        videoDuration: this.formData.videoDuration,
      };

      console.log('Lesson data:', lessonData);

      let requestObservable;

      if (this.lessonId) {
        requestObservable = this.lessonService.updateLesson(this.currentTopicId, this.lessonId, lessonData);
      } else {
        requestObservable = this.lessonService.createLesson(this.currentTopicId, lessonData);
      }

      requestObservable.subscribe(
        (response: any) => {
          console.log('Lesson created/updated successfully:', response);

          if (this.lessonId) {
            // Mettre à jour la leçon existante
            const lessonIndex = currentTopic.lessons.findIndex((lesson: Lesson) => lesson._id === this.lessonId);
            if (lessonIndex !== -1) {
              currentTopic.lessons[lessonIndex] = response;
            }
          } else {
            // Ajouter la nouvelle leçon
            currentTopic.lessons.push(response);
          }

          // Réinitialiser le formulaire de leçon
          this.resetLessonForm();
          this.saveLessonsLocally();
          this.isVisibleLessonModal = false;
        },
        (error) => {
          console.error('Error creating/updating lesson:', error);
        }
      );
    } else {
      console.error("Topic not found for ID:", this.currentTopicId);
    }
  } else {
    console.error("Course topics not found or courseId not defined:", this.courseTopics, this.courseId);
  }
}


saveLessonsLocally(): void {
  const lessonsToSave = this.courseTopics[this.courseId].flatMap(topic => topic.lessons);
  localStorage.setItem('lessons', JSON.stringify(lessonsToSave));
}


// Méthode appelée lorsque l'utilisateur clique sur le bouton "OK" du formulaire de création de leçon
// Modifiez la méthode handleLessonOk() pour gérer à la fois la création et la modification
handleLessonOk(): void {
  this.isOkLoading = true;
  this.createLessonForTopic(); // Appel de la méthode pour créer/modifier une leçon
  setTimeout(() => {
    this.isOkLoading = false;
    this.isVisibleLessonModal = false;
  }, 3000);
}

resetLessonForm(): void {
  this.formData.lessonName = '';
  this.formData.content = ''; // Correction de la réinitialisation de la description
  this.formData.lessonVideo = '';
  /*this.formData.phrasesFile = '';
  this.formData.subtitlesFile = '';
  this.formData.timed_phrasesFile = '';*/
  this.formData.transcription = ''; // Correction de la typo
  this.formData.videoDuration = '';
  this.formData.lessonExercise = '';
}
hideLessonModal(): void {
  this.isVisibleLessonModal = false;
  this.resetLessonForm(); 
}



beforeUpload = (file: NzUploadFile): boolean => {
  this.fileList = [...this.fileList, file];
  return false;
};
handleChange(info: NzUploadChangeParam): void {
  if (info.file.status === 'done') {
    // Appel de la méthode handleUpload pour gérer l'envoi personnalisé
    this.handleUpload(info.file.originFileObj as File);
  }
}

handleUpload(file: File): void {
  const formData = new FormData();
  formData.append('file', file); // Assurez-vous que le champ est nommé 'file' comme attendu par votre backend

  this.uploading = true;

  const uploadUrl = `${this.apiUploadUrl}${this.courseId}/sections/video`; // Assurez-vous que l'URL de téléchargement est correcte

  const req = new HttpRequest('POST', uploadUrl, formData, {
    reportProgress: true, // Si vous avez besoin de suivre la progression du téléchargement
  });

  this.httpClient.request(req).pipe(
    finalize(() => {
      this.uploading = false;
      this.msg.success('Video upload successful.');
    }),
    catchError((error) => {
      this.uploading = false;
      this.msg.error('Video upload failed.');
      return throwError(error);
    })
  ).subscribe(() => {
    // Réinitialisez la liste de fichiers après un téléchargement réussi
    this.videoFile = [];
  });
}

//Quiz Modal******************************************************

// Ajoutez cette méthode pour ouvrir le modal de modification de quiz
showEditQuizModal(topicId: string, quizId: string): void {
  this.currentTopicId = topicId;
  this.quizId = quizId;

  console.log('Fetching quiz data for topic ID:', topicId, 'and quiz ID:', quizId);

  this.quizService.getQuizById(topicId, quizId).subscribe(
    (response: any) => {
      const currentQuiz = response;

      console.log('Received quiz data:', currentQuiz);

      if (currentQuiz) {
        this.formData.quizName = currentQuiz.name;
        this.formData.quizSummary = currentQuiz.summary;
        this.questions = currentQuiz.questions.map((question: any) => {
          if (question.type === 'multiple choice' || question.type === 'single choice') {
            question.options = question.options.map((option: any) => {
              return {
                ...option,
                selected: question.correctAnswer.includes(option.value)
              };
            });
          }
          return question;
        });        this.selectedTime = currentQuiz.timing;
        this.isVisibleQuizModal = true;

        console.log('Quiz name:', this.formData.quizName);
        console.log('Quiz summary:', this.formData.quizSummary);
        console.log('Quiz questions:', this.questions);
        console.log('Quiz timing:', this.selectedTime);
      } else {
        console.error("Quiz not found for ID:", quizId);
      }
    },
    (error) => {
      console.error('Error fetching quiz:', error);
    }
  );
}

showQuizModal(topicId: string, quizId?: string): void {
  this.currentTopicId = topicId;
  this.quizId = quizId;

  if (quizId) {
    this.showEditQuizModal(topicId, quizId);
  } else {
    this.resetQuizForm();
    this.isVisibleQuizModal = true;
  }
}

createQuizForTopic(): void {
  console.log('Attempting to create/update quiz for topic:', this.currentTopicId);

  if (this.courseTopics && this.courseTopics[this.courseId]) {
    const currentTopic = this.courseTopics[this.courseId].find(topic => topic._id === this.currentTopicId);

    if (currentTopic) {
      const quizData = {
        name: this.formData.quizName,
        summary: this.formData.quizSummary,
        questions: this.questions,
        timing: this.selectedTime
      };

      console.log('Quiz data:', quizData);

      let requestObservable;

      if (this.quizId) {
        requestObservable = this.quizService.updateQuiz(this.currentTopicId, this.quizId, quizData);
      } else {
        requestObservable = this.quizService.createQuiz(this.currentTopicId, quizData);
      }

      requestObservable.subscribe(
        (response: any) => {
          console.log('Quiz created/updated successfully:', response);
          
          if (this.quizId) {
            // Mettre à jour le quiz existant
            const quizIndex = currentTopic.quizzes.findIndex((quiz: Quiz) => quiz._id === this.quizId);
            if (quizIndex !== -1) {
              currentTopic.quizzes[quizIndex] = response;
            }
          } else {
            // Ajouter le nouveau quiz
            currentTopic.quizzes.push(response);
          }

          this.resetQuizForm();
          this.saveQuizzesLocally();
          this.isVisibleQuizModal = false;
        },
        (error) => {
          console.error('Error creating/updating quiz:', error);
        }
      );
    } else {
      console.error("Topic not found for ID:", this.currentTopicId);
    }
  } else {
    console.error("Course topics not found or courseId not defined:", this.courseTopics, this.courseId);
  }
}

saveQuizzesLocally(): void {
  const quizzesToSave = this.courseTopics[this.courseId].flatMap(topic => topic.quizzes);
  localStorage.setItem('quizzes', JSON.stringify(quizzesToSave));
}

  resetQuizForm(): void {
    this.formData.quizName = '';
    this.formData.quizSummary = '';
    this.selectedTime = null;
    this.questions = [];
    this.selectedQuestionType = 'true/false';
    this.showQuestionList = false;
    this.options = [];
    this.selectedOption = '';
    this.additionalOption = '';
    this.shortAnswer = '';
  }
  hideQuizModal(): void {
    this.isVisibleQuizModal = false;
    this.resetQuizForm(); 
  }
  addOption(): void {
    if (this.additionalOption.trim() !== '') {
      this.options.push({ value: this.additionalOption, label: this.additionalOption, selected: false });
      this.additionalOption = '';
    }
  }

  saveQuestion(): void {
    let correctAnswer: string | string[] = '';

    if (this.selectedQuestionType === 'true/false' || this.selectedQuestionType === 'single choice') {
      correctAnswer = this.selectedOption;
    } else if (this.selectedQuestionType === 'multiple choice') {
      correctAnswer = this.options.filter(option => option.selected).map(option => option.value);
    } else if (this.selectedQuestionType === 'short answer') {
      correctAnswer = this.shortAnswer;
    }

    const newQuestion: Question = {
      question: this.formData.questionName,
      type: this.selectedQuestionType,
      options: this.selectedQuestionType === 'multiple choice' || this.selectedQuestionType === 'single choice' ? this.options : [],
      correctAnswer: correctAnswer,
      _id: ''
    };

    this.questions.push(newQuestion);
    this.resetQuestionForm();
    this.showQuestionList = true;
  }

  resetQuestionForm(): void {
    this.formData.questionName = '';
    this.options = [];
    this.selectedQuestionType = 'true/false';
    this.shortAnswer = '';
    this.selectedOption = '';
    this.additionalOption = '';
  }
  isOptionCorrect(optionValue: string): boolean {
    // Récupérer les réponses correctes de la question actuelle
    const correctAnswers = this.questions.find(question => question.name)?.correctAnswer;
    // Vérifier si l'optionValue est inclus dans les réponses correctes
    return correctAnswers && correctAnswers.includes(optionValue);
  }
  
  changeQuestionType(): void {
    // Réinitialiser les options de la question
    this.options = [];
  }
  saveSelectedTime(): void {
    // Convertir le temps saisi en minutes
    // Ici, nous supposons que le temps est saisi en secondes et que nous le convertissons en minutes
    this.selectedTime = this.selectedTime ? this.selectedTime * 60 : null;
  }
  
  panels = [
    {
      active: true,
      disabled: false,
      name: this.translateService.instant('Course sections'),
      childPannel: [
        {
          active: false,
          disabled: true,
          
        }
      ]
    }
  ]
  //switch step
  current = 0;

  index = 'First-content';

  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    this.current += 1;
    this.changeContent();
  }

  done(): void {
    this.isOkLoading = true;
    this.createQuizForTopic(); // Appel de la méthode pour créer un quiz
    setTimeout(() => {
      this.isOkLoading = false; 
      this.isVisibleQuizModal = false; 
    }, 3000);
}

  changeContent(): void {
    switch (this.current) {
      case 0: {
        this.index = 'First-content';
        break;
      }
      case 1: {
        this.index = 'Second-content';
        break;
      }
      case 2: {
        this.index = 'third-content';
        break;
      }
      default: {
        this.index = 'error';
      }
    }
  }
  saveSecondSection(): void {
    // Vérifier si sectionData et sectionData.topics sont définis
    if (this.sectionData && this.sectionData.topics) {
      // Parcourir chaque sujet
      this.sectionData.topics.forEach((topic: any) => {
        // Vérifier si le sujet existe dans le stockage local
        const storedTopicIndex = this.topics.findIndex((storedTopic: any) => storedTopic._id === topic._id);
        if (storedTopicIndex !== -1) {
          // Si le sujet existe déjà dans le stockage local, mettre à jour les leçons et les quizzes
          this.topics[storedTopicIndex].lessons = topic.lessons;
          this.topics[storedTopicIndex].quizzes = topic.quizzes;
        } else {
          // Si le sujet n'existe pas dans le stockage local, l'ajouter
          this.topics.push(topic);
        }
      });
  
      // Sauvegarder localement les sujets mis à jour
      localStorage.setItem('topics', JSON.stringify(this.topics));
    } else {
      console.error('Error: sectionData or sectionData.topics is undefined.');
      // Afficher un message d'erreur à l'utilisateur ou effectuer d'autres actions nécessaires en cas d'erreur
    }
  }
  
//delete
deleteTopic(topicId: string): void {
  console.log('Deleting topic with ID:', topicId);
  this.topicService.deleteTopic(topicId).subscribe(
    () => {
      console.log('Topic deleted successfully');
      this.removeTopicFromLocal(topicId);
      this.updateView(); // Recharger les topics après suppression
    },
    (error) => {
      console.error('Error deleting topic:', error);
    }
  );
}

deleteLesson(topicId: string, lessonId: string): void {
  console.log('Deleting lesson with ID:', lessonId);
  this.lessonService.deleteLesson(topicId, lessonId).subscribe(
    (response) => {
      console.log('Lesson deleted successfully:', response);
      this.removeLessonFromLocal(topicId, lessonId);
      this.updateView();
    },
    (error) => {
      console.error('Error deleting lesson:', error);
    }
  );
}

deleteQuiz(topicId: string, quizId: string): void {
  console.log('Deleting quiz with ID:', quizId);
  this.quizService.deleteQuiz(topicId, quizId).subscribe(
    (response) => {
      console.log('Quiz deleted successfully:', response);
      this.removeQuizFromLocal(topicId, quizId);
      this.updateView();
    },
    (error) => {
      console.error('Error deleting quiz:', error);
    }
  );
}

removeLessonFromLocal(topicId: string, lessonId: string): void {
  const currentTopic = this.courseTopics[this.courseId].find(topic => topic._id === topicId);
  if (currentTopic) {
    currentTopic.lessons = currentTopic.lessons.filter((lesson: { _id: string; }) => lesson._id !== lessonId);
    console.log('Updated lessons for topic:', currentTopic.lessons);
    this.saveLessonsLocally();
    this.updateView();
  }
}

removeQuizFromLocal(topicId: string, quizId: string): void {
  const currentTopic = this.courseTopics[this.courseId].find(topic => topic._id === topicId);
  if (currentTopic) {
    currentTopic.quizzes = currentTopic.quizzes.filter((quiz: { _id: string; }) => quiz._id !== quizId);
    this.saveQuizzesLocally();
    this.updateView();
  }
}

removeTopicFromLocal(topicId: string): void {
  this.courseTopics[this.courseId] = this.courseTopics[this.courseId].filter(topic => topic._id !== topicId);
  this.updateView();
}

updateView(): void {
  this.loadTopics().then(() => {
    this.loadLessonsAndQuizzesForEachTopic();
  });
}


}

              
      