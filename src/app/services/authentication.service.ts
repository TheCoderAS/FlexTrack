import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from '@angular/fire/auth';
import nls from '../framework/resources/nls/authentication';
import { Router } from '@angular/router';
import { LoaderService } from './loader.service';
import { MessagesService } from './messages.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isAuthenticated: WritableSignal<boolean> = signal(false);
  private _auth: Auth = inject(Auth);
  private _router: Router = inject(Router);
  private _loader: LoaderService = inject(LoaderService);
  private _api: ApiService = inject(ApiService);
  private messageService: MessagesService = inject(MessagesService);
  currentUser: any;

  constructor() {
    onAuthStateChanged(this._auth, (user) => {
      if (user) {
        this.currentUser = user;
        this.isAuthenticated.set(true);
        this._router.navigate([''])
      } else {
        this.isAuthenticated.set(false);
        this._router.navigate(['/auth']);
      }
      this._loader.changeLoaderState("stop")
    })
  }
  async loginByGoogle(): Promise<void> {
    try {
      const user: UserCredential = await signInWithPopup(
        this._auth,
        new GoogleAuthProvider()
      );
      // if()
      this.login(user);
    } catch (error: any) {
      this.messageService.error(error.message);
    }
  }
  async signupWithUserPass(data: AuthUserCred): Promise<void> {
    try {
      this._loader.changeLoaderState('start')
      const user: UserCredential = await createUserWithEmailAndPassword(
        this._auth,
        data.email,
        data.password
      );
      let postData = {
        ...data,
        photo: ''
      }
      await this._api.post('users', postData);
      this.login(user);
    } catch (error: any) {
      this.messageService.error(error.message);

    } finally {
      this._loader.changeLoaderState('stop')
    }
  }
  async loginWithUserPass(data: AuthUserCred): Promise<void> {
    try {
      this._loader.changeLoaderState('start')
      const user: UserCredential = await signInWithEmailAndPassword(
        this._auth,
        data.email,
        data.password
      );
      await this._api.put('currentuser', data);
      this.login(user);
    } catch (error: any) {
      this.messageService.error(error.message);
    } finally {
      this._loader.changeLoaderState('stop')
    }
  }
  private login(user: UserCredential) {
    this.isAuthenticated.set(true);
    this._router.navigate(['']);
    this.messageService.success(nls.loginSuccess)

  }
  async logout() {
    try {
      this._loader.changeLoaderState('start')
      await this._auth.signOut();
      this.isAuthenticated.set(false);
    } catch (error: any) {
      this.messageService.error(error.message);
    } finally {
      this._loader.changeLoaderState('stop')
      this.messageService.success(nls.logoutSuccess)
    }
  }
}

export interface AuthUserCred {
  [key: string]: any;
  email: string;
  password: string;
  fname: string;
  lname: string;
  gender: string;
  photo?: string;
}
