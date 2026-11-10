import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { Subscription } from 'rxjs';

import { AddressService } from '../../../core/services/address.service';
import { RegisterResponse } from '../../../core/services/auth.service';
import { EmployeeDetails, EmployeeService } from '../../../core/services/employee.service';

const ADDRESS_FIELDS = ['street', 'number', 'neighborhood', 'city', 'uf', 'complement'] as const;

@Component({
  selector: 'app-employee-register-modal',
  imports: [ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './employee-register-modal.html',
  styleUrl: './employee-register-modal.css',
})
export class EmployeeRegisterModal implements OnInit {
  // com id = modo edição (carrega os dados e salva via PUT); sem id = cadastro
  @Input() employeeId: number | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() created = new EventEmitter<RegisterResponse>();
  @Output() updated = new EventEmitter<EmployeeDetails>();

  private readonly formBuilder = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly addressService = inject(AddressService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly registerForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    cpf: ['', [Validators.required, Validators.minLength(11)]],
    phone: ['', [Validators.required, Validators.minLength(10)]],
    cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
    // campos de endereço ficam desabilitados (fora da validação) até o CEP ser encontrado
    street: [{ value: '', disabled: true }, [Validators.required]],
    number: [{ value: '', disabled: true }, [Validators.required]],
    neighborhood: [{ value: '', disabled: true }, [Validators.required]],
    city: [{ value: '', disabled: true }, [Validators.required]],
    uf: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(2)]],
    complement: [{ value: '', disabled: true }],
  });

  protected submitted = false;
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly addressLoaded = signal(false);
  protected readonly isSearchingCep = signal(false);
  protected readonly cepError = signal('');

  protected readonly isLoading = signal(false);
  protected readonly loadError = signal('');

  private cepSubscription?: Subscription;

  protected get isEditing(): boolean {
    return this.employeeId !== null;
  }

  ngOnInit(): void {
    if (this.isEditing) {
      // cpf não é editável (só exibido); ele não vai no payload de edição
      this.registerForm.controls.cpf.disable();
      this.loadEmployee(this.employeeId!);
    }

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

  private loadEmployee(id: number): void {
    this.isLoading.set(true);
    this.employeeService.getEmployee(id).subscribe({
      next: (employee) => {
        this.isLoading.set(false);
        this.fillForm(employee);
      },
      error: () => {
        this.isLoading.set(false);
        this.loadError.set('Não foi possível carregar os dados do funcionário.');
      },
    });
  }

  private fillForm(employee: EmployeeDetails): void {
    // no cadastro, rua e número são salvos juntos ("Rua X, 123"): separa pelo último ", "
    const fullStreet = employee.street ?? '';
    const separator = fullStreet.lastIndexOf(', ');
    const street = separator >= 0 ? fullStreet.slice(0, separator) : fullStreet;
    const number = separator >= 0 ? fullStreet.slice(separator + 2) : '';

    // emitEvent: false para o valueChanges do CEP não limpar o endereço que acabou de ser preenchido
    this.registerForm.patchValue(
      {
        name: employee.name,
        email: employee.email,
        cpf: employee.cpf ?? '',
        phone: employee.phone ?? '',
        cep: employee.cep ?? '',
        street,
        number,
        neighborhood: employee.neighborhood ?? '',
        city: employee.city ?? '',
        uf: employee.uf ?? '',
        complement: employee.complement ?? '',
      },
      { emitEvent: false },
    );

    if (employee.cep) {
      ADDRESS_FIELDS.forEach((field) => this.registerForm.controls[field].enable());
      this.addressLoaded.set(true);
    }
  }

  private searchCep(cep: string): void {
    this.isSearchingCep.set(true);

    this.cepSubscription = this.addressService.getByCep(cep).subscribe({
      next: (address) => {
        this.isSearchingCep.set(false);
        this.registerForm.patchValue({
          street: address.logradouro ?? '',
          neighborhood: address.bairro ?? '',
          city: address.localidade ?? '',
          uf: address.uf ?? '',
          complement: address.complemento ?? '',
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
    this.errorMessage.set('');

    if (this.registerForm.invalid || !this.addressLoaded()) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { number, cpf, ...formValue } = this.registerForm.getRawValue();
    const address = {
      // o back não tem campo de número, ele vai junto com a rua
      street: `${formValue.street.trim()}, ${number.trim()}`,
      cep: formValue.cep.replace(/\D/g, ''),
      uf: formValue.uf.toUpperCase(),
    };

    this.isSubmitting.set(true);

    if (this.isEditing) {
      this.employeeService.updateEmployee(this.employeeId!, { ...formValue, ...address }).subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.updated.emit(res);
        },
        error: (err: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(
            err.status === 409
              ? 'Já existe um usuário cadastrado com este e-mail.'
              : 'Não foi possível salvar as alterações. Tente novamente.',
          );
        },
      });
      return;
    }

    this.employeeService
      .registerEmployee({ ...formValue, cpf, ...address })
      .subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.created.emit(res);
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
}
