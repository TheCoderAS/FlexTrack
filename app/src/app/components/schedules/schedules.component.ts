import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormComponent } from "../../framework/form/form.component";
import { CommonModule } from '@angular/common';
import nls from '../../framework/resources/nls/schedules';
import { BehaviorSubject } from 'rxjs';
import { FormFields } from '../../framework/form/form.interfaces';
import { ApiService } from '../../services/api.service';
import { FabButtonComponent } from "../../framework/fab-button/fab-button.component";
import { RightPanelComponent } from "../../framework/right-panel/right-panel.component";
import { ModalWindowComponent } from "../../framework/modal-window/modal-window.component";
import { MessagesService } from '../../services/messages.service';
import moment from 'moment';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { weeklyField } from './schedule.resources';

@Component({
  selector: 'app-schedules',
  standalone: true,
  imports: [CommonModule, FormComponent, FabButtonComponent, RightPanelComponent, ModalWindowComponent, MatIconModule, MatRippleModule],
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.scss'
})
export class SchedulesComponent implements OnInit {
  private _api: ApiService = inject(ApiService);
  private _message: MessagesService = inject(MessagesService);

  nls = nls;
  moment = moment;

  widgetSelectFormFields = new BehaviorSubject<FormFields[]>([]);
  selectedWidget: WritableSignal<any> = signal('');
  rightPanelOpen: WritableSignal<boolean> = signal(false);
  isEdit = new BehaviorSubject<boolean>(false);
  isModalOpen: WritableSignal<boolean> = signal(false);
  modalInfo: WritableSignal<string[]> = signal(['', '', '']);
  scheduleFormFields = new BehaviorSubject<FormFields[]>([]);
  schedulesList: WritableSignal<any[]> = signal([]);
  selelctedSchedule: WritableSignal<string> = signal('');

  ngOnInit(): void {
    this.setWidgetSelectFormFields();
  }

  private isWeekly(widgets: any[], widgetId: string): boolean {
    return widgets.some(widget => widget.id === widgetId && widget.type === "WEEKLY");
  }
  async setScheduleFormFields() {
    let widgetData = await this.buildWidgetOptions()
    let widgetOptions = widgetData.options;
    let defaultWidget = this.selectedWidget() ? this.selectedWidget().widgetId : widgetOptions[0].value;
    let taskOptions = await this.buildTasksOptions(defaultWidget);
    let weekly: boolean = this.isWeekly(widgetData.widgets, defaultWidget);

    let data = await this.getInitialFormFields(widgetOptions, defaultWidget, taskOptions, weekly);

    this.scheduleFormFields.next(data);
  }

  async getInitialFormFields(widgetOptions: any, defaultWidget: any, taskOptions: any, weekly: boolean = false): Promise<FormFields[]> {
    // console.log(defaultWidget);
    let scheduleFields: FormFields[] = [
      {
        name: 'widgetId', label: nls.SelectedWidget, type: 'select', required: true, options: widgetOptions, defaultValue: defaultWidget
      },
      {
        name: 'scheduleName', label: nls.scheduleName, type: 'text', required: true, maxlength: 28
      },
      {
        name: 'scheduleDescription', label: nls.scheduleDescription, type: 'text', required: true,
      },
      {
        name: 'tasks', label: nls.selectTasks, type: 'select', required: true, multiple: true, options: taskOptions
      },
    ];
    if (weekly) {
      weeklyField.defaultValue = '';
      scheduleFields.splice(3, 0, weeklyField);
    }
    // console.log(scheduleFields);
    return scheduleFields;
  }

