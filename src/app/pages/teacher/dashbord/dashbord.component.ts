import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzDrawerPlacement } from 'ng-zorro-antd/drawer';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTabPosition } from 'ng-zorro-antd/tabs';
import { Observable } from 'rxjs';
import { Commentaire } from 'src/app/models/comment.model';
import { Course } from 'src/app/models/course.model';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent implements OnInit, AfterViewInit {

  userId$!: Observable<string>;
  courses: Array<{ id: string; title: string; content: string; disabled: boolean; participants: number }> = [];
  nzTabPosition: NzTabPosition = 'left';
  selectedIndex = 0;
  selectedCourse: any | null = null;
  quizScores: any[] = [];
  loading = false;
  comments: Commentaire[] = [];
  commentId: string = '';
  
  visible = false;
  placement: NzDrawerPlacement = 'bottom';
  currentReplies: Commentaire[] = [];
  confirmModal?: NzModalRef; // For testing by now

  
  constructor(private authService: AuthService,
              private courseService: CourseService,
              private commentService: CommentService,
              private modal: NzModalService,
              private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.userId$ = this.authService.getCurrentUser();
    this.getRepliesForComment(this.commentId);
  }

  ngAfterViewInit(): void {
    this.userId$.subscribe(
      (userId: string) => {
        this.getTeacherCourses(userId);
      },
      (error: any) => {
        console.error('Error getting current user ID:', error);
      }
    );
  }

  getTeacherCourses(teacherId: string): void {
    this.courseService.getTeacherCourses(teacherId).subscribe(
      (response: Course[]) => {
        this.courses = response.map(course => ({
          id: course._id,
          title: course.title,
          disabled: false,
          content: '',
          participants: course.students.length
        }));

        if (this.courses.length > 0) {
          this.onTabSelect(this.courses[0]);
        }

        this.cdr.detectChanges();
      },
      (error: any) => {
        console.error('Error fetching teacher courses:', error);
      }
    );
  }

  onTabSelect(course: any): void {
    this.selectedCourse = course;
    this.getQuizScores(course.id);
    this.loadComments(course.id);
  }  

  getQuizScores(courseId: string): void {
    this.courseService.getQuizScoresForCourse(courseId).subscribe(
      (response: any[]) => {
        this.quizScores = Array.isArray(response) ? response : [];

        this.quizScores = this.quizScores.map(quizData => ({
          quiz: quizData.quiz,
          students: Array.isArray(quizData.students) ? quizData.students : []
        }));

        console.log("quiz scores: ", this.quizScores);
      },
      (error: any) => {
        console.error('Error fetching quiz scores:', error);
      }
    );
  }

  loadComments(courseId: string): void {
    console.log("Fetching comments for courseId:", courseId);
    this.commentService.getComments(courseId).subscribe(
      (response: any) => {
        console.log("Raw comments data received:", response);
  
        if (response && response.success && Array.isArray(response.comments)) {
          this.comments = response.comments;
        } else {
          this.comments = [];
        }
  
        console.log("Parsed comments:", this.comments);
        this.comments.forEach(comment => this.getRepliesForComment(comment._id));
  
        this.cdr.detectChanges();
        console.log("comments loaded and change detection triggered: ", this.comments);
      },
      (error) => {
        console.error('Erreur lors de la récupération des commentaires', error);
      }
    );
  }  

  getRepliesForComment(commentId: string): void {
    this.commentService.getReplies(commentId).subscribe(
      (replies: Commentaire[]) => {
        console.log("Réponses sur le commentaire :", replies);
      },
      (error: any) => {
        console.error("Erreur lors de la récupération des réponses :", error);
      }
    );
  }
  deleteComment(commentId: string): void {
    this.commentService.deleteComment(commentId).subscribe(
      () => {
        console.log('Comment deleted successfully');
        // Retirer le comment supprimé de la liste des comments
        this.comments = this.comments.filter(comment => comment._id !== commentId);
      },
      error => {
        console.error('Error deleting comment:', error);
        // Affichez un message d'erreur à l'utilisateur ou effectuez d'autres actions nécessaires en cas d'erreur
      }
    );
  }
  showConfirm(teacherId: string): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete this item?',
      nzContent: 'When clicked the OK button, this dialog will be closed after 1 second',
      nzOnOk: () =>
        new Promise<void>((resolve, reject) => {
          this.deleteComment(teacherId);
          setTimeout(() => {
            resolve();
          }, 1000);
        }).catch(() => console.log('Oops errors!'))
    });
  }
  onTabDeselect(course: any): void {
    this.selectedCourse = null;
  }  
  open(commentId: string): void {
    this.commentService.getReplies(commentId).subscribe(
      (response: any) => {
        console.log("Réponses sur le commentaire :", response);
        if (response && response.success && Array.isArray(response.replies)) {
          this.currentReplies = response.replies;
        } else {
          this.currentReplies = [];
        }
        this.visible = true;
        this.cdr.detectChanges();  // Forcer la détection des changements
        console.log("currentReplies:", this.currentReplies);

        console.log("currentReplies set to:", this.currentReplies);
      },
      (error: any) => {
        console.error("Erreur lors de la récupération des réponses :", error);
      }
    );
  }

  close(): void {
    this.visible = false;
  }
}
