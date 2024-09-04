import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, Observable, Subject, catchError, of, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AdminApisService } from 'src/app/services/admin-apis.service';

@Component({
  selector: 'app-teachers-list',
  templateUrl: './teachers-list.component.html',
  styleUrls: ['./teachers-list.component.css']
})
export class TeachersListComponent implements OnInit {

  confirmModal?: NzModalRef; // For testing by now
  teachers: any[] = [];
  teacherCoursesCount: any = {};
  teacherId: string = '';
  teacherNames: string[] = [];

  constructor(private modal: NzModalService,
              private adminApisService: AdminApisService,
              private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getTeacherNames();
    this.getTeachers();  
  }
  getTeacherNames(): void {
    this.http.get<any>('http://localhost:3000/api/admins/teachers')
      .subscribe(data => {
        const teachers = data.filter((user: { role: string; }) => user.role === "teacher");
        this.teacherNames = teachers.map((teacher: { fullname: any; }) => teacher.fullname);
      }); 
  }


  getTeachers(): void {
    this.adminApisService.getListTeachers().subscribe(
      (teachers) => {
        this.teachers = teachers;
        this.loadCoursesCountForEachTeacher();
      },
      (error) => {
        console.error('Error fetching teachers:', error);
      }
    );
  }

  loadCoursesCountForEachTeacher(): void {
    for (const teacher of this.teachers) {
      this.adminApisService.getCoursesCountByTeacher(teacher._id).subscribe(
        (coursesCount) => {
          console.log("coursesCount for teacher", teacher.fullname, ":", coursesCount);
          // Stocker le nombre de cours avec la clé teacher._id
          if (coursesCount && coursesCount !== undefined) {
            this.teacherCoursesCount[teacher._id] = coursesCount;
            console.log("teacherCoursesCount after update:", this.teacherCoursesCount); // Ajout du log
          } else {
            this.teacherCoursesCount[teacher._id] = 0; // Définir à 0 si aucune donnée n'est disponible
          }
        },
        (error) => {
          console.error('Error fetching courses count for teacher', teacher.fullname, ':', error);
        }
      );
    }
  } 

  searchValue = '';
  visible = false;
  listOfData: any[] = [
    {
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    },
    {
      name: 'Jim Red',
      age: 32,
      address: 'London No. 2 Lake Park'
    }
  ];
  listOfDisplayData = [...this.listOfData];

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfData.filter((item: any) => item.name.indexOf(this.searchValue) !== -1);
  }
  deleteTeacher(teacherId: string): void {
    this.adminApisService.deleteTeacher(teacherId).subscribe(
      () => {
        console.log('Teacher deleted successfully');
        this.teachers = this.teachers.filter(teacher => teacher._id !== teacherId);
      },
      error => {
        console.error('Error deleting teacher:', error);
      }
    );
  }
  
  showConfirm(teacherId: string): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete this item?',
      nzContent: 'When clicked the OK button, this dialog will be closed after 1 second',
      nzOnOk: () =>
        new Promise<void>((resolve, reject) => {
          this.deleteTeacher(teacherId);
          setTimeout(() => {
            resolve();
          }, 1000);
        }).catch(() => console.log('Oops errors!'))
    });
  }
   
}


 