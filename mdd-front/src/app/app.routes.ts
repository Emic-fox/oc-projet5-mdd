import { Routes } from '@angular/router';
import { HomePage } from './features/home/pages/home-page/home-page';
import { PublicLayout } from './shared/layouts/public-layout/public-layout';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: '', component: PublicLayout, children: [
        { 
            path: 'login',
            loadComponent: () => import('./features/auth/pages/login-page/login-page').then(m => m.LoginPage),
            title: "Se connecter"
        },
        { 
            path: 'register',
            loadComponent: () => import('./features/auth/pages/register-page/register-page').then(m => m.RegisterPage),
            title: "Inscription"
        },
    ] },
    { path: '**', redirectTo: '' }
];
