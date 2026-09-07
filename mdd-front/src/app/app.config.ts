import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { PageTitleStrategy } from './core/strategies/page-title.strategy';
import { authInterceptor } from './features/auth/interceptor/auth.interceptor';
import { apiErrorInterceptor } from './core/errors/api-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor, apiErrorInterceptor])),
    provideRouter(routes),
    { provide: TitleStrategy, useClass: PageTitleStrategy }
  ]
};
