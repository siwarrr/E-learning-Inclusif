import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SessionexpiredService } from 'src/app/services/sessionexpired.service';

@Component({
  selector: 'app-session-expired-modal',
  templateUrl: './session-expired-modal.component.html',
  styleUrls: ['./session-expired-modal.component.css']
})
export class SessionExpiredModalComponent implements OnInit {
  isVisible = false;

  constructor(private router: Router, private sessionExpiredService: SessionexpiredService) {}

  ngOnInit(): void {
    this.sessionExpiredService.onSessionExpired().subscribe(() => {
      this.isVisible = true;
    });
  }

  handleOk(): void {
    this.isVisible = false;
    this.router.navigate(['/welcome/login']);
  }

  handleCancel(): void {
    this.isVisible = false;
    this.router.navigate(['/welcome/login']);
  }
}
