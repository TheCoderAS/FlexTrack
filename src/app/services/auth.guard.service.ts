import { Injectable } from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private authService:AuthenticationService,private router:Router) { }
  canActivate():boolean{
    if(this.authService.isLoggedIn()){
      return true;
    }
    this.router.navigate(['/auth']);
    return false;
  }
}
