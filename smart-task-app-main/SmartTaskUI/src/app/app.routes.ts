import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthService } from './core/services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  return authService.isAuthenticated() || authService.currentUser() !== null;
};

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [() => authGuard()]
  },
  { path: '**', redirectTo: '/login' }
];
