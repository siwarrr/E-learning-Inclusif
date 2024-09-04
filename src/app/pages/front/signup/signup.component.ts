import { Component, ErrorHandler, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Observable, Observer } from 'rxjs';

import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
  zoomLevel: number = 1; // Niveau de zoom par défaut

  validateForm: FormGroup<{
    handicapType: any;
    fullname: FormControl<string>;
    email: FormControl<string>;
    radioValue: FormControl<string>;
    password: FormControl<string>;
    confirm: FormControl<string>;
  }>;
  selectedValue = null;
  radioValue = 'Learner';
  // current locale is key of the nzAutoTips
  // if it is not found, it will be searched again with `default`
  autoTips: Record<string, Record<string, string>> = {
    'zh-cn': {
      required: '必填项'
    },
    en: {
      required: 'Input is required'
    },
    default: {
      email: '邮箱格式不正确/The input is not valid email'
    }
  };

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

  userNameAsyncValidator: AsyncValidatorFn = (control: AbstractControl) =>
    new Observable((observer: Observer<MyValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value === 'JasonWood') {
          observer.next({
            duplicated: { 'zh-cn': `用户名已存在`, en: `The username is redundant!` }
          });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });

  confirmValidator: ValidatorFn = (control: AbstractControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  

  constructor(private fb: NonNullableFormBuilder, private _auth: AuthService, private router: Router) {
    // use `MyValidators`
    const { required, maxLength, minLength, email,  } = MyValidators;
    this.validateForm = this.fb.group({
      handicapType: ['', [Validators.required]], // Modifier l'ordre pour handicapType
      fullname: ['', [required, maxLength(50), minLength(6)], [this.userNameAsyncValidator]],
      email: ['', [required, email]],
      radioValue: ['', [Validators.required]],
      password: ['', [required]],
      confirm: ['', [this.confirmValidator]]
    });
  }
  ngOnInit(): void {

  }
  register() {
    if (this.validateForm.valid) {
      console.log('Form is valid'); // Afficher un message indiquant que le formulaire est valide
      const formData = this.validateForm.value;
      this._auth.register(formData)
        .subscribe(
          _res => {
            this.router.navigate(['/welcome/login']);
          },
          error => {
            console.error('Error:', error);
            // Afficher un message d'erreur à l'utilisateur ou prendre d'autres mesures nécessaires
          }
        );
    } else {
      console.log('Form is invalid');
      console.log('Form values:', this.validateForm.value); // Afficher les valeurs du formulaire
      console.log('Form errors:', this.validateForm.errors); // Afficher les erreurs du formulaire
      // Parcourir les contrôles du formulaire pour afficher les erreurs de chaque champ
      Object.keys(this.validateForm.controls).forEach(key => {
        const controlErrors = this.validateForm.get(key)?.errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.error('Form error:', key, keyError, controlErrors[keyError]);
          });
        }
      });
    }
  }
  zoomIn() {
    this.zoomLevel += 0.1;
  }

  zoomOut() {
    if (this.zoomLevel > 0.1) {
      this.zoomLevel -= 0.1;
    }
  }

  resetZoom() {
    this.zoomLevel = 1; // Réinitialiser le niveau de zoom par défaut
  }
}

// current locale is key of the MyErrorsOptions
export type MyErrorsOptions = { 'zh-cn': string; en: string } & Record<string, NzSafeAny>;
export type MyValidationErrors = Record<string, MyErrorsOptions>;

export class MyValidators extends Validators {
  static override minLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.minLength(minLength)(control) === null) {
        return null;
      }
      return { minlength: { 'zh-cn': `最小长度为 ${minLength}`, en: `MinLength is ${minLength}` } };
    };
  }

  static override maxLength(maxLength: number): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.maxLength(maxLength)(control) === null) {
        return null;
      }
      return { maxlength: { 'zh-cn': `最大长度为 ${maxLength}`, en: `MaxLength is ${maxLength}` } };
    };
  }

}



