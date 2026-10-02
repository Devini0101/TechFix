import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { MainLayout } from './pages/main-layout/main-layout';
import { authGuard } from './core/guards/auth-guard';
import { Maintenances } from './pages/maintenance/maintenances';
import { Register } from './pages/register/register';
import { MaintenanceDetails } from './pages/maintenance-details/maintenance-details';
import { Users } from './pages/users/users';
import { Categories } from './pages/categories/categories';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found';
import { Budget } from './pages/budget/budget';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'users', component: Users },

  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard], // Protege todas as rotas filhas
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'maintenances', component: Maintenances },
      { path: 'maintenances/:id', component: MaintenanceDetails},
      { path: 'categories', component: Categories },
      { path: 'budgets/:id', component: Budget },
      // { path: 'dashboard', component: Dashboard }, // outras páginas protegidas devem ter o msm padrão e estar aq
      { path: '**', component: PageNotFoundComponent} //404 quando logado e não encontrado
    ]
  },


  // exemplo de rota protegida apenas para funcionários
  // {
  //   path: 'report',
  //   component: ReportComponent,
  //   canActivate: [roleGuard],
  //   data: { role: 'employee' } //passa a exigência do papel
  // },

  //redirecionamento padrão
  { path: '**', component: Login}
];
