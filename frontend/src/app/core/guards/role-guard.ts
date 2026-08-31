import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
	const authService = inject(AuthService);
	const router = inject(Router);

	const neededRole = route.data?.['role'];
	const userRole = authService.getRole();

	if (neededRole === userRole) {
	return true;
	}

	router.navigate(['/dashboard']);
	return false;
};
