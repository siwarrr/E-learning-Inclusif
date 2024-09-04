import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Reclamation } from 'src/app/models/reclam.model';
import { User } from 'src/app/models/user.model';
import { AdminApisService } from 'src/app/services/admin-apis.service';

@Component({
  selector: 'app-reclamations',
  templateUrl: './reclamations.component.html',
  styleUrls: ['./reclamations.component.css']
})
export class ReclamationsComponent implements OnInit{

  reclamations: Reclamation[] = []
  responseMessage: string = '';
  responseText: string = '';
  showSuccessMessage: boolean = false;

  constructor(private adminApisService: AdminApisService,
              private message: NzMessageService
  ){}

  ngOnInit(): void {
    this.getListReclam();
  }


  getListReclam(): void {
    this.adminApisService.getAllReclamations().subscribe(
      (data: Reclamation[]) => {
        this.reclamations = data.map(reclamation => {
          const user = reclamation.user as User;
          console.log("Handicap Type for:", user.handicapType);
          return {
            ...reclamation,
            handicapType: user.handicapType
          };
        });
        console.log("Reclamations with Handicap Types:", this.reclamations);
      },
      (error) => {
        console.error("Error fetching reclamations:", error);
      }
    );
  }  

  replay(reclamId: string): void {
    const response = this.responseText;
    this.adminApisService.respondToReclamation(reclamId, response).subscribe(
      () => {
        console.log("Response sent successfully");
        this.responseMessage = '';
        this.message.create(this.responseMessage,`Response sent successfully`);
        
        this.responseText = ''; // Clear the response textarea
        this.getListReclam(); // Refresh reclamations list after response
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000); // Hide the success message after 3 seconds
      },
      (error) => {
        console.error("Error sending response:", error);
        // Handle error
      }
    );
  }

  toggleReplying(reclam: Reclamation): void {
    reclam.replying = !reclam.replying;
  }
  
}
