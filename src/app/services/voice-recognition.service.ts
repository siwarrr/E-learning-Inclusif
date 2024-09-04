import { Injectable } from '@angular/core';

declare var webKitSpeechRecognition:any

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {

  recognition: any;
  transcript: string = '';

  constructor() {
    const { webkitSpeechRecognition }: IWindow = <IWindow><unknown>window;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {
      const transcriptChunk = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      this.transcript = transcriptChunk;
    };

    this.recognition.onerror = (event: any) => {
      console.error('Recognition error:', event.error);
    };
  }

  init() {
    this.transcript = '';
  }

  start(lang: string = 'en-US') {
    this.recognition.lang = lang;
    this.recognition.start();
  }

  stop() {
    this.recognition.stop();
  }

  getTranscript() {
    return this.transcript;
  }

  resetTranscript() {
    this.transcript = '';
  }
}

interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

/*  recognitionFr: any;
  recognitionEn: any;
  recognitionAr: any;
  activeRecognition: any;
  isStoppedSpeechRecog = false;
  public text = '';
  tempWords: string | undefined;

  constructor() { 
    this.init();
  }

  init() {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      // Initialize SpeechRecognition for French
      this.recognitionFr = new SpeechRecognition();
      this.recognitionFr.lang = 'fr-FR';
      this.configureRecognition(this.recognitionFr);

      // Initialize SpeechRecognition for English
      this.recognitionEn = new SpeechRecognition();
      this.recognitionEn.lang = 'en-US';
      this.configureRecognition(this.recognitionEn);

      // Initialize SpeechRecognition for Arabic
      this.recognitionAr = new SpeechRecognition();
      this.recognitionAr.lang = 'ar-SA';
      this.configureRecognition(this.recognitionAr);
    } else {
      console.error('Speech recognition not supported in this browser.');
    }
  }

  configureRecognition(recognition: any) {
    recognition.interimResults = true;

    recognition.addEventListener('result', (e: any) => {
      const transcript = Array.from(e.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      this.tempWords = transcript;
      console.log(transcript);
    });

    recognition.addEventListener('end', () => {
      if (this.isStoppedSpeechRecog) {
        recognition.stop();
        console.log("End speech recognition");
      } else {
        this.wordConcat();
        recognition.start();
      }
    });
  }

  start(lang: string) {
    this.isStoppedSpeechRecog = false;
    if (lang === 'en') {
      this.activeRecognition = this.recognitionEn;
    } else if (lang === 'fr') {
      this.activeRecognition = this.recognitionFr;
    } else if (lang === 'ar') {
      this.activeRecognition = this.recognitionAr;
    }
    if (this.activeRecognition) {
      this.activeRecognition.start();
      console.log("Speech recognition started in " + lang);
    }
  }

  stop() {
    this.isStoppedSpeechRecog = true;
    if (this.activeRecognition) {
      this.wordConcat();
      this.activeRecognition.stop();
      console.log("End speech recognition");
    }
  }

  wordConcat() {
    this.text = this.text + ' ' + this.tempWords ;
    this.tempWords = '';
  }

  getTranscript(): string {
    return this.text.trim();
  }

  resetTranscript(): void {
    this.text = '';
  }
}*/
