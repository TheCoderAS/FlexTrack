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

export interface TaskItem {
  name: string;
  [key: string]: any;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [FabButtonComponent, FormComponent, RightPanelComponent, ModalWindowComponent, CommonModule, MatButtonModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  _api: ApiService = inject(ApiService);

  nls = nls;
  rightPanelOpen: WritableSignal<boolean> = signal(false);
  isModalOpen: WritableSignal<boolean> = signal(false);
  isEdit = new BehaviorSubject<any>(null);
  taskFormFields = new BehaviorSubject<FormFields[]>([]);
  modalInfo: WritableSignal<string[]> = signal(['', '', '']);
  ngOnInit(): void {
    this.settaskFormFields();
  }
  async settaskFormFields() {
    let data = await this.getInitialFormFields();
    this.taskFormFields.next(data);
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
  handleFormChange(data: any) {

  }
  closePanel(data: any): void {
    this.isModalOpen.set(true);
    this.modalInfo.set(['add-edit', nls.CancelAddHeader, 'confirm']);
  }

  async togglePanel(state: boolean) {
    this.rightPanelOpen.set(state);
    if (!state) {
      this.taskFormFields.next(await this.getInitialFormFields())
    }
  }
  submitPanel(data: any): void {
    this.togglePanel(false);
    //do something
    console.log('Task Data:', data);
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
