import { ChangeDetectorRef, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
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
import { MatIconModule } from '@angular/material/icon';
import moment from 'moment';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { v4 as uuidv4 } from 'uuid';

export interface TaskItem {
  name: string;
  [key: string]: any;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    FabButtonComponent,
    FormComponent,
    RightPanelComponent,
    ModalWindowComponent,
    CommonModule,
    MatButtonModule,
    MatRippleModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  _api: ApiService = inject(ApiService);
  _message: MessagesService = inject(MessagesService);
  private cdRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  private fb: FormBuilder = inject(FormBuilder);

  moment = moment;
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
  addTaskFormFields = new BehaviorSubject<FormFields[]>([{
    name: 'itemName',
    label: 'Item Name',
    required: true,
    type: 'text'
  }]);

  addTaskItems: WritableSignal<any[]> = signal([]);
  addTaskFormData = new BehaviorSubject<any>({});
  panelSubmitButtonDisbale: WritableSignal<boolean> = signal(true);

  ngOnInit(): void {
    this.settaskFormFields();
    this.getTasksList();
    this.addTaskFormData.subscribe((value) => {
      let formKeys = Object.keys(value);
      // console.log(formKeys, value);
      let valid = true;
      for (let key of formKeys) {
        if (!value[key] || !value.items || value.items.length === 0) {
          valid = false;
        }
      }
      this.panelSubmitButtonDisbale.set(!valid);
    })
  }
  async getTasksList() {
    let tasks = await this._api.local_get('tasks');
    this.tasksList.set(tasks);
  }
  async settaskFormFields() {
    let data = await this.getInitialFormFields();
    this.taskFormFields.next(data);

    let widgetemp = { ...data[0] };
    widgetemp.defaultValue = (widgetemp as any).options[0].value
    this.widgetSelectFormFields.next([widgetemp])
  }
  async getInitialFormFields(): Promise<FormFields[]> {
    let options = await this.buildWidgetOptions();
    // console.log(this.selectedWidget());
    return [
      {
        name: 'widgetId', label: nls.SelectedWidget, type: 'select', required: true, options: options, defaultValue: this.selectedWidget() ? this.selectedWidget().widgetId : options[0].value
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
    tasks = tasks.filter((item: any) => item.widgetId === data.widgetId);
    this.tasksList.set(tasks);
  }
  async handleAddTaskFormChange(data: any) {
    let values = this.addTaskFormData.getValue();
    this.addTaskFormData.next({ ...values, ...data });
  }

  closePanel(data: any): void {
    this.isModalOpen.set(true);
    this.modalInfo.set(['add-edit', nls.CancelAddHeader, 'confirm']);
  }

  async togglePanel(state: boolean) {
    this.rightPanelOpen.set(state);
    if (!state) {
      this.selelctedTask.set('');
      this.addTaskFormData.next({});
      this.addTaskItems.set([]);
      this.toggleModal(false);
      this.modalInfo.set(['', '', '', '']);
    }
  }
  async submitPanel(data: any): Promise<void> {
    //do something
    data = this.addTaskFormData.getValue();

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
    } else {
      this._message.error(result.message)
    }
  }

  onClickAddItem() {
    if (this.addTaskItems().length) {
      let formFields = this.addTaskItems()[0].formFields;
      formFields.map((item: any) => {
        item.defaultValue = '';
        item.deletable = false;
        return item;
      })
      this.addTaskFormFields.next(formFields)
    } else {
      this.addTaskFormFields.next([{
        name: 'itemName',
        label: 'Item Name',
        required: true,
        type: 'text'
      }])
    }

    this.isModalOpen.set(true);
    this.modalInfo.set(['add-task-item', nls.AddField, 'info']);

  }
  async copyEditAdd(item: any) {
    this.isEdit.next(false);
    this.selelctedTask.set('');
    this.togglePanel(true);

    let data = await this.getInitialFormFields();
    // console.log(data);
    data.map((field: FormFields) => {
      field.defaultValue = item[field.name];
      return field;
    })

    this.taskFormFields.next(data);
    this.addTaskItems.set(item.items);
    this.addTaskFormData.next(item);
  }
  async createTask() {
    this.togglePanel(true);
    this.isEdit.next(false);
    this.taskFormFields.next(await this.getInitialFormFields())
  }
  async onClickTaskItem(item: any) {
    // console.log(item);
    this.selelctedTask.set(item.id);
    this.isEdit.next(true);
    this.togglePanel(true);

    let data = await this.getInitialFormFields();
    // console.log(data);
    data.map((field: FormFields) => {
      field.defaultValue = item[field.name];
      return field;
    })

    this.taskFormFields.next(data);
    this.addTaskItems.set(item.items);
    this.addTaskFormData.next(item);
  }
  deleteSelectedTask() {
    this.isModalOpen.set(true);
    this.modalInfo.set(['delete-task', nls.deleteTask, 'confirm']);
  }
  toggleModal(state: boolean) {
    this.isModalOpen.set(state);
  }
  async submitModal(data: any) {
    if (this.modalInfo()[0] === 'add-edit') {
      this.togglePanel(false);
    } else if (this.modalInfo()[0] === 'delete-task') {
      // console.log(this.selelctedTask());
      let result = await this._api.local_delete('tasks', this.selelctedTask());
      this._message.success(result.message);
      this.handleFormChange(this.selectedWidget());
      this.selelctedTask.set('');
      this.togglePanel(false);
    }
    this.toggleModal(false);
    this.modalInfo.set(['', '', '', '']);
    this.addTaskFormData.next({});
    this.addTaskItems.set([])
  }
  onSubmitAddField(data: any): void {
    // console.log(data, this.modalInfo()[3]);
    if (this.modalInfo()[3]) {
      let oldItems = this.addTaskItems();
      let newItems = oldItems.map((item: any) => {
        // console.log(item)
        if (item.id === this.modalInfo()[3]) {
          item = { ...item, ...data }
        }
        return item;
      });
      // console.log(newItems);
      this.addTaskItems.set(newItems)
    } else {
      data.id = uuidv4();
      let oldItems = this.addTaskItems();
      this.addTaskItems.set([...oldItems, data])
    }
    let values = this.addTaskFormData.getValue();
    this.addTaskFormData.next({ ...values, items: this.addTaskItems() });
    this.toggleModal(false);
    this.modalInfo.set(['', '', '', '']);
  }
  onClickEditTaskItemFromAddPanel(data: any) {
    let formFields = data.formFields;
    formFields.map((item: any) => {
      item.defaultValue = data.formData[item.name];
      item.deletable = item.name !== 'itemName';
      return item;
    });
    this.addTaskFormFields.next(formFields)
    this.modalInfo.set(['add-task-item', nls.EditTaskItem, 'info', data.id]);
    this.isModalOpen.set(true);
  }
  onClickDeleteTaskItemFromAddPanel(data: any) {
    let oldItems = this.addTaskItems();
    let filteredItems = oldItems.filter((item: any) => {
      return item.id !== data.id;
    })
    this.addTaskItems.set(filteredItems);
    let values = this.addTaskFormData.getValue();
    this.addTaskFormData.next({ ...values, items: this.addTaskItems() });
  }
}
