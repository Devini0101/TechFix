import { Component, inject } from '@angular/core';
import { InputComponent } from '../../components/input/input';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [InputComponent, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
	email : string = '';
	password : string = '';

	private authService = inject(AuthService);
	private router = inject(Router);

	hasError = false;

	onSubmit() : void {

		this.hasError = false;

		if (!this.email || !this.password) {
			this.hasError = true;
			return;
		}

		const credentials = {
			email : this.email,
			password : this.password,
		}

		this.authService.login(credentials).subscribe({
			next: () => {
				this.router.navigate(['/dashboard']);
			},
			error: (err) => {
				console.error("Login failed:", err);
				this.hasError = true;
			},
		})
	}
}
