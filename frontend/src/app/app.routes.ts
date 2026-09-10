import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { MainLayout } from './pages/main-layout/main-layout';
import { authGuard } from './core/guards/auth-guard';
import { Maintenances } from './pages/maintenance/maintenances';
import { MaintenanceDetails } from './pages/maintenance-details/maintenance-details';

export const routes: Routes = [
  { path: 'login', component: Login },

  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard], // Protege todas as rotas filhas
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'maintenances', component: Maintenances },
      { path: 'maintenances/:id', component: MaintenanceDetails}
      // { path: 'dashboard', component: Dashboard }, // outras páginas protegidas devem ter o msm padrão e estar aq
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
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
