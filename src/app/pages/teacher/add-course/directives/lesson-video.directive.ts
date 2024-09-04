import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[lessonVideoControl]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LessonVideoDirective),
      multi: true
    }
  ]
})
export class LessonVideoDirective implements ControlValueAccessor {
  constructor(private elementRef: ElementRef) {}

  // Implémentation de ControlValueAccessor
  writeValue(value: any): void {
    this.elementRef.nativeElement.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.elementRef.nativeElement.disabled = isDisabled;
  }

  onChange(event: Event) {}
  onTouched() {}

  @HostListener('change', ['$event.target.value'])
  handleChange(value: any) {
    this.onChange(value);
  }
}