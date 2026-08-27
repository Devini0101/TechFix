import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'dashboard', component: Dashboard }
];
