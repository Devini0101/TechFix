import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AuthService } from './core/services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    // Executa o checkAuth ANTES das rotas e dos Guards carregarem
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.checkAuth();
    })
  ]
};
