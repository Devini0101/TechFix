import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
	private readonly formBuilder = inject(FormBuilder);
	protected readonly loginForm = this.formBuilder.nonNullable.group({
		email : ['', [Validators.required, Validators.maxLength(255)]],
		password : ['', [Validators.required, Validators.maxLength(255)]],
	});

	isLoginMode : boolean = true;

	registerName : string = '';
	registerCpf : string = '';
	registerEmail : string = '';
	registerPhone : string = '';
	registerCep : string = '';
	registerPassword : string = '';
	registerConfirmPassword : string = '';

	private authService = inject(AuthService);
	private router = inject(Router);

	hasError = signal<Boolean>(false);

	onSubmit() : void {

		this.hasError.set(false);

		if (this.loginForm.invalid) {
			this.loginForm.markAllAsTouched();
			return;
		}

		this.authService.login(this.loginForm.getRawValue()).subscribe({
			next: () => {
				this.router.navigate(['/dashboard']);
			},
			error: (err) => {
				console.error("Login failed:", err);
				this.hasError.set(true);
			},
		})
	}

	showLogin(): void {
		this.isLoginMode = true;
	}

	showRegister(): void {
  		this.router.navigate(['/cadastro']);
	}
}
