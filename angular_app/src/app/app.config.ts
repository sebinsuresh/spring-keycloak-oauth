import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { credentialsInterceptor } from './core/interceptors/credentials.interceptor';
import { AuthService } from './core/services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([credentialsInterceptor]),
    ),
    provideAppInitializer(() => {
      const auth = inject(AuthService);
      // App initialization will wait for loadUser to complete:
      return auth.loadUser();
    }),
  ],
};
