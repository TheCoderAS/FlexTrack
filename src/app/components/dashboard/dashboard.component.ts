import { Component } from '@angular/core';
import moment from 'moment';
import nls from '../../framework/resources/nls/dashboard';
import {
  DashboardCards,
  dashboardCards,
} from '../../framework/resources/dashboard-cards';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatRippleModule,MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  greeting: string = '';
  name: string = 'Aalok';
  nls = nls;

  constructor() {
    const currentTime = moment();
    const currentHour = currentTime.hour();
    if (currentHour < 12) {
      this.greeting = this.nls.greeting.morning;
    } else if (currentHour < 18) {
      this.greeting = this.nls.greeting.afternoon;
    } else {
      this.greeting = this.nls.greeting.evening;
    }
  }

  dashboardCards: DashboardCards[] = dashboardCards;
}
