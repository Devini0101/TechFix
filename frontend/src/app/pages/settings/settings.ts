import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { AuthService } from '../../core/services/auth.service';
import { Theme, ThemeService } from '../../core/services/theme.service';
import { UserService } from '../../core/services/user.service';

// valida se "nova senha" e "confirmar senha" são iguais
function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const newPassword = group.get('newPassword')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return newPassword && confirmPassword && newPassword !== confirmPassword
    ? { passwordMismatch: true }
    : null;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  protected readonly themeService = inject(ThemeService);

  protected readonly themeOptions: { value: Theme; label: string; description: string; icon: string }[] = [
    { value: 'dark', label: 'Escuro', description: 'Fundo escuro, ideal para pouca luz.', icon: 'fa-moon' },
    { value: 'light', label: 'Claro', description: 'Fundo claro, ideal para ambientes iluminados.', icon: 'fa-sun' },
    { value: 'system', label: 'Sistema', description: 'Segue a preferência do seu dispositivo.', icon: 'fa-desktop' },
  ];

  protected readonly profileForm = this.formBuilder.nonNullable.group({
    name: [this.authService.getName() ?? '', [Validators.required, Validators.minLength(3)]],
  });

  protected readonly passwordForm = this.formBuilder.nonNullable.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatch },
  );

  protected profileSubmitted = false;
  protected readonly isSavingProfile = signal(false);
  protected readonly profileSuccess = signal('');
  protected readonly profileError = signal('');

  protected passwordSubmitted = false;
  protected readonly isSavingPassword = signal(false);
  protected readonly passwordSuccess = signal('');
  protected readonly passwordError = signal('');
  protected readonly showPasswords = signal(false);

  protected saveProfile(): void {
    this.profileSubmitted = true;
    this.profileSuccess.set('');
    this.profileError.set('');

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const name = this.profileForm.getRawValue().name.trim();
    this.isSavingProfile.set(true);
    this.userService.updateProfile({ name }).subscribe({
      next: () => {
        this.isSavingProfile.set(false);
        this.authService.setName(name);
        this.profileForm.reset({ name });
        this.profileSubmitted = false;
        this.profileSuccess.set('Nome de usuário atualizado com sucesso.');
      },
      error: () => {
        this.isSavingProfile.set(false);
        this.profileError.set('Não foi possível atualizar seu nome. Tente novamente.');
      },
    });
  }

  protected savePassword(): void {
    this.passwordSubmitted = true;
    this.passwordSuccess.set('');
    this.passwordError.set('');

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } = this.passwordForm.getRawValue();
    this.isSavingPassword.set(true);
    this.userService.changePassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        this.isSavingPassword.set(false);
        this.passwordForm.reset();
        this.passwordSubmitted = false;
        this.passwordSuccess.set('Senha alterada com sucesso.');
      },
      error: (err) => {
        this.isSavingPassword.set(false);
        this.passwordError.set(
          err.status === 401 || err.status === 403
            ? 'A senha atual está incorreta.'
            : 'Não foi possível alterar sua senha. Tente novamente.',
        );
      },
    });
  }

  protected selectTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  protected hasError(form: 'profile' | 'password', fieldName: string, errorName?: string): boolean {
    const group: AbstractControl = form === 'profile' ? this.profileForm : this.passwordForm;
    const submitted = form === 'profile' ? this.profileSubmitted : this.passwordSubmitted;
    const field = group.get(fieldName);

    if (!field) {
      return false;
    }

    // campo vazio só gera aviso depois de tentar salvar, não ao sair do campo
    if (errorName === 'required') {
      return field.hasError('required') && submitted;
    }

    return errorName
      ? field.hasError(errorName) && (field.touched || submitted)
      : field.invalid && (field.touched || submitted);
  }

  protected passwordMismatch(): boolean {
    const confirm = this.passwordForm.controls.confirmPassword;
    return this.passwordForm.hasError('passwordMismatch') && (confirm.touched || this.passwordSubmitted);
  }
}
