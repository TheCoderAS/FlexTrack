import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {

  private _authService: AuthenticationService = inject(AuthenticationService);
  logout() {
    this._authService.logout()
  }
}
