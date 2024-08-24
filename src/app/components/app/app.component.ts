import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from '../../framework/navbar/navbar.component';
import { AppService } from '../../services/app.service';
import { AuthenticationService } from '../../services/authentication.service';
import { LoaderComponent } from '../../framework/loader/loader.component';
import { LoaderService } from '../../services/loader.service';
import { MessagesComponent } from '../../framework/messages/messages.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, NavbarComponent, LoaderComponent, MessagesComponent,NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent{
  _appService: AppService = inject(AppService);
  private _authService: AuthenticationService = inject(AuthenticationService);
  _loader: LoaderService = inject(LoaderService);
}
