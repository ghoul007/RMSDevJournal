import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideRouterStore } from '@ngrx/router-store';
import { ngrxFormsEffects, ngrxFormsFeature } from '@infordevjournal/core/forms';
import { authGuard, tokenInterceptor } from '@infordevjournal/auth/data-access';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { errorHandlingInterceptor } from '@infordevjournal/core/error-handler';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { API_URL } from '@infordevjournal/core/http-client';
import { environment } from '@env/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      [
        {
          path: '',
          redirectTo: 'home',
          pathMatch: 'full',
        },
        {
          path: 'home',
          loadComponent: () => import('@infordevjournal/home/src/lib/home.component').then((m) => m.HomeComponent),
        },
        {
          path: 'login',
          loadComponent: () => import('@infordevjournal/auth/feature-auth').then((m) => m.LoginComponent),
        },
        {
          path: 'register',
          loadComponent: () => import('@infordevjournal/auth/feature-auth').then((m) => m.RegisterComponent),
        },
        {
          path: 'article',
          loadChildren: () => import('@infordevjournal/articles/article').then((m) => m.ARTICLE_ROUTES),
        },
        {
          path: 'settings',
          loadComponent: () =>
            import('@infordevjournal/settings/feature-settings').then((settings) => settings.SettingsComponent),
        },
        {
          path: 'editor',
          loadChildren: () => import('@infordevjournal/articles/article-edit').then((article) => article.ARTICLE_EDIT_ROUTES),
          canActivate: [authGuard],
        },
        {
          path: 'profile',
          loadChildren: () => import('@infordevjournal/profile/feature-profile').then((profile) => profile.PROFILE_ROUTES),
        },
      ],
      withViewTransitions(),
      withComponentInputBinding(),
    ),
    provideStore({
      ngrxForms: ngrxFormsFeature.reducer,
    }),
    provideEffects(ngrxFormsEffects),
    provideRouterStore(),
    provideHttpClient(withInterceptors([errorHandlingInterceptor, tokenInterceptor])),
    !environment.production ? provideStoreDevtools() : [],
    { provide: API_URL, useValue: environment.api_url },
  ],
};
