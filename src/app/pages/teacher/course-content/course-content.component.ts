import { ChangeDetectorRef, Component, HostListener, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { formatDistance } from 'date-fns';
import { Observable, filter, of, switchMap, take } from 'rxjs';
import { LearningResource } from 'src/app/models/learningResource.model';
import { Topic } from 'src/app/models/topic.model';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/course.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TopicService } from 'src/app/services/topic.service';
import { Lesson } from 'src/app/models/lesson.model';
import { LessonService } from 'src/app/services/lesson.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { QuizScore } from 'src/app/models/quizScore.model';
import { Quiz } from 'src/app/models/quiz.model';
import { Commentaire } from 'src/app/models/comment.model';
import { CommentService } from 'src/app/services/comment.service';
import { NzButtonSize } from 'ng-zorro-antd/button';
declare var YT: any; // Déclaration de YT pour éviter les erreurs de compilation TypeScript

@Component({
  selector: 'app-course-content',
  templateUrl: './course-content.component.html',
  styleUrls: ['./course-content.component.css']
})
export class CourseContentComponent implements OnInit{

  @ViewChild('commentTemplateRef') commentTemplateRef!: TemplateRef<any>;

[x: string]: any;
  courseDetails: any;
  teacherName: string = ''; 
  sections: Topic[] = [];
  currentVideoUrl: string | SafeResourceUrl = '';
  initialVideoUrl:  string | SafeResourceUrl = '';
  courseId: string = '';
  topicId: string = '';
  lessonId: string = '';
  videoUrl: string = '';
  selectedLessonId: string = '';
  studentId: string = '';
  userId: string = '';
  quizScores: QuizScore[] = [];
  selectedLessonTranscription: string = '';
  inputValue?: string;
  isSpeaking: boolean = false;

  myForm!: FormGroup;
  addedSections: Topic[] = [];

  tabs: any[] = [];
  newTitle: string = '';
  newDescription: string = '';
  
  likes = 0;
  dislikes = 0;
  time = formatDistance(new Date(), new Date());
  newRating = { stars: 3, tooltip: '' };
  tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
  totalStars: number | undefined;
  averageRating: number | undefined;  
  value = 3;
  starVotes: number[] = [];
  size: NzButtonSize = 'small';

  comments: Commentaire[] = [];
  newCommentText: string = '';
  replyText: string = '';
  selectedCommentId: string | null = null;
  progressPercentage: number = 0;
  submitting = false;

  percentFormatter = (percent: number): string => `${percent.toFixed(2)}%`;
  isZoomControlsVisible: boolean = true;
  zoomLevel: number = 1; // Niveau de zoom par défaut

