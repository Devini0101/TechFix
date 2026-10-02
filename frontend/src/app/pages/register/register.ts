import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

const passwordMatchValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const passwordConfirmation = control.get('passwordConfirmation')?.value;

    if (!password || !passwordConfirmation) {
      return null;
    }

    return password === passwordConfirmation ? null : { passwordMismatch: true };
  };
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly registerForm = this.formBuilder.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.minLength(11)]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmation: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator() },
  );

  protected submitted = false;
  protected successMessage = '';

  protected submit(): void {
    this.submitted = true;
    this.successMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.successMessage =
      'Dados validados. O cadastro será enviado ao servidor quando a integração estiver disponível.';
  }

  protected hasError(fieldName: string, errorName?: string): boolean {
    const field = this.registerForm.get(fieldName);

    if (!field) {
      return false;
    }

    return errorName
      ? field.hasError(errorName) && (field.touched || this.submitted)
      : field.invalid && (field.touched || this.submitted);
  }

  protected hasPasswordMismatch(): boolean {
    return (
      this.registerForm.hasError('passwordMismatch') &&
      (this.registerForm.get('passwordConfirmation')?.touched || this.submitted)
    );
  }

  protected goToLogin(): void {
    this.router.navigate(['/login']);
  }
}