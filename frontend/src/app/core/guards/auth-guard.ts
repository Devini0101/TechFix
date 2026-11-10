import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";

// só deixa passar quem está logado; o checkAuth roda no provideAppInitializer, então já está resolvido aqui
export const authGuard : CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // UrlTree em vez de router.navigate: evita navegações concorrentes quando há mais de um guard na rota
    return authService.isAuthenticated() ? true : router.createUrlTree(["/login"]);
}

// telas de visitante (login/cadastro): quem já está logado vai direto para o dashboard
export const guestGuard : CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isAuthenticated() ? router.createUrlTree(["/dashboard"]) : true;
}
