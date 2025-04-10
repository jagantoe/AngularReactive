import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { cacheInterceptor } from './interceptors/cache.interceptor';

// Using ApplicationConfig we can configure the application without using NgModules.
export const appConfig: ApplicationConfig = {
  providers: [
    // Added by default for new Angular projects, optimises change detection by coalescing events into a single event.
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Comparable to the import of HttpClientModule in NgModule
    provideHttpClient(withInterceptors([cacheInterceptor])),
    // Comparable to the AppRoutingModule and RouterModule.forRoot(routes)
    // We can provide additional configuration using RouterFeatures in the form of functions provided by Angular.
    // withComponentInputBinding will make Angular bind any route params to matching component inputs.
    provideRouter(routes, withComponentInputBinding())
  ]
};
