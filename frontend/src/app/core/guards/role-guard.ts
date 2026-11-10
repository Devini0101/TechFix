import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// exige o papel informado em data: { role: '...' }; usar junto com o authGuard
export const roleGuard: CanActivateFn = (route) => {
	const authService = inject(AuthService);
	const router = inject(Router);

	if (!authService.isAuthenticated()) {
		return router.createUrlTree(['/login']);
	}

	const neededRole = route.data?.['role'];
	return neededRole === authService.getRole() ? true : router.createUrlTree(['/dashboard']);
};
