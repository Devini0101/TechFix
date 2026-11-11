import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { MainLayout } from './pages/main-layout/main-layout';
import { authGuard, guestGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { Maintenances } from './pages/maintenance/maintenances';
import { Register } from './pages/register/register';
import { MaintenanceDetails } from './pages/maintenance-details/maintenance-details';
import { Users } from './pages/users/users';
import { Categories } from './pages/categories/categories';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found';
import { Budget } from './pages/budget/budget';

export const routes: Routes = [
  // telas de visitante: quem já está logado é mandado para o dashboard
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },

  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: Dashboard },
      { path: 'maintenances', component: Maintenances },
      { path: 'maintenances/:id', component: MaintenanceDetails },
      { path: 'budgets/:id', component: Budget }, // a própria tela decide entre a visão de funcionário e de cliente

      { path: 'categories', component: Categories, canActivate: [roleGuard], data: { role: 'employee' } },
      { path: 'users', component: Users, canActivate: [roleGuard], data: { role: 'employee' } },

      { path: '**', component: PageNotFoundComponent } // 404 quando logado e não encontrado
    ]
  },


  //redirecionamento padrão
  { path: '**', component: Login}
];
