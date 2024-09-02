import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FabButtonComponent } from "../../framework/fab-button/fab-button.component";
import { FormComponent } from "../../framework/form/form.component";
import { RightPanelComponent } from "../../framework/right-panel/right-panel.component";
import { BehaviorSubject } from 'rxjs';
import nls from '../../framework/resources/nls/tasks';
import { FormFields } from '../../framework/form/form.interfaces';
import { ModalWindowComponent } from "../../framework/modal-window/modal-window.component";
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api.service';
import { MessagesService } from '../../services/messages.service';
import { MatRippleModule } from '@angular/material/core';

export interface TaskItem {
  name: string;
  [key: string]: any;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [FabButtonComponent, FormComponent, RightPanelComponent, ModalWindowComponent, CommonModule, MatButtonModule, MatRippleModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  _api: ApiService = inject(ApiService);
  _message: MessagesService = inject(MessagesService);

  nls = nls;
  rightPanelOpen: WritableSignal<boolean> = signal(false);
  isModalOpen: WritableSignal<boolean> = signal(false);
  isEdit = new BehaviorSubject<boolean>(false);
  taskFormFields = new BehaviorSubject<FormFields[]>([]);
  widgetSelectFormFields = new BehaviorSubject<FormFields[]>([]);
  modalInfo: WritableSignal<string[]> = signal(['', '', '']);
  tasksList: WritableSignal<any[]> = signal([]);
  selectedWidget: WritableSignal<any> = signal('');
  selelctedTask: WritableSignal<string> = signal('');

  ngOnInit(): void {
    this.settaskFormFields();
    this.getTasksList()
  }
  async getTasksList() {
    let tasks = await this._api.local_get('tasks');
    this.tasksList.set(tasks);
  }
  async settaskFormFields() {
    let data = await this.getInitialFormFields();
    this.taskFormFields.next(data);

    let widgetemp = { ...data[0] };
    widgetemp.defaultValue = (widgetemp as any).options[0].label
    this.widgetSelectFormFields.next([widgetemp])
  }
  async getInitialFormFields(): Promise<FormFields[]> {
    return [
      {
        name: 'widgetId', label: nls.SelectedWidget, type: 'select', required: true, options: await this.buildWidgetOptions()
      },
      {
        name: 'taskName', label: nls.taskName, type: 'text', required: true,
      },
      {
        name: 'taskDescription', label: nls.taskDescription, type: 'text', required: true,
      },
    ];
  }
  async buildWidgetOptions() {
    let widgets = await this._api.local_get('widgets');
    let options: { label: any; value: any; }[] = [];
    widgets.forEach((element: any) => {
      options.push({ label: element.title, value: element.id })
    });
    return options;
  }
  async handleFormChange(data: any) {
    this.selectedWidget.set(data);
    let tasks = await this._api.local_get('tasks');
    tasks = tasks.filter((item: any) => item.formData.widgetId === data.widgetId);
    // console.log(tasks)
    this.tasksList.set(tasks);
  }
  closePanel(data: any): void {
    this.isModalOpen.set(true);
    this.modalInfo.set(['add-edit', nls.CancelAddHeader, 'confirm']);
  }

  async togglePanel(state: boolean) {
    this.rightPanelOpen.set(state);
  }
  async submitPanel(data: any): Promise<void> {
    //do something
    let result;
    if (this.selelctedTask()) {
      data.id = this.selelctedTask();
      result = await this._api.local_put('tasks', data);

    } else {
      result = await this._api.local_post('tasks', data);
    }
    if (result.success) {
      this._message.success(result.message);
      this.handleFormChange(this.selectedWidget());

      this.togglePanel(false);
      this.selelctedTask.set('')
    } else {
      this._message.error(result.message)
    }
  }

  async createTask() {
    this.togglePanel(true);
    this.isEdit.next(false);
    this.taskFormFields.next(await this.getInitialFormFields())
  }
  async onClickTaskItem(item: any) {
    this.selelctedTask.set(item.id);
    this.isEdit.next(true);
    this.togglePanel(true);
    let fields = item.formFields;
    fields.map(async (field: any) => {
      field.defaultValue = item.formData[field.name];
      if (field.type === 'select') {
        field.options = await this.buildWidgetOptions()
      }
      return field;
    });
    this.taskFormFields.next(fields)
  }
  toggleModal(state: boolean) {
    this.isModalOpen.set(state);
  }
  submitModal(data: any) {

    if (this.modalInfo()[0] === 'add-edit') {
      this.togglePanel(false);
    }
    this.toggleModal(false);
    this.modalInfo.set(['', '', '']);
  }
}
