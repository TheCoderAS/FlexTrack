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
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatRippleModule,
    MatButtonModule,
    RouterModule,
    MatMenuModule,
    CdkDropList, CdkDrag, CdkDragPlaceholder
  ],
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
  reorderEbabled:boolean=false;

  onDrop(event: CdkDragDrop<DashboardCards[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.dashboardCards, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
  enableReorder(event:MouseEvent):void{
    if(this.reorderEbabled){
      console.log(dashboardCards);
    }
    this.reorderEbabled=!this.reorderEbabled;
  }
  addNewWidget(event:MouseEvent):void{
    this.dashboardCards=[...this.dashboardCards,this.dashboardCards[Math.floor(Math.random()*(this.dashboardCards.length))]]
  }
}
