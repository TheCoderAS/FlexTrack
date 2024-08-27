import { Component, inject, signal, WritableSignal } from '@angular/core';
import nls from '../../framework/resources/nls/dashboard';
import {
  DashboardCards,
} from '../../framework/resources/dashboard-cards';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragMove,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { RightPanelComponent } from '../../framework/right-panel/right-panel.component';
import { ApiService } from '../../services/api.service';
import { FormComponent } from "../../framework/form/form.component";
import { FormFields } from '../../framework/form/form.interfaces';
import { ModalWindowComponent } from "../../framework/modal-window/modal-window.component";
import { AppService } from '../../services/app.service';
import { BehaviorSubject } from 'rxjs';

const widgetForm = [
  {
    name: 'color',
    label: nls.color,
    options: [],
    errorMessage: [],
    defaultValue: '#450d59',
    required: false,
    id: 'color',
    type: 'color',
    model: 'color',
    pattern: ''
  },
  {
    name: 'transparency',
    label: nls.transparency,
    options: [],
    errorMessage: [],
    defaultValue: '100',
    required: false,
    id: 'transparency',
    type: 'slider',
    model: 'transparency',
    pattern: '',
    min: 0,
    max: 100
  },

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
    maxlength: 15
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
    pattern: '',
    maxlength: 20
  },
  {
    name: 'motivation',
    label: nls.motivation,
    options: [],
    errorMessage: [
      {
        type: 'required',
        message: nls.motivationRequired,
      },
      {
        type: 'maxSize',
        message: nls.maxSizeError
      }
    ],
    required: true,
    id: 'motivation',
    type: 'file',
    model: 'motivation',
    pattern: '',
    accept: ".png,.svg,.webp,.jpg,.jpeg",
    maxSize: 100 * 1024 //100 kB
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
    FormComponent,
    MatDividerModule,
    ModalWindowComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {

  private _app: AppService = inject(AppService);

  greeting: string = '';
  name: string = 'Fitty';
  nls = nls;
  rightPanelOpen: WritableSignal<boolean> = signal(false);
  widgetFormFields: WritableSignal<FormFields[]> = signal(widgetForm);
  addWidgetData: any = null;
  dashboardCards: WritableSignal<DashboardCards[]> = this._app.widgets;
  reorderEbabled: boolean = false;
  isModalOpen: WritableSignal<boolean> = signal(false);
  isDeleteModalOpen: WritableSignal<boolean> = signal(false);
  isEdit = new BehaviorSubject<any>(null);

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
    this.isEdit.subscribe(value => {
      if (value) {
        widgetForm.map((el: any) => {
          el.defaultValue = value[el.name];
          if (el.type === 'file') {
            el.required = false;
          }
          return el;
        });
      } else {
        widgetForm.map((el: any) => {
          el.defaultValue = '';
          if (el.type === 'file') {
            el.required = true;
          }
          if (el.type === 'slider') {
            el.defaultValue = 100;
          }
          if (el.type === 'color') {
            el.defaultValue = '#450d59';
          }
          return el;
        });
      }
    });
  }
  onDrop(event: CdkDragDrop<DashboardCards[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.dashboardCards(), event.previousIndex, event.currentIndex);
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
      // console.log(this.dashboardCards());
      this._app.setWidget(this.dashboardCards());
    }
    this.reorderEbabled = !this.reorderEbabled;
  }
  mapToHex(value: number): string {
    const mappedValue = Math.round((value / 100) * 255);
    let hexString = mappedValue.toString(16);
    if (hexString.length < 2) {
      hexString = '0' + hexString;
    }
    return hexString;
  }
  convertToBlob(file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject("No file provided");
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const blob = reader.result as string;
        resolve(blob);
      };

      reader.onerror = () => {
        reject("Error reading file");
      };

      reader.readAsDataURL(file);
    });
  }
  async handleFormChange(data: any) {
    this.addWidgetData = data;

    if (this.addWidgetData.motivation && this.addWidgetData.motivation instanceof File) {
      const blob = await this.convertToBlob(this.addWidgetData.motivation);
      this.addWidgetData.motivation = blob;
    }
  }
  togglePanel(state: boolean) {
    this.rightPanelOpen.set(state);
  }
  closePanel(data: any): void {
    this.isModalOpen.set(true);
  }
  submitPanel(data: any): void {
    this.rightPanelOpen.set(false);
    if (this.isEdit.getValue()) {
      let updateData = { ...this.addWidgetData, id: this.isEdit.getValue().id };
      this._app.updateWidget(updateData);
      this.isEdit.next(null);

    } else {
      this._app.createWidget(this.addWidgetData);
    }
  }
  toggleModal(state: boolean) {
    this.isModalOpen.set(state);
  }
  toggleDeleteModal(state: boolean) {
    this.isDeleteModalOpen.set(state);
  }

  submitModal(state: boolean) {
    this.isModalOpen.set(state);
    this.togglePanel(false);
    if (this.isEdit.getValue()) {
      this.isEdit.next(null);
    }
  }
  submitDeleteModal(state: boolean) {
    this.isDeleteModalOpen.set(state);
    this.togglePanel(false);
    this.deleteWidget();
  }

  editWidget(item: any) {
    this.isEdit.next(item);
    this.togglePanel(true);
  }
  deleteWidget() {
    this._app.deleteWidget(this.isEdit.getValue().id);
    this.isEdit.next(null);
  }
}