  constructor(private courseService: CourseService,
              private topicService: TopicService,
              private lessonService: LessonService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private sanitizer: DomSanitizer,
              private commentService: CommentService,
              private cdr: ChangeDetectorRef
              ) {}

ngOnInit(): void {
  this.route.params.pipe(
    switchMap(params => {
      this.courseId = params['courseId'];

      // Si les IDs de topic et de leçon sont fournis dans l'URL, nous les utilisons
      if (this.topicId && this.lessonId) {
        return of({ courseId: this.courseId, topicId: this.topicId, lessonId: this.lessonId }).pipe(
          take(1)
        );
      } else {
        // Si les IDs de topic et de leçon ne sont pas fournis, nous les avons déjà extraits des sections du cours
        return of({ courseId: this.courseId, topicId: this.topicId, lessonId: this.lessonId }).pipe(
          take(1)
        );
      }
    })
  ).subscribe(() => {
    if (this.courseId) {
      this.getCourseDetails(this.courseId);
      this.getTeacherName(this.courseId);
      this.loadComments();
      this.getReviews(this.courseId);
      this.getStarVotes(this.courseId); 
    }
  });
  this.courseService.getInitialVideo(this.courseId).subscribe(
    (data: any) => {
      const videoUrl: string = data.videoUrl;
      this.initialVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl) as SafeResourceUrl;
      this.initializeYoutubePlayer(this.extractVideoIdFromUrl(videoUrl));

      this.currentVideoUrl = this.initialVideoUrl // Afficher la première vidéo par défaut
    },
    (error) => {
      console.error('Error fetching initial video:', error);
    }
  );  
  console.log("courseId:", this.courseId);
  this.authService.getCurrentUser().subscribe(
    (user: any) => {
      console.log('Current user:', user);
      if (user && user._id) {
        this.userId = user._id;
        this.getStudentProgress();
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

loadComments(): void {
  this.commentService.getComments(this.courseId).subscribe(
    (data: any) => {
      this.comments = data.comments;
      this.comments.forEach(comment => this.loadReplies(comment));
      this.cdr.detectChanges();
    },
    (error) => {
      console.error('Erreur lors de la récupération des commentaires', error);
    }
  );
}

loadReplies(comment: Commentaire): void {
  this.commentService.getReplies(comment._id).subscribe(
    (data: any) => {
      comment.replies = data.replies || [];
      comment.replies.forEach(reply => this.loadReplies(reply));
      this.cdr.detectChanges();
    },
    (error) => console.error('Error loading replies:', error)
  );
}

addComment(): void {
  if (this.newCommentText.trim()) {
    this.commentService.createComment(this.userId, this.courseId, this.newCommentText).subscribe(
      (comment) => {
        this.comments.push(comment);
        this.newCommentText = '';
        this.cdr.detectChanges();
      },
      (error) => console.error('Error creating comment:', error)
    );
  }
}

setReplyCommentId(commentId: string): void {
  console.log("Setting reply for comment ID:", commentId); // Log pour vérifier l'appel
  this.selectedCommentId = commentId;
  this.replyText = '';
  this.cdr.detectChanges();
}

replyToComment(commentId: string): void {
  if (this.replyText.trim()) {
    const replyData = {
      userId: this.userId,
      text: this.replyText,
      courseId: this.courseId
    };

    this.commentService.replyToComment(this.courseId, commentId, replyData).subscribe(
      (response) => {
        const parentComment = this.comments.find(comment => comment._id === commentId);
        if (parentComment) {
          if (!parentComment.replies) {
            parentComment.replies = [];
          }
          parentComment.replies.push(response.reply);
        }
        this.replyText = '';
        this.selectedCommentId = null;
        this.cdr.detectChanges();
      },
      (error) => console.error('Error replying to comment:', error)
    );
  }
}

likeComment(comment: Commentaire): void {
  this.addReaction(comment, 'like');
}

dislikeComment(comment: Commentaire): void {
  this.addReaction(comment, 'dislike');
}

addReaction(comment: Commentaire, reactionType: string): void {
  const reactionData = {
      userId: this.userId,
      commentId: comment._id,
      reactionType: reactionType
  };

  this.commentService.addReactionToComment(comment._id, reactionData).subscribe(
      (response) => {
          if (reactionType === 'like') {
              comment.likes += 1;
          } else if (reactionType === 'dislike') {
              comment.dislikes += 1;
          }
          this.cdr.detectChanges();
      },
      (error) => console.error('Error adding reaction:', error)
  );
}

  getCourseDetails(courseId: string): void {
    this.courseService.getCourseById(courseId).subscribe(
      (response) => {
        this.courseDetails = response;
        this.getCourseSections(courseId); // Appeler la méthode pour récupérer les sections du cours
        console.log("course details:", this.courseDetails);
      },
      (error) => {
        console.error('Error fetching course details:', error);
      }
    );
  }

  getTeacherName(courseId: string): void {
    this.courseService.getTeacherNameByCourseId(courseId).subscribe(
      (response) => {
        this.teacherName = response.teacherName;
        console.log("Teacher name:", this.teacherName);
      },
      (error) => {
        console.error('Error fetching teacher name:', error);
      }
    );
  }
  
  getCourseSections(courseId: string): void {
    this.courseService.getCourseSections(courseId).subscribe(
      (sections) => {
        this.sections = sections; // Mettre à jour la liste des sections avec celles récupérées
        this.fetchLessonAndQuizzes(courseId); // Appeler la méthode pour récupérer les leçons et quizzes
        console.log("course sections:", this.sections);
      },
      (error) => {
        console.error('Error fetching course sections:', error);
      }
    );
  }
  fetchLessonAndQuizzes(courseId: string): void {
    this.sections.forEach(section => {
      // Pour chaque section, récupérez les leçons et les quizzes
      section.lessons = []; // Initialisez la liste des leçons
      section.quizzes = []; // Initialisez la liste des quizzes
  
      // Définissez les identifiants topicId et lessonId à partir de la section actuelle
      const topicId = section._id; // Utilisez une variable locale pour capturer la valeur de topicId
  
      console.log('topicId before fetch lessons:', topicId); // Ajout du console log
  
      this.topicService.getLessons(courseId, topicId).subscribe(
        (lessons) => {
          section.lessons = lessons; // Mettez à jour la liste des leçons pour cette section
          console.log("section lessons:", lessons);
        },
        (error) => {
          console.error('Error fetching lessons:', error);
        }
      );
  
      this.topicService.getQuizzes(courseId, topicId).subscribe(
        (quizzes) => {
          section.quizzes = quizzes; // Mettez à jour la liste des quizzes pour cette section
          console.log("section quizzes:", quizzes);
        },
        (error) => {
          console.error('Error fetching quizzes:', error);
        }
      );
    });
  }
  
    
    areScoresAvailable(): boolean {
      return this.quizScores && this.quizScores.length > 0;
    }
  // Méthode pour changer la vidéo lorsqu'une leçon est sélectionnée
  selectLesson(lessonId: string, topicId: string, transcription: string) {
    this.selectedLessonId = lessonId;
    this.loadLessonVideo(lessonId, topicId);
    this.readTranscription(transcription);
  }
  loadLessonVideo(lessonId: string, topicId: string) {
    console.log('Loading lesson video for lessonId:', lessonId);
    this.lessonService.getLessonById(topicId, lessonId).subscribe(
      (lesson: Lesson) => {
        console.log('Lesson details:', lesson);
        console.log('video:', lesson.videoUrl);
        this.currentVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(lesson.videoUrl) as SafeResourceUrl;
        this.initializeYoutubePlayer(this.extractVideoIdFromUrl(lesson.videoUrl));
  
        console.log('currentVideoUrl:', this.currentVideoUrl);
      },
      (error) => {
        console.error('Error fetching lesson:', error);
      }
    );
  } 
  
  onPlayerStateChange(event: any): void {
    if (event.data === YT.PlayerState.ENDED) {
      // Récupérez l'ID de l'utilisateur, l'ID de la leçon et la durée regardée
      const userId = this.userId;
      const lessonId = this.selectedLessonId;
      const watchedDuration = event.target.getDuration();
      
      // Appelez la méthode markLessonCompleted du service LessonService
      this.lessonService.markLessonCompleted(userId, lessonId, watchedDuration)
        .subscribe(
          () => {
            console.log('Leçon marquée comme terminée avec succès');
            // Ajoutez ici le traitement supplémentaire si nécessaire
          },
          error => {
            console.error('Erreur lors de la tentative de marquage de la leçon comme terminée :', error);
            // Gérez l'erreur ici
          }
        );
    }
  }
  

  initializeYoutubePlayer(videoId: string): void {
    // @ts-ignore: YT est défini dans le script de l'API Player YouTube Embed
    const player = new YT.Player('youtube-player', {
      height: '360',
      width: '640',
      videoId,
    });
  }
  extractVideoIdFromUrl(url: string): string {
    const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/);
  
    if (videoIdMatch && videoIdMatch[1]) {
      return videoIdMatch[1];
    } else {
      console.error('Invalid YouTube video URL:', url);
      return ''; // Retourner une valeur par défaut ou lancez une erreur selon le comportement souhaité
    }
  }
    // Méthode appelée lorsque l'utilisateur clique sur un quiz pour le démarrer
    onStartQuiz(topicId: string, quizId: string): void {
      // Naviguer vers le QuizComponent en incluant l'`id` du cours et du topic dans l'URL
      this.router.navigate(['teacher/course-content', this.courseId, 'quiz', topicId, quizId]);
      this.router.navigate(['learner/course-content', this.courseId, 'quiz', topicId, quizId]);
    }
    
 // Method to fetch lesson details using LessonService
 showTranscription(lessonId: string) {
  // Récupérer la transcription de la leçon à partir de son ID et la stocker dans selectedLessonTranscription
  this.lessonService.getLessonById(this.topicId, lessonId).subscribe(
    (lesson: Lesson) => {
      const selectedLessonTranscription = lesson.transcription;
      console.log('Transcription:', selectedLessonTranscription);
      return selectedLessonTranscription;
    },
    (error) => {
      console.error('Error fetching transcription:', error);
    }
  );
}
readTranscription(transcription: string): void {
  const utterance = new SpeechSynthesisUtterance(transcription);
  speechSynthesis.speak(utterance);
}

speakResponse(transcription: string) {
  if (this.isSpeaking) {
    window.speechSynthesis.cancel();
    this.isSpeaking = false;
  } else {
    const utterance = new SpeechSynthesisUtterance(transcription);
    window.speechSynthesis.speak(utterance);
    this.isSpeaking = true;
    utterance.onend = () => {
      this.isSpeaking = false;
    };
  }
}
pauseResponse(): void {
  window.speechSynthesis.pause();
}

resumeResponse(): void {
  window.speechSynthesis.resume();
}

cancelResponse(): void {
  window.speechSynthesis.cancel();
}
  onFileSelected(event: any) {
    this.myForm.patchValue({ resource: event.target.files[0] }); // Correspond au champ sectionFile
  }

  refreshSections() {
    this.courseService.getCourseSections(this.courseId).subscribe((sections: Topic[]) => {
      this.sections = sections;
    }, (error: any) => {
      console.error('Erreur lors du chargement des sections du cours:', error);
    });
  }

  addSectionToAddedSections(section: Topic) {
    this.addedSections.push(section);
  }


  like(): void {
    this.likes = 1;
    this.dislikes = 0;
  }

  dislike(): void {
    this.likes = 0;
    this.dislikes = 1;
  }
  addReview(courseId: string): void {
    if (this.newRating.stars > 0) {
      const reviewData = {
        stars: this.newRating.stars,
        tooltip: this.tooltips[this.newRating.stars - 1],
        courseId: this.courseId
      };

      this.courseService.addAvisToCourse(this.courseId, this.userId, this.newRating.stars.toString(), this.tooltips[this.newRating.stars - 1])
        .subscribe(avis => {
          if (!this.courseDetails.avis) {
            this.courseDetails.avis = [];
          }
          this.courseDetails.avis.push(avis);
          this.calculateRatings();
          this.newRating = { stars: 0, tooltip: '' };
          console.log("avis donné : ", avis);
        }, error => {
          console.error('Erreur lors de l\'ajout de l\'avis :', error);
        });
    }
  }
  calculateRatings(): void {
    const totalStars = this.courseDetails.avis.reduce((sum: number, avis: any) => sum + avis.stars, 0);
    this.totalStars = totalStars;
    this.averageRating = totalStars / this.courseDetails.avis.length;
  }
  getReviews(courseId: string): void {
    this.courseService.getTotalReviews(courseId).subscribe(response => {
      this.courseDetails.avis = response.avis;
      this.calculateRatings(); // Mettre à jour les statistiques des étoiles
    }, error => {
      console.error('Error fetching reviews:', error);
    });
  }
  
  calculatePercentage(vote: number): number {
    const totalVotes = this.getTotalVotes();
    if (totalVotes === 0) {
      return 0;
    }
    return (vote / totalVotes) * 100;
  }
  
  getTotalVotes(): number {
    let totalVotes = 0;
    // Parcourir tous les votes pour chaque étoile
    this.starVotes.forEach(vote => {
      totalVotes += vote;
    });
    return totalVotes;
  }
  
  getStarVotes(courseId: string): void {
    this.courseService.getStarVotes(courseId).subscribe(
      (starVotes: number[]) => {
        this.starVotes = starVotes;
      },
      (error) => {
        console.error('Error fetching star votes:', error);
      }
    );
  }
  addDescription() {
    // Récupérez le contenu du nouveau panneau depuis le champ de contenu du formulaire
    const newDescription = this.newDescription;
    
    // Ajoutez un nouveau panneau avec le nom, le contenu et les informations sur le fichier saisis
    const Apropos = {
      title: this.newTitle,
      description: newDescription,
    };
    this.tabs.push(Apropos);
  }
  getStudentProgress(): void {
    this.courseService.getStudentProgress(this.courseId, this.userId).subscribe(
      (data: any) => {
        this.progressPercentage = parseFloat(data.progress);
      },
      (error: any) => {
        console.error('Error fetching student progress:', error);
      }
    );
  }
  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isZoomControlsVisible = scrollPosition < 100; // Masque les contrôles si on a défilé de plus de 100px
  }

  formatOne = (percent: number): string => `${percent}%`;
  formatTwo = (): string => `Done`;

  zoomIn() {
    this.zoomLevel += 0.1;
  }

  zoomOut() {
    if (this.zoomLevel > 0.1) {
      this.zoomLevel -= 0.1;
    }
  }

  resetZoom() {
    this.zoomLevel = 1; // Réinitialiser le niveau de zoom par défaut
  }
} 