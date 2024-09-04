import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from 'src/app/services/auth.service';
import { CourseService } from 'src/app/services/course.service';
import { VoiceRecognitionService } from 'src/app/services/voice-recognition.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  messages: string[] = [];
  newMessage: string = '';

  @Output() chatbotClosed = new EventEmitter<void>();
  @ViewChildren('messageElement') messageElements!: QueryList<ElementRef>;

  audioFile: File | null = null;
  isRecording: boolean = false;
  mediaRecorder: any;
  audioChunks: any[] = [];
  userId: string = '';
  isModalVisible: boolean = false;  // Variable pour suivre l'état du modal

  recognition: any;
  transcript: string = '';
  selectedLanguage: string = 'en'; 

  constructor(private http: HttpClient,
              private voiceRecognitionService: VoiceRecognitionService,
              private authService: AuthService,
              private modal: NzModalService,
              private translateService: TranslateService,
              private courseService: CourseService,
              private router: Router,
              private renderer: Renderer2,
              private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
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
    this.voiceRecognitionService.init();

    window.speechSynthesis.onvoiceschanged = () => {
      this.listVoices();
    };
    this.listVoices();
  }
    
  listVoices(): void {
    const voices = window.speechSynthesis.getVoices();
    console.log('Available voices:', voices);
  }  
  
  ngAfterViewChecked(): void {
    this.messageElements.forEach((messageElement: ElementRef) => {
        const links = messageElement.nativeElement.querySelectorAll('a');
        links.forEach((link: HTMLAnchorElement) => {
            const href = link.href;
            const courseIdMatch = href.match(/course-content\/([a-zA-Z0-9]+)/);

            if (courseIdMatch && courseIdMatch[1]) {
                const courseId = courseIdMatch[1];
                const responseText = this.messages.join(' ');
                const containsEnrollmentInfo = this.containsEnrollmentInfo(responseText);

                if (!containsEnrollmentInfo) {
                    // Si la réponse ne contient pas d'information d'inscription, rediriger directement
                    this.renderer.listen(link, 'click', (event) => {
                        event.preventDefault();
                        this.router.navigate(['/learner/course-content', courseId]);
                    });
                } else {
                    // Vérification de l'inscription normale basée sur la méthode checkEnrollment
                    const enrolled = this.checkEnrollment(this.messages, courseId);
                    if (enrolled) {
                        this.renderer.listen(link, 'click', (event) => {
                            event.preventDefault();
                            this.router.navigate(['/learner/course-content', courseId]);
                        });
                    } else {
                        this.renderer.listen(link, 'click', (event) => {
                            event.preventDefault();
                            if (!this.isModalVisible) {
                                this.isModalVisible = true;
                                this.showConfirm(courseId);
                            }
                        });
                    }
                }
            }
        });
    });
}

containsEnrollmentInfo(responseText: string): boolean {
    const enrollmentPhrases = [
        'You are enrolled in this course.',
        'You are not enrolled in this course.',
        'Vous êtes inscrit à ce cours.',
        'Vous n\'êtes pas inscrit à ce cours.',
        'لقد سجلت في هذه الدورة.',
        'لم تسجل في هذه الدورة',
        'لم تقم بالتسجيل في هذه الدورة.'
    ];
    
    return enrollmentPhrases.some(phrase => responseText.includes(phrase));
}

  closeChatbot() {
    this.chatbotClosed.emit();
  }

  speakResponse(response: string) {
    console.log('Trying to speak:', response);
    window.speechSynthesis.cancel();
  
    const responseWithoutLinks = response.replace(/<a [^>]*>([^<]+)<\/a>/g, '$1');
    const sentences = responseWithoutLinks.split(/[\n.]+/);
  
    sentences.forEach(sentence => {
      if (sentence.trim()) {
        const utterance = new SpeechSynthesisUtterance(sentence);
        const userLanguage = this.detectLanguage(sentence);
        utterance.lang = this.getLangCode(userLanguage);
  
        // Find and set the voice based on the language
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(voice => voice.lang === utterance.lang);
        if (voice) {
          utterance.voice = voice;
        }
  
        utterance.onend = () => {
          console.log('Speech synthesis finished.');
        };
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
        };
  
        window.speechSynthesis.speak(utterance);
      }
    });
  }
  
  getLangCode(detectedLang: string): string {
    const langMap: { [key: string]: string } = {
      english: 'en-US',
      french: 'fr-FR',
      arabic: 'ar-SA',
    };
    return langMap[detectedLang] || 'en-US';
  }   

  detectLanguage(text: string): string {
    const lowerCaseText = text.toLowerCase();
    const languageKeywords: { [key: string]: string } = {
      'the': 'english',
      'and': 'english',
      'le': 'french',
      'la': 'french',
      'et': 'french',
      'ou': 'french',
      'ال': 'arabic',
      'و': 'arabic',
      'في': 'arabic',
      'السلام': 'arabic',
      'مرحبا': 'arabic',
    };
  
    for (const keyword in languageKeywords) {
      if (lowerCaseText.includes(keyword)) {
        return languageKeywords[keyword];
      }
    }
  
    return 'english';
  }  

  startRecording(): void {
    const languageCode = this.getLanguageCode(this.selectedLanguage);
    this.voiceRecognitionService.start(languageCode);
  }
  
  getLanguageCode(language: string): string {
    switch(language) {
      case 'fr':
        return 'fr-FR';
      case 'ar':
        return 'ar-SA';
      case 'en':
      default:
        return 'en-US';
    }
  }  

  stopRecording(): void {
    this.voiceRecognitionService.stop();
    this.transcript = this.voiceRecognitionService.getTranscript();
    this.voiceRecognitionService.resetTranscript();
    if (this.transcript.trim()) {
      this.sendVoiceMessage(this.transcript);
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.keyCode === 13) {
      event.preventDefault();  // Empêche l'action par défaut de la touche Enter
      event.stopPropagation(); // Empêche la propagation de l'événement à d'autres éléments
      this.sendMessage();
    }
  }  
  
  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push('User: ' + this.newMessage);
      this.http.post<any>('http://localhost:3000/send-message', { message_text: this.newMessage, user_id: this.userId }).subscribe(
        response => {
          console.log('Response from server:', response);
          if (response && response.responses && response.responses.length > 0) {
            let responseMessage = 'ChatBot: ';
            response.responses.forEach((botResponse: any, index: number) => {
              if (botResponse.text) {
                responseMessage += botResponse.text;
                if (index < response.responses.length - 1) {
                  responseMessage += '\n';
                }
              }
            });
            const transformedMessage = this.transformLinks(responseMessage, response.responses);
            this.messages.push(transformedMessage);
            this.speakResponse(transformedMessage.replace('ChatBot: ', ''));
          } else {
            console.error('Error: Invalid API response format');
          }
        },
        error => {
          console.error('Error sending message to backend:', error);
        }
      );
      this.newMessage = '';
    }
  }
  
  sendVoiceMessage(transcript: string): void {
    this.messages.push('User: ' + transcript);
    this.http.post<any>('http://localhost:3000/send-message', { message_text: transcript, user_id: this.userId }).subscribe(
      response => {
        console.log('Response from server:', response);
        if (response && response.responses && response.responses.length > 0) {
          let responseMessage = 'ChatBot: ';
          response.responses.forEach((botResponse: any, index: number) => {
            if (botResponse.text) {
              responseMessage += botResponse.text;
              if (index < response.responses.length - 1) {
                responseMessage += '\n';
              }
            }
          });
          const transformedMessage = this.transformLinks(responseMessage, response.responses);
          this.messages.push(transformedMessage);
          this.speakResponse(transformedMessage.replace('ChatBot: ', ''));
        } else {
          console.error('Error: Invalid API response format');
        }
      },
      error => {
        console.error('Error sending message to backend:', error);
      }
    );
  }  
 

  transformLinks(message: string, responses: any[]): string {
    console.log('Original message:', message);
    const courseLinkRegex = /<a href="http:\/\/localhost:4200\/learner\/course-content\/(.*?)">click here<\/a>/g;
    const transformedMessage = message.replace(courseLinkRegex, (match, courseId) => {
        const enrolled = this.checkEnrollment(responses, courseId);
        const link = enrolled
            ? `<a href="http://localhost:4200/learner/course-content/${courseId}" class="course-link" data-course-id="${courseId}" data-enrolled="true">click here</a>`
            : `<a href="#" class="course-link" data-course-id="${courseId}" data-enrolled="false">click here to participate</a>`;
        console.log('Generated link:', link);
        return link;
    });

    console.log('Transformed message:', transformedMessage);
    return transformedMessage;
}



checkEnrollment(messages: string[], courseId: string): boolean {
  return messages.some(message => 
      message.includes(`course-content/${courseId}`) && 
      message.includes('You are enrolled in this course.')||
      message.includes('Vous êtes inscrit à ce cours.')||
      message.includes('لقد سجلت في هذه الدورة.')
  );
}


  handleCourseLinkClick(courseId: string, enrolled: boolean) {
    console.log(`handleCourseLinkClick called with courseId: ${courseId}, enrolled: ${enrolled}`);
    if (enrolled) {
      this.router.navigate(['/learner/course-content', courseId]);
    } else {
      if (!this.isModalVisible) {
        this.isModalVisible = true;
        this.showConfirm(courseId);
      }
    }
  }  

  showConfirm(courseId: string): void {
    this.translateService.get('Do you want to participate in this course?').subscribe((translatedMessage: string) => {
      this.modal.confirm({
        nzTitle: translatedMessage,
        nzOnOk: () => {
          const userId = this.userId;
          if (userId && courseId) {
            this.courseService.registerForCourse(courseId, userId).subscribe(
              () => {
                console.log('Successfully enrolled in the course!');
                this.router.navigate(['/learner/course-content', courseId]);
                this.isModalVisible = false;
              },
              (error) => {
                console.error('Error registering for course:', error);
                this.isModalVisible = false;
              }
            );
          } else {
            console.error('User ID or Course ID not found');
            this.isModalVisible = false;
          }
        },
        nzOnCancel: () => {
          this.isModalVisible = false;
        }
      });
    });
  }
  pauseSpeech(): void {
    window.speechSynthesis.pause();
  }

  resumeSpeech(): void {
    window.speechSynthesis.resume();
  }

  cancelSpeech(): void {
    window.speechSynthesis.cancel();
  }
}

 /*sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push('User: ' + this.newMessage);
      this.http.post<any>('http://localhost:3000/send-message', { message_text: this.newMessage }).subscribe(
        response => {
          console.log('Response from server:', response);
          if (response && response.responses && response.responses.length > 0) {
            let responseMessage = 'ChatBot: ';
            response.responses.forEach((botResponse: any, index: number) => {
              if (botResponse.text) {
                responseMessage += botResponse.text;
                // Add a new line if it's not the last item
                if (index < response.responses.length - 1) {
                  responseMessage += '\n';
                }
              }
            });
            this.messages.push(responseMessage);
            // Speak the response after pushing to messages
            this.speakResponse(responseMessage.replace('ChatBot: ', ''));
          } else {
            console.error('Error: Invalid API response format');
          }
        },
        error => {
          console.error('Error sending message to backend:', error);
          // Handle specific error cases here, e.g., show a notification to the user
        }
      );
      this.newMessage = '';
    }
  }*/