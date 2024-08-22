import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from '../../framework/navbar/navbar.component';
import { AppService } from '../../services/app.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private _app: AppService = inject(AppService);
  private _authService: AuthenticationService = inject(AuthenticationService);
  // constructor() {
  //   this._app.canActivate();
  // }

}
