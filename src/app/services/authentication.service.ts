import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';
import nls from '../framework/resources/nls/authentication';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private isAuthenticated: boolean = false;
  private _auth: Auth = inject(Auth);

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
      const user: UserCredential = await createUserWithEmailAndPassword(
        this._auth,
        data.email,
        data.password
      );
      this.login(user);
    } catch (error) {
      console.error(nls.authFailed, error);
    }
  }
  async loginWithUserPass(data: AuthUserCred): Promise<void> {
    try {
      const user: UserCredential = await signInWithEmailAndPassword(
        this._auth,
        data.email,
        data.password
      );
      this.login(user);
    } catch (error) {
      console.error(nls.authFailed, error);
    }
  }
  private login(user: UserCredential) {
    this.isAuthenticated = true;
    console.warn(user);
  }
  logout() {
    this.isAuthenticated = false;
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
