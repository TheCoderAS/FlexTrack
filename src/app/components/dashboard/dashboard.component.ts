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
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { RightPanelComponent } from '../../framework/right-panel/right-panel.component';
import { FormComponent } from "../../framework/form/form.component";
import { FormFields } from '../../framework/form/form.interfaces';
import { ModalWindowComponent } from "../../framework/modal-window/modal-window.component";
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { widgetForm } from './widget.resources';
import { MessagesService } from '../../services/messages.service';
import { FabButtonComponent } from "../../framework/fab-button/fab-button.component";

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
    ModalWindowComponent,
    FabButtonComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {

  private _api: ApiService = inject(ApiService);
  private _message: MessagesService = inject(MessagesService);

  greeting: string = '';
  name: string = 'Fitty';
  nls = nls;
  rightPanelOpen: WritableSignal<boolean> = signal(false);
  widgetFormFields: WritableSignal<FormFields[]> = signal(widgetForm);
  addWidgetData: any = null;
  dashboardCards: WritableSignal<DashboardCards[]> = signal([]);
  reorderEbabled: boolean = false;
  isModalOpen: WritableSignal<boolean> = signal(false);
  isDeleteModalOpen: WritableSignal<boolean> = signal(false);
  isEdit = new BehaviorSubject<any>(null);

  constructor() {
    this.setGreeting();
    this.isEditSubscription();
    this.getWidgets();
  }
  async setGreeting() {
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
    let user = await this._api.local_get('user');
    if (user) {
      this.name = user.first_name
    }
  }
  isEditSubscription() {
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
  async getWidgets(): Promise<void> {
    let result = await this._api.local_get('widgets');
    result = result.map((item: DashboardCards) => {
      item.to = '/logging/' + item.id;
      return item;
    });
    this.dashboardCards.set(result);
  }
  async setWidget(data: DashboardCards[]): Promise<void> {
    await this._api.local_put('widgets', data);
    this.getWidgets();
    this._message.success(nls.reorderWidgetSuccess)
  }
  async createWidget(data: DashboardCards): Promise<void> {
    await this._api.local_post('widgets', data);
    this.getWidgets();
    this._message.success(nls.addWidgetSuccess)
  }
  async updateWidget(data: DashboardCards): Promise<void> {
    await this._api.local_put('widgets', data)
    this.getWidgets();
    this._message.success(nls.updateWidgetSuccess)

  }
  async deleteWidget(id: string): Promise<void> {
    await this._api.local_delete('widgets', id);
    this.getWidgets();
    this._message.success(nls.deleteWidgetSuccess)

  }

  enableReorder(event: MouseEvent): void {
    if (this.reorderEbabled) {
      this.setWidget(this.dashboardCards());
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
        // console.log("before reject")

        reject("No file provided");
        return;
      }

      const reader = new FileReader();
      // console.log("after reader declare")

      reader.onload = () => {
        const blob = reader.result as string;
        // console.log("before resolve", blob)
        resolve(blob);
      };

      reader.onerror = () => {
        reject("Error reading file");
      };

      // console.log("befrore reading as url", file)
      reader.readAsDataURL(file);
    });
  }
  async handleFormChange(data: any) {
    this.addWidgetData = data;
    // console.log("before converting blob condition", this.addWidgetData.motivation);
    if (this.addWidgetData.motivation && typeof this.addWidgetData.motivation === 'object') {
      // console.log("before converting blob", this.addWidgetData.motivation);
      const blob = await this.convertToBlob(this.addWidgetData.motivation);
      // console.log(blob);
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
      this.updateWidget(updateData);
      this.isEdit.next(null);

    } else {
      this.createWidget(this.addWidgetData);
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
    this.deleteWidget(this.isEdit.getValue().id);
    this.isEdit.next(null);
  }
  editWidget(item: any) {
    this.isEdit.next(item);
    this.togglePanel(true);
  }
}
