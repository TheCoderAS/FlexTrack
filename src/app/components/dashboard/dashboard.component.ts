import { Component, inject, signal, WritableSignal } from '@angular/core';
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
import { RightPanelComponent } from '../../framework/right-panel/right-panel.component';
import { ApiService } from '../../services/api.service';
import { FormComponent } from "../../framework/form/form.component";
import { FormFields } from '../../framework/form/form.interfaces';

const widgetForm = [
  {
    name: 'title',
    label: nls.title,
    options: [],
    errorMessage: [
      {
        type: 'required',
        message: nls.titleRequired,
      },
      {
        type: 'pattern',
        message: nls.invalidTitle,
      },
    ],
    required: true,
    id: 'title',
    type: 'text',
    model: 'title',
    pattern: "^(?=.{1,15}$)[A-Za-z][A-Za-z\' \\-]*[A-Za-z]$",
  },
  {
    name: 'target',
    label: nls.target,
    options: [],
    errorMessage: [],
    required: false,
    id: 'target',
    type: 'text',
    model: 'target',
    pattern:''
  }
]
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
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
    RightPanelComponent,
    FormComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private _apiService: ApiService = inject(ApiService);

  greeting: string = '';
  name: string = 'Fitty';
  nls = nls;
  rightPanelOpen: WritableSignal<boolean> = signal(false);
  widgetFormFields: WritableSignal<FormFields[]> = signal(widgetForm);

  constructor() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    // console.log(currentHour,currentTime.getTimezoneOffset());
    if (currentHour < 12) {
      this.greeting = this.nls.greeting.morning;
    } else if (currentHour < 18) {
      this.greeting = this.nls.greeting.afternoon;
    } else {
      this.greeting = this.nls.greeting.evening;
    }
  }

  dashboardCards: DashboardCards[] = dashboardCards;
  reorderEbabled: boolean = false;

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
  enableReorder(event: MouseEvent): void {
    if (this.reorderEbabled) {
      // console.log(dashboardCards);
    }
    this.reorderEbabled = !this.reorderEbabled;
  }
  togglePanel(state: boolean) {
    this.rightPanelOpen.set(state);
  }
  submitPanel(data: any): void {
    console.log(data)
    this.rightPanelOpen.set(false);
  }
}
