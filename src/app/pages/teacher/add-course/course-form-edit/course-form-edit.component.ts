import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Topic } from 'src/app/models/topic.model';
import { CourseSpaceService } from 'src/app/services/course-space.service';
import { CourseService } from 'src/app/services/course.service';
import { TopicService } from 'src/app/services/topic.service';
import { CourseSectionComponent } from '../course-section/course-section.component';
import { Course } from 'src/app/models/course.model';

@Component({
  selector: 'app-course-form-edit',
  templateUrl: './course-form-edit.component.html',
  styleUrls: ['./course-form-edit.component.css']
})
export class CourseFormEditComponent implements OnInit{
  @Output() topicsData = new EventEmitter<any>();

  @ViewChild(CourseSectionComponent)
  private courseSectionComponent!: CourseSectionComponent;
  
  size: NzButtonSize = 'small';

  visible = false;
  formData: any = {};
  errorMessage: string = '';
  courseSpaces: any[] = [];
  topics: Topic[] = [];

  courseId: string = ''; 

  sectionData: { topics: Topic[] } = { topics: [] };
  courseForm: FormGroup = new FormGroup({});

  constructor(private router: Router,
    private route: ActivatedRoute, 
    private formBuilder: FormBuilder,
    private courseService: CourseService, 
    private courseSpaceService: CourseSpaceService,
    private topicService: TopicService,
    private msg: NzMessageService
    ) { 

  }
  
  ngOnInit(): void {
    this.getCourseSpaces(); // Appelez cette méthode lors de l'initialisation du composant pour charger les espaces de cours disponibles
    const courseToEdit = this.courseService.getCourseToEdit();
    // Créez le formulaire réactif avec FormBuilder dans la méthode ngOnInit()
    this.courseId = this.route.snapshot.params['courseId'];
    if (this.courseId) {
      // Si un courseId est présent dans l'URL, récupérez les détails du cours à éditer
      this.getCourseDetails(this.courseId);
    }

    // Initialisez le formulaire
    this.courseForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      courseSpace: ['', Validators.required],
      imageUrl: ['']
    });
  
    // Créez un FormGroup pour encapsuler les champs du formulaire réactif
    this.courseForm = this.formBuilder.group({
      title: [this.formData.title || '', Validators.required],
      description: [this.formData.description || '', Validators.required],
      courseSpace: [this.formData.courseSpace || '', Validators.required],
      imageUrl: ['']
    });
  
    this.prepareSectionData();
    this.sendTopicsData();
  }
  // Méthode pour récupérer les données des topics avec les leçons et quizzes
  sendTopicsData() {
    this.courseService.getCourseSections(this.courseId).subscribe(
      topicsData => {
        console.log('Topics Data Before Emitting:', topicsData); // Log avant l'émission de l'événement
        this.topicsData.emit(topicsData);
        console.log('Topics Data After Emitting:', topicsData); // Log après l'émission de l'événement
      },
      error => {
        console.error('Error fetching topics data:', error);
      }
    );
  }
  // Méthode pour mettre à jour les données de la deuxième section
onSectionDataChange(newSectionData: any): void {
  this.sectionData = newSectionData;
}
  prepareSectionData(): void {
    this.courseService.getCourseSections(this.courseId).subscribe(
      (sectionsData: any[]) => {
        // Supposons que vous devez mapper les données de 'sectionsData' vers une instance de 'Course'
        const courseData: Course = {
          _id: '', // Remplissez les autres champs selon les données reçues
          title: '',
          description: '',
          sections: sectionsData,
          teacher: '',
          courseSpace: {},
          commentaires: '',
          avis: '',
          students: [],
          __v: 0
        };
        const sectionData = {
          topics: courseData.sections
        };
        this.sectionData = sectionData;

        this.topics = courseData.sections;
        console.log('Topics:', this.topics);

      },
      (error) => {
        console.error('Error fetching sections data:', error);
      }
    );
  }
  
  // Méthode pour charger les espaces de cours disponibles
  getCourseSpaces(): void {
    this.courseSpaceService.getAllCourseSpaces().subscribe(
      response => {
        this.courseSpaces = response; // Stockez les espaces de cours dans la propriété
      },
      error => {
        console.error('Error fetching course spaces:', error);
      }
    );
  }
  getCourseDetails(courseId: string): void {
    this.courseService.getCourseById(courseId).subscribe(
      (response) => {
        this.formData = response; // Initialisez formData avec les détails du cours récupérés
        // Pré-remplissez les champs du formulaire avec les données du cours à éditer
        this.courseForm.patchValue({
          title: this.formData.title,
          description: this.formData.description,
          courseSpace: this.formData.courseSpace,
          imageUrl: this.formData.imageUrl,
          // Assurez-vous d'ajouter d'autres champs du formulaire si nécessaire
        });
      },
      (error) => {
        console.error('Error fetching course details:', error);
      }
    );
  }
  
 // Méthode appelée lorsque l'utilisateur clique sur "Save" dans la première section
 save() {
  // Vérifiez la validité du formulaire
  if (this.courseForm.invalid) {
    this.msg.error('Please fill in all required fields.');
    return;
  }

  const formData = this.courseForm.value;
  // Sauvegardez les données localement sans l'ID du cours
  console.log('Data saved locally:', formData);
}
 // Méthode appelée lorsque l'utilisateur clique sur "Publish"
 publishCourse(courseData: any) {
  
  // Combinez les données de la première et de la deuxième section
  const combinedData = {
    ...this.courseForm.value, // Données de la première section
    sectionData: this.sectionData // Données de la deuxième section
  };
  // Récupérez l'identifiant ObjectId de l'espace de cours sélectionné
  const selectedSpace = this.courseSpaces.find(space => space.title === courseData.courseSpace);
  if (selectedSpace) {
    combinedData.courseSpace = selectedSpace._id; // Utilisez l'identifiant ObjectId pour le champ courseSpace
  }
  
  // Appelez la méthode pour créer le cours dans la base de données avec les données combinées
  this.courseService.createCourse(combinedData).subscribe(
    response => {
      console.log('Course created successfully:', response);
      this.router.navigate(['/teacher/courses']);
    },
    error => {
      console.error('Error creating course:', error);
    }
  );
}
// Méthode appelée lorsque l'utilisateur clique sur "Update"
updateCourse(courseId: string, formData: any): void {
  // Rassemblez les données nécessaires pour mettre à jour le cours
  const combinedData = {
    ...formData, // Données du formulaire
    // Autres données nécessaires pour la mise à jour du cours
  };

  // Appelez la méthode updateCourse du service CourseService
  this.courseService.updateCourse(courseId, combinedData).subscribe(
    (response) => {
      console.log('Course updated successfully:', response);
      this.router.navigate(['/teacher/courses']);
      // Effectuez d'autres actions nécessaires après la mise à jour du cours
    },
    (error) => {
      console.error('Error updating course:', error);
      // Affichez un message d'erreur à l'utilisateur ou effectuez d'autres actions nécessaires en cas d'erreur
    }
  );
}
}
