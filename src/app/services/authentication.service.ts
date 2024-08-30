import { Injectable, WritableSignal, inject, signal } from '@angular/core';
// import {
//   Auth,
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider,
//   UserCredential,
//   onAuthStateChanged,
// } from '@angular/fire/auth';
import nls from '../framework/resources/nls/authentication';
import { Router } from '@angular/router';
// import { LoaderService } from './loader.service';
import { MessagesService } from './messages.service';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  // private _auth: Auth = inject(Auth);
  private _router: Router = inject(Router);
  // private _loader: LoaderService = inject(LoaderService);
  private _api: ApiService = inject(ApiService);
  private messageService: MessagesService = inject(MessagesService);
  currentUser: WritableSignal<any> = signal(null);

  constructor() {
    // onAuthStateChanged(this._auth, (user) => {
    //   if (user) {
    //     this.currentUser = user;
    //     this.isAuthenticated.set(true);
    //     this._router.navigate([''])
    //   } else {
    //     this.isAuthenticated.set(false);
    //     this._router.navigate(['/auth']);
    //   }
    //   this._loader.changeLoaderState("stop")
    // });
    this.getCurrentUser();
    this.isAuthenticated.subscribe((value) => {
      if (value) {
        this._router.navigate([''])
      } else {
        this._router.navigate(['/auth']);
      }
    })
  }
  // async loginByGoogle(): Promise<void> {
  //   try {
  //     const user: UserCredential = await signInWithPopup(
  //       this._auth,
  //       new GoogleAuthProvider()
  //     );
  //     // if()
  //     this.login(user);
  //   } catch (error: any) {
  //     this.messageService.error(error.message);
  //   }
  // }
  async signupWithUserPass(data: AuthUserCred): Promise<void> {
    let result: any = await this._api.hit('users/signup', 'post', data);
    // console.log(result);
    if (result.success) {
      await this._api.local_post('access', result.accessToken);
      let currentUser = await this._api.hit('users/current', 'get');
      if (currentUser.isAuthenticated) {
        await this._api.local_post('user', currentUser.user);
        this.currentUser.set(currentUser.user);
        this.isAuthenticated.next(true);
        this.messageService.success(result.message);
      } else {
        this.messageService.success(nls.SignupError);
      }
    } else {
      this.messageService.error(result.message);
    }
  }
  async loginWithUserPass(data: AuthUserCred): Promise<void> {
    let result: any = await this._api.hit('users/signin', 'post', data);

    if (result.success) {
      this.messageService.success(result.message);
      await this._api.local_post('access', result.accessToken);
      await this._api.local_post('user', result.user);
      this.currentUser.set(result.user);
      this.isAuthenticated.next(true);
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
  // private login(user: UserCredential) {
  //   this.isAuthenticated.set(true);
  //   this._router.navigate(['']);
  //   this.messageService.success(nls.loginSuccess)

  // }
  async logout() {
    await this._api.local_delete('user');
    await this._api.local_delete('access');
    this.isAuthenticated.next(false);
    this.currentUser.set(null);
    this.messageService.success(nls.logoutSuccess);
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
