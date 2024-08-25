import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private cordova: any;
  private window: Window;

  constructor(private router: Router) {
    if (typeof window != "undefined") {
      this.window = window;
    } else {
      this.window = new Window();
    }
    if ((this.window as any).cordova) {
      this.cordova = (this.window as any).cordova;
    }
  }
  getCordova(): any {
    return this.cordova;
  }
  getWindow(): Window {
    return this.window;
  }

}
