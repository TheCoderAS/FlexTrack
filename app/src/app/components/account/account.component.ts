import { Component, inject, Renderer2, signal, WritableSignal } from '@angular/core';
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
import { accountItems, backupDataFormFields, chnagePasswordFields, editProfileFields } from './account.resources';
import { ApiService } from '../../services/api.service';
import { MessagesService } from '../../services/messages.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, ModalWindowComponent, MatIconModule, MatButtonModule, MatRippleModule, MatListModule, RightPanelComponent, FormComponent, MatSlideToggleModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {

  private _authService: AuthenticationService = inject(AuthenticationService);
  private _api: ApiService = inject(ApiService);
  private _message: MessagesService = inject(MessagesService);
  private _appService: AppService = inject(AppService);
  private renderer: Renderer2 = inject(Renderer2);

  window: any;
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
  backupDataFormFields: WritableSignal<FormFields[]> = signal(backupDataFormFields);
  themeMode: WritableSignal<string> = signal('');
  isBiometricAvailable: WritableSignal<boolean> = signal(false);
  isBiometricEnabled: WritableSignal<boolean> = signal(false);

  constructor() {
    this.window = this._appService.getWindow();
    this.getMyProfileData();
    this.getCurrentTheme();
    this.checkBiometricAvailable();
    this.checkBiometricEnabled();
  }
  async checkBiometricAvailable() {
    try {
      await this._authService.isBiometricAvailable();
      this.isBiometricAvailable.set(true);
    } catch (error) {
      this.isBiometricAvailable.set(false);
    }
  }
  checkBiometricEnabled() {
    let isBiometricEnabled = this.window.localStorage.getItem('isBiometricEnabled');
    if (isBiometricEnabled === 'enabled') {
      this.isBiometricEnabled.set(true);
    } else {
      this.isBiometricEnabled.set(false);
    }
  }
  getCurrentTheme() {
    const prefersDark = this.window.matchMedia('(prefers-color-scheme: dark)').matches;
    const themePreference = this.window.localStorage.getItem('theme-mode');

    if (themePreference) {
      this.themeMode.set(themePreference);
    } else if (prefersDark) {
      this.themeMode.set('dark');
    } else {
      this.themeMode.set('light');
    }
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
      case 'backup-data': {
        this.modalType.set('info');
        this.modalId.set(id);
        this.modalHeading.set(nls.backupData);
        this.toggleModal(true);
        break;
      }
      case 'theme': {
        this.switchTheme();
        break;
      }
      case 'biometric': {
        this.switchBiometric();
        break;
      }
    }
  }
  switchBiometric() {
    if (this.isBiometricEnabled()) {
      this.isBiometricEnabled.set(false);
      this.window.localStorage.removeItem('isBiometricEnabled');
    } else {
      this.isBiometricEnabled.set(true);
      this.window.localStorage.setItem('isBiometricEnabled', 'enabled');
    }
  }
  getAccountItems(data: any[]): any[] {
    if (!this.isBiometricAvailable()) {
      return data.filter((item: any) => {
        return item.id !== 'biometric'
      })
    } else {
      return data;
    }
  }
  switchTheme() {
    if (this.themeMode() === 'dark') {
      this.themeMode.set('light');
    } else {
      this.themeMode.set('dark');
    }
    this.window.localStorage.setItem('theme-mode', this.themeMode());
    this.renderer.removeClass(document.body, this.themeMode() === 'dark' ? 'light-theme' : 'dark-theme');
    this.renderer.addClass(document.body, `${this.themeMode()}-theme`);
  }
  async backupData() {
    this.toggleModal(false);
    await this._api.backupData();
  }
  restorePanelOpen() {
    this.toggleModal(false);
    this.panelHeading.set(nls.importMyData);
    this.panelId.set('backup-data');
    this.togglePanel(true);
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
        break;
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
          let userPreferences: any = window.localStorage.getItem('userPreferences');
          userPreferences = userPreferences ? JSON.parse(userPreferences) : null;

          let user = await this._api.local_get('user');

          if (userPreferences && user && userPreferences.email === user.email) {
            userPreferences.password = data.new_password;
            window.localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
          }

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
      case 'backup-data': {
        await this._api.restoreBackupData(data['backup-file']);
        this.togglePanel(false)
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
