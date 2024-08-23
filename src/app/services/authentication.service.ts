import { Injectable, OnInit, inject } from '@angular/core';
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

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private isAuthenticated: boolean = false;
  private _auth: Auth = inject(Auth);
  private _router: Router = inject(Router);
  private _loader: LoaderService = inject(LoaderService);
  private messageService: MessagesService = inject(MessagesService);
  currentUser: any;

  constructor() {
    onAuthStateChanged(this._auth, (user) => {
      if (user) {
        this.currentUser = user;
        this.isAuthenticated = true;
      } else {
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
    } catch (error) {
      console.error(nls.authFailed, error);
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
      this.login(user);
    } catch (error) {
      console.error(nls.authFailed, error);
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
      this.login(user);
    } catch (error) {
      this.messageService.error(nls.authFailed);
    } finally {
      this._loader.changeLoaderState('stop')
    }
  }
  private login(user: UserCredential) {
    this.isAuthenticated = true;
    this._router.navigate(['']);
    this.messageService.success(nls.loginSuccess)

  }
  async logout() {
    try {
      this._loader.changeLoaderState('start')
      await this._auth.signOut();
      this.isAuthenticated = false;
    } catch (error) {
      console.error(error);
    } finally {
      this._loader.changeLoaderState('stop')
      this.messageService.success(nls.logoutSuccess)
    }
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}

export interface AuthUserCred {
  [key: string]: any;
  email: string;
  password: string;
  otherDetails: any;
}
