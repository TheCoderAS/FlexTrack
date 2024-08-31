import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { ModalWindowComponent } from '../../framework/modal-window/modal-window.component';
import { MatIconModule } from '@angular/material/icon';
import nls from '../../framework/resources/nls/accounts';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import { RightPanelComponent } from "../../framework/right-panel/right-panel.component";
import { FormComponent } from "../../framework/form/form.component";
import { FormFields } from '../../framework/form/form.interfaces';
import { accountItems, chnagePasswordFields, editProfileFields } from './account.resources';
import { ApiService } from '../../services/api.service';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, ModalWindowComponent, MatIconModule, MatButtonModule, MatRippleModule, MatListModule, RightPanelComponent, FormComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {

  private _authService: AuthenticationService = inject(AuthenticationService);
  private _api: ApiService = inject(ApiService);
  private _message: MessagesService = inject(MessagesService);

  nls = nls;
  moment = moment;
  isModalOpen: WritableSignal<boolean> = signal(false);
  modalType: WritableSignal<string> = signal('');
  accountItems: WritableSignal<any> = signal(accountItems);
  modalId: WritableSignal<string> = signal('');
  modalHeading: WritableSignal<string> = signal('');
  myProfileData: WritableSignal<any> = signal(null);
  rightPanelOpen: WritableSignal<boolean> = signal(false);
  panelId: WritableSignal<string> = signal('');
  panelHeading: WritableSignal<string> = signal('');
  changePasswordFields: WritableSignal<FormFields[]> = signal(chnagePasswordFields);
  editProfileFields: WritableSignal<FormFields[]> = signal(editProfileFields);

  constructor() {
    this.getMyProfileData();
  }
  handleFormChange(data: any) {

  }
  getMyProfileData() {
    this.myProfileData = this._authService.currentUser;
  }
  onClickAccountItem(id: string, disabled = false) {
    if (disabled) {
      return;
    }
    switch (id) {
      case 'logout': {
        this.modalType.set('confirm');
        this.modalId.set(id);
        this.modalHeading.set(nls.logout);
        this.toggleModal(true);
        break;
      }
      case 'view-profile': {
        this.modalType.set('info');
        this.modalId.set(id);
        this.modalHeading.set(nls.EditProfile);
        this.toggleModal(true);
        break;
      }
      case 'change-password': {
        this.panelHeading.set(nls.ChangePassword);
        this.panelId.set(id);
        this.togglePanel(true);
        break;
      }
      case 'edit-profile': {
        this.panelHeading.set(nls.EditProfile);
        this.panelId.set(id);
        let filledEditProfileField = editProfileFields.map((item: FormFields) => {
          item.defaultValue = this.myProfileData()[item.name];
          return item
        })
        this.editProfileFields.set(filledEditProfileField)

        this.togglePanel(true);
        break;
      }
      case 'help': {
        this.modalType.set('info');
        this.modalId.set(id);
        this.modalHeading.set(nls.HelpSupport);
        this.toggleModal(true);
        break;
      }
      case 'about': {
        this.modalType.set('info');
        this.modalId.set(id);
        this.modalHeading.set(nls.About);
        this.toggleModal(true);
        break;
      }
      case 'reset-account': {
        this.modalType.set('confirm');
        this.modalId.set(id);
        this.modalHeading.set(nls.resetAccount);
        this.toggleModal(true);
        break;
      }
    }
  }
  toggleModal(state: boolean) {
    this.isModalOpen.set(state);
    if (!state) {
      this.modalType.set('');
      this.modalId.set('');
      this.modalHeading.set('');
    }
  }
  async submitModal(state: boolean) {
    switch (this.modalId()) {
      case 'logout': {
        await this.logout();
        this.toggleModal(false);
        break;
      }
      case 'reset-account': {
        await this._api.local_clear();
        this.toggleModal(false);
      }
    }

  }
  togglePanel(state: boolean) {
    this.rightPanelOpen.set(state);
    if (!state) {
      this.panelId.set('');
      this.panelHeading.set('');
    }
  }
  async submitPanel(data: any): Promise<void> {
    switch (this.panelId()) {
      case 'change-password': {
        let result = await this._api.hit('users/change_password', 'post', data);
        if (result.success) {
          this._message.success(result.message);
          this.togglePanel(false)
        } else {
          if (result.name === 'IncorrectPasswordError') {
            this._message.error(nls.incorrectPassword);
          }
          else {
            this._message.error(result.message);
          }
        }
        break;
      }
      case 'edit-profile': {
        let result = await this._api.hit('users/profile/update', 'put', data);
        if (result.success) {
          this._message.success(result.message);
          let currentUser = await this._api.hit('users/current', 'get');
          if (currentUser.isAuthenticated) {
            await this._api.local_post('user', currentUser.user);
            this.myProfileData.set(currentUser.user)
          } else {
            await this._api.local_delete('user');
            await this._api.local_delete('access');
          }
          this.togglePanel(false)
        } else {
          this._message.error(result.message);
        }
        break;
      }
      default:
        break;
    }
  }

  private async logout() {
    await this._authService.logout();
  }

}
