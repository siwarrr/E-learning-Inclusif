import { Component, OnInit } from '@angular/core';
import { AdminApisService } from 'src/app/services/admin-apis.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit{

  teacherPercentage!: number;
  studentPercentage!: number;

  constructor( private adminApisService: AdminApisService) {}

  ngOnInit(): void {
    this.adminApisService.getPlatformStatistics().subscribe((response: any) => {
      this.teacherPercentage = response.teacherPercentage;
      this.studentPercentage = response.studentPercentage;
    });  }

}
