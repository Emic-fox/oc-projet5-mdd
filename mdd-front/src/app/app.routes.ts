import { Routes } from '@angular/router';
import { HomePage } from './features/home/pages/home-page/home-page';
import { PublicLayout } from './shared/layouts/public-layout/public-layout';
import { PrivateLayout } from './shared/layouts/private-layout/private-layout';

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
    { path: '', component: PrivateLayout, children: [
        {
            path: 'articles',
            loadComponent: () => import('./features/articles/pages/articles-feed-page/articles-feed-page').then(m => m.ArticlesFeedPage),
            title: "Fil d'actualités"
        },
        {
            path: 'articles/:id',
            loadComponent: () => import('./features/articles/pages/article-detail-page/article-detail-page').then(m => m.ArticleDetailPage),
            title: "Détail de l'article"
        },
        {
            path: 'new-article',
            loadComponent: () => import('./features/articles/pages/article-create-page/article-create-page').then(m => m.ArticleCreatePage),
            title: "Créer un article"
        },
        {
            path: 'topics',
            loadComponent: () => import('./features/topics/pages/topics-page/topics-page').then(m => m.TopicsPage),
            title: "Thèmes"
        },
        {
            path: 'profile',
            loadComponent: () => import('./features/profile/pages/profile-page/profile-page').then(m => m.ProfilePage),
            title: "Profil"
        }
    ] },
    { path: '**', redirectTo: '' }
];
