import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { MainLayout } from './pages/main-layout/main-layout';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },

  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard], // Protege todas as rotas filhas
    children: [
      { path: 'dashboard', component: Dashboard },
      // { path: 'dashboard', component: Dashboard }, // outras páginas protegidas devem ter o msm padrão e estar aq
    ]
  },

  //redirecionamento padrão
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
