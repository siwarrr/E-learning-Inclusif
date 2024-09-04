import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AdminApisService } from 'src/app/services/admin-apis.service';

@Component({
  selector: 'app-learners-list',
  templateUrl: './learners-list.component.html',
  styleUrls: ['./learners-list.component.css']
})
export class LearnersListComponent implements OnInit {

  confirmModal?: NzModalRef;
  learners: any[] = [];
  learnerCoursesCount: any = {};
  searchValue = '';
  visible = false;


  constructor(
    private modal: NzModalService,
    private adminApisService: AdminApisService
  ) {}

  ngOnInit(): void {
    this.getLearners();
    this.getLearnersCoursesCount();
  }

  getLearners(): void {
    this.adminApisService.getListLearners().subscribe(
      (learners) => {
        this.learners = learners;
      },
      (error) => {
        console.error('Error fetching learners:', error);
      }
    );
  }

  getLearnersCoursesCount(): void {
    this.adminApisService.getLearnersCoursesCount().subscribe(
      (coursesCount) => {
        // Stocker le nombre de cours pour chaque étudiant dans learnerCoursesCount
        coursesCount.forEach((count: any) => {
          this.learnerCoursesCount[count._id] = count.coursesCount;
        });
      },
      (error) => {
        console.error('Error fetching learners courses count:', error);
      }
    );
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;

    // Filter learners based on searchValue
  }

  deleteLearner(studentId: string): void {
    this.adminApisService.deleteLearner(studentId).subscribe(
      () => {
        console.log('Learner deleted successfully');
        this.learners = this.learners.filter(learner => learner._id !== studentId);
        delete this.learnerCoursesCount[studentId];
      },
      error => {
        console.error('Error deleting learner:', error);
      }
    );
  }

  showConfirm(studentId: string): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete this item?',
      nzContent: 'When clicked the OK button, this dialog will be closed after 1 second',
      nzOnOk: () =>
        new Promise<void>((resolve, reject) => {
          this.deleteLearner(studentId);
          setTimeout(() => {
            resolve();
          }, 1000);
        }).catch(() => console.log('Oops errors!'))
    });
  }
}
