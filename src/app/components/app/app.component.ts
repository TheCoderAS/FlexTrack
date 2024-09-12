import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from '../../framework/navbar/navbar.component';
import { AuthenticationService } from '../../services/authentication.service';
import { LoaderComponent } from '../../framework/loader/loader.component';
import { LoaderService } from '../../services/loader.service';
import { MessagesComponent } from '../../framework/messages/messages.component';
import { NgClass } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, NavbarComponent, LoaderComponent, MessagesComponent, NgClass, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  _authService: AuthenticationService = inject(AuthenticationService);
  _loader: LoaderService = inject(LoaderService);
}