  async setWidgetSelectFormFields() {
    let options = (await this.buildWidgetOptions()).options;
    let defaultValue = this.selectedWidget() ? this.selectedWidget().widgetId : options[0]?.value
    let field = {
      name: 'widgetId', label: nls.SelectedWidget, type: 'select', required: true, options: options, defaultValue: defaultValue
    }
    this.widgetSelectFormFields.next([field])
  }
  async buildWidgetOptions() {
    let widgets = await this._api.local_get('widgets');
    let options: { label: any; value: any; }[] = [];
    widgets.forEach((element: any) => {
      options.push({ label: element.title, value: element.id })
    });
    return { options, widgets };
  }
  async buildTasksOptions(widget: string) {
    let tasks = await this._api.local_get('tasks');
    let filteredTasks = tasks.filter((task: any) => {
      return task.widgetId === widget;
    })
    let options: { label: any; value: any; }[] = [];
    filteredTasks.forEach((element: any) => {
      options.push({ label: element.taskName, value: element.id })
    });
    return options;
  }
  async handleFormChange(data: any) {
    this.selectedWidget.set(data);
    let schedules = await this._api.local_get('schedules');
    schedules = schedules.filter((item: any) => item.widgetId === data.widgetId);
    this.schedulesList.set(schedules);
  }
  prevFormData: any = {};
  async handleAddScheduleFormChange(data: any) {
    // console.log(data)
    if (this.prevFormData && this.prevFormData.widgetId !== data.widgetId) {
      // this.scheduleFormFields.next([]);
      // await delay(20);

      let widgetData = await this.buildWidgetOptions()
      let widgetOptions = widgetData.options;
      let defaultWidget = data.widgetId;
      let taskOptions = await this.buildTasksOptions(defaultWidget);

      let weekly: boolean = this.isWeekly(widgetData.widgets, defaultWidget);

      let fields = await this.getInitialFormFields(widgetOptions, defaultWidget, taskOptions, weekly);
      fields.map((field: FormFields) => {
        field.defaultValue = data[field.name];
        if (field.name === 'tasks' || field.name === 'startDay') {
          field.defaultValue = ''
        }

        return field;
      });
      this.scheduleFormFields.next(fields);
    }
    this.prevFormData = data;
  }

  async togglePanel(state: boolean) {
    this.rightPanelOpen.set(state);
  }
  closePanel(data: any): void {
    this.isModalOpen.set(true);
    if (this.isEdit.getValue()) {
      this.modalInfo.set(['add-edit', nls.editSchedule, 'confirm']);

    } else {
      this.modalInfo.set(['add-edit', nls.CancelAddHeader, 'confirm']);
    }
  }
  async createSchedule() {
    this.togglePanel(true);
    this.setScheduleFormFields();
  }
  toggleModal(state: boolean) {
    this.isModalOpen.set(state);
  }
  async submitModal(data: any) {
    this.togglePanel(false);
    this.toggleModal(false);
    this.modalInfo.set(['', '', '', '']);
    this.selelctedSchedule.set('');
    this.isEdit.next(false);

  }
  async submitAddSchedule(data: any) {
    let result;
    if (this.isEdit.getValue()) {
      data.id = this.selelctedSchedule();
      result = await this._api.local_put('schedules', data);
    } else {
      result = await this._api.local_post('schedules', data)
    }
    if (result.success) {
      this._message.success(result.message);
      this.handleFormChange(this.selectedWidget());
      this.togglePanel(false);
      this.selelctedSchedule.set('');
      this.isEdit.next(false);
    } else {
      this._message.error(result.message)
    }
  }
  async onClickScheduleItem(data: any) {
    this.selelctedSchedule.set(data.id);
    this.isEdit.next(true);
    this.togglePanel(true);

    let widgetData = await this.buildWidgetOptions()
    let widgetOptions = widgetData.options;

    let defaultWidget = data.widgetId;
    let taskOptions = await this.buildTasksOptions(defaultWidget);

    let weekly: boolean = widgetData.widgets.find((item: any) => item.id === defaultWidget)?.type === "WEEKLY";

    let fields = await this.getInitialFormFields(widgetOptions, defaultWidget, taskOptions, weekly);
    fields.map((field: FormFields) => {
      field.defaultValue = data[field.name];
      return field;
    });
    this.scheduleFormFields.next(fields);
  }
  async copyEditAdd(data: any) {
    this.togglePanel(true);

    let widgetData = await this.buildWidgetOptions()
    let widgetOptions = widgetData.options;

    let defaultWidget = data.widgetId;
    let taskOptions = await this.buildTasksOptions(defaultWidget);

    let weekly: boolean = widgetData.widgets.find((item: any) => item.id === defaultWidget)?.type === "WEEKLY";

    let fields = await this.getInitialFormFields(widgetOptions, defaultWidget, taskOptions, weekly);
    fields.map((field: FormFields) => {
      field.defaultValue = data[field.name];
      return field;
    });
    this.scheduleFormFields.next(fields);

  }
}
