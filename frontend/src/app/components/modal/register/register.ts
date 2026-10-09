import { Component, DestroyRef, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { AddressService } from '../../../core/services/address.service';
import { AuthService } from '../../../core/services/auth.service';

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

const ADDRESS_FIELDS = ['street', 'number', 'neighborhood', 'city', 'uf', 'complement'] as const;

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly addressService = inject(AddressService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly registerForm = this.formBuilder.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.minLength(11)]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmation: ['', [Validators.required]],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
      // campos de endereço ficam desabilitados (fora da validação) até o CEP ser encontrado
      street: [{ value: '', disabled: true }, [Validators.required]],
      number: [{ value: '', disabled: true }, [Validators.required]],
      neighborhood: [{ value: '', disabled: true }, [Validators.required]],
      city: [{ value: '', disabled: true }, [Validators.required]],
      uf: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(2)]],
      complement: [{ value: '', disabled: true }],
    },
    { validators: passwordMatchValidator() },
  );

  protected submitted = false;
  protected readonly isSubmitting = signal(false);
  protected readonly successMessage = signal('');
  protected readonly errorMessage = signal('');

  protected readonly addressLoaded = signal(false);
  protected readonly isSearchingCep = signal(false);
  protected readonly cepError = signal('');

  private cepSubscription?: Subscription;

  ngOnInit(): void {
    this.registerForm.controls.cep.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        const cep = value.replace(/\D/g, '');

        this.cepSubscription?.unsubscribe();
        this.clearAddress();

        if (cep.length === 8) {
          this.searchCep(cep);
        }
      });
  }

  private searchCep(cep: string): void {
    this.isSearchingCep.set(true);

    this.cepSubscription = this.addressService.getByCep(cep).subscribe({
      next: (address) => {
        this.isSearchingCep.set(false);
        this.registerForm.patchValue({
          street: address.street ?? '',
          neighborhood: address.neighborhood ?? '',
          city: address.city ?? '',
          uf: address.uf ?? '',
          complement: address.complement ?? '',
        });
        ADDRESS_FIELDS.forEach((field) => this.registerForm.controls[field].enable());
        this.addressLoaded.set(true);
      },
      error: (err: HttpErrorResponse) => {
        this.isSearchingCep.set(false);
        this.cepError.set(
          err.status === 404 ? 'CEP não encontrado.' : 'Não foi possível buscar o CEP. Tente novamente.',
        );
      },
    });
  }

  private clearAddress(): void {
    this.addressLoaded.set(false);
    this.isSearchingCep.set(false);
    this.cepError.set('');
    ADDRESS_FIELDS.forEach((field) => {
      const control = this.registerForm.controls[field];
      control.reset('');
      control.disable();
    });
  }

  protected submit(): void {
    this.submitted = true;
    this.successMessage.set('');
    this.errorMessage.set('');

    if (this.registerForm.invalid || !this.addressLoaded()) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { passwordConfirmation, number, ...formValue } = this.registerForm.getRawValue();

    this.isSubmitting.set(true);
    this.authService
      .register({
        ...formValue,
        // o back não tem campo de número, ele vai junto com a rua
        street: `${formValue.street.trim()}, ${number.trim()}`,
        cep: formValue.cep.replace(/\D/g, ''),
        uf: formValue.uf.toUpperCase(),
        role: 'employee',
      })
      .subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.successMessage.set(`Funcionário ${res.name} cadastrado com sucesso.`);
          this.submitted = false;
          this.registerForm.reset();
        },
        error: (err: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(
            err.status === 409
              ? 'Já existe um usuário cadastrado com este e-mail ou CPF.'
              : 'Não foi possível cadastrar o funcionário. Tente novamente.',
          );
        },
      });
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
}
