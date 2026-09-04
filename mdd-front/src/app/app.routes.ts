import { Routes } from '@angular/router';
import { HomePage } from './features/home/pages/home-page/home-page';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'login', loadComponent: () => import('./features/auth/pages/login-page/login-page').then(m => m.LoginPage) },
    { path: 'register', loadComponent: () => import('./features/auth/pages/register-page/register-page').then(m => m.RegisterPage) },
    { path: '**', redirectTo: '' }
];
