import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import nls from '../framework/resources/nls/authentication';
import { Router } from '@angular/router';
import { MessagesService } from './messages.service';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';

declare var Fingerprint: any;
declare var window: any;

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isModalOpen: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _router: Router = inject(Router);
  private _api: ApiService = inject(ApiService);
  private messageService: MessagesService = inject(MessagesService);
  currentUser: WritableSignal<any> = signal(null);

  constructor() {
    this.getCurrentUser();
    this.isAuthenticated.subscribe((value) => {
      if (value) {
        this._router.navigate([''])
      } else {
        this._router.navigate(['/auth']);
      }
    });
  }
  async launchBiometric() {
    try {
      let isBiometricEnabled = window.localStorage.getItem('isBiometricEnabled');
      if (isBiometricEnabled === 'enabled') {
        const isAvailable = await this.isBiometricAvailable();
        if (typeof isAvailable === 'string') {
          try {
            let userPreferences = window.localStorage.getItem('userPreferences');
            userPreferences = userPreferences ? JSON.parse(userPreferences) : null;
            if (userPreferences) {
              await this.authenticate();
              this.loginWithUserPass(userPreferences);
            } else {
              this.messageService.error(nls.CannotUseBiometric);

            }
          } catch (error) {
            this.messageService.error(nls.BiometricLoginError);
          }
        } else {
          this.messageService.error(nls.BiometricLoginError);
        }
      }
    } catch (error) {
      console.log(error);
    }

  }

  async signupWithUserPass(data: AuthUserCred): Promise<void> {
    data.email = data.email.toLowerCase();
    let result: any = await this._api.hit('users/signup', 'post', data);
    // console.log(result);
    if (result.success) {
      this._router.navigate(['/auth'])
      this.messageService.success(result.message);
    } else {
      this.messageService.error(result.message);
    }
  }
  userCreds: any = null;
  async loginWithUserPass(data: AuthUserCred): Promise<void> {
    data.email = data.email.toLowerCase();
    this.userCreds = data;
    let result: any = await this._api.hit('users/signin', 'post', data);

    if (result.success) {
      this.messageService.success(result.message);
      await this._api.local_post('access', result.accessToken);
      await this._api.local_post('user', result.user);
      this.currentUser.set(result.user);

      try {

        let isBiometricEnabled = window.localStorage.getItem('isBiometricEnabled');
        //if app is not enabled for biometric auth
        if (isBiometricEnabled !== 'enabled') {
          //check if biometric enrolled on device
          const isAvailable = await this.isBiometricAvailable();
          if (typeof isAvailable === 'string') {
            this.toggleModal(true)
          } else {
            this.isAuthenticated.next(true);
          }
        } else {
          this.isAuthenticated.next(true);
        }
      } catch (error) {
        console.log(error);
        this.toggleModal(false);
      }
    } else {
      this.messageService.error(result.message);
    }
  }
  async getCurrentUser(): Promise<void> {
    let currentUser = await this._api.hit('users/current', 'get');
    if (currentUser.isAuthenticated) {
      await this._api.local_post('user', currentUser.user);
      this.currentUser.set(currentUser.user);
      this.isAuthenticated.next(true);
    } else {
      await this._api.local_delete('user');
      await this._api.local_delete('access');
      this.currentUser.set(null);
      this.isAuthenticated.next(false);
      this.messageService.success(nls.UserSessionExpired);
    }

  }
  async logout() {
    await this._api.local_delete('user');
    await this._api.local_delete('access');
    this.isAuthenticated.next(false);
    this.currentUser.set(null);
    this.messageService.success(nls.logoutSuccess);
  }
  toggleModal(state: any) {
    this.isModalOpen.next(state);
    if (!state) {
      this.isAuthenticated.next(true);
    }
  }
  async submitModal(data: any) {
    try {
      await this.authenticate();
      window.localStorage.setItem('isBiometricEnabled', 'enabled');
      window.localStorage.setItem('userPreferences', JSON.stringify(this.userCreds));
    } catch (error: any) {
      this.messageService.error(error.message);
    } finally {
      this.toggleModal(false);
    }
  }
  isBiometricAvailable(): Promise<any> {
    return new Promise((resolve, reject) => {
      Fingerprint.isAvailable((result: any) => {
        resolve(result);
      }, (error: any) => {
        reject(error);
      })
    })
  }
  authenticate(): Promise<any> {
    return new Promise((resolve, reject) => {
      Fingerprint.show({
        title: 'Fiteness Tracker Biometric Auth',
        subtitle: "Fiteness Tracker Biometric Auth",
        clientId: "FlexTrack",
        clientSecret: 'password', // necessary for Android
        disableBackup: true,      // disable PIN/backup authentication
        localizedFallbackTitle: "Use Pin", // Optional, fallback title
        localizedReason: "Authenticate to access the app", // Optional reason
        biometricOnly: true,
        confirmationRequired: false
      }, (success: any) => {
        resolve(success); // Authentication success
      }, (error: any) => {
        reject(error); // Authentication error
      });
    });
  }

}

export interface AuthUserCred {
  [key: string]: any;
  email: string;
  password: string;
  confirmpassword: string;
  first_name: string;
  last_name: string;
  photo?: string;
  phone: string;
}
