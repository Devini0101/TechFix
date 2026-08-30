import { Component, inject } from '@angular/core';
import { Input } from '../../components/input/input';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [Input, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
	email : string = '';
	password : string = '';

	private authService = inject(AuthService);
	private router = inject(Router);

	onSubmit() : void {
		if (!this.email || !this.password) {
			alert("Preencha email e senha !!");
			return;
		}

		const credentials = {
			email : this.email,
			password : this.password,
		}

		this.authService.login(credentials).subscribe({
			next: () => {
				console.log("login successful");
				this.router.navigate(['/dashboard']);
			},
			error(err) {
				console.error("Login failed:", err)
				alert("Credenciais inválidas")
			},
		})
	}
}
