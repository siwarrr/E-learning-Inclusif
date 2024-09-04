import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Lesson } from 'src/app/models/lesson.model';
import { CourseService } from 'src/app/services/course.service';
import { LessonService } from 'src/app/services/lesson.service';
declare var YT: any; // Déclaration de YT pour éviter les erreurs de compilation TypeScript

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent implements OnInit{

  @Input() videoUrl: string | SafeResourceUrl = '';
  courseId: string = '';
  topicId: string = '';
  lessonId: string = '';
  
  constructor(private lessonService: LessonService,
              private courseService: CourseService,
              private route: ActivatedRoute,
  ){}

  ngOnInit(): void {
    this.loadYoutubePlayerAPI();
  }

  loadYoutubePlayerAPI(): void {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }

  initializeYoutubePlayer(videoUrl: string): void {
    // Extraire l'ID de la vidéo YouTube à partir de l'URL
    const videoId = this.extractVideoIdFromUrl(videoUrl);

    // @ts-ignore: YT est défini dans le script de l'API Player YouTube Embed
    const player = new YT.Player('youtube-player', {
      height: '360',
      width: '640',
      videoId,
    });
  }

  extractVideoIdFromUrl(url: string): string {
    // Extraire l'ID de la vidéo YouTube de l'URL
    const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/);

    if (videoIdMatch && videoIdMatch[1]) {
      return videoIdMatch[1];
    } else {
      console.error('Invalid YouTube video URL:', url);
      return ''; // Retourner une valeur par défaut ou lancez une erreur selon le comportement souhaité
    }
  }
  
}
