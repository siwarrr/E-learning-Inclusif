import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[lessonExerciseControl]', // Sélecteur de la directive
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LessonExerciseDirective),
      multi: true
    }
  ]
})
export class LessonExerciseDirective implements ControlValueAccessor {
  constructor(private elementRef: ElementRef) {}

  // Implémentation de ControlValueAccessor
  writeValue(value: any): void {
    // Mettre en œuvre la logique pour écrire la valeur dans l'élément
    // Par exemple, pour un élément input, vous pouvez définir la valeur de son attribut 'value'
    this.elementRef.nativeElement.value = value;
  }

  registerOnChange(fn: any): void {
    // Enregistrer la fonction fournie par le formulaire pour notifier les changements de valeur
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    // Enregistrer la fonction fournie par le formulaire pour notifier les événements de touche
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Mettre en œuvre la logique pour désactiver ou activer l'élément
    this.elementRef.nativeElement.disabled = isDisabled;
  }

  // Fonctions de rappel pour les événements de changement et de touche
  onChange(event: Event) {}
  onTouched() {}

  // Gérer l'événement de changement sur l'élément hôte
  @HostListener('change', ['$event.target.value'])
  handleChange(value: any) {
    // Appeler la fonction de rappel onChange lorsqu'il y a un changement de valeur
    this.onChange(value);
  }
}
