import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'fitness-tracker-e06df',
          appId: '1:931186137027:web:c52668d4e9de987dfa4f76',
          storageBucket: 'fitness-tracker-e06df.appspot.com',
          apiKey: 'AIzaSyBK1wqHNT5DS1S1hzBXGyPmJW4iL34E5Bw',
          authDomain: 'fitness-tracker-e06df.firebaseapp.com',
          messagingSenderId: '931186137027',
          measurementId: 'G-V94L32EHX1',
        })
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideAnalytics(() => getAnalytics())),
    ScreenTrackingService,
    UserTrackingService,
  ],
};
