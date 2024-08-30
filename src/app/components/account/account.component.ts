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

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, ModalWindowComponent, MatIconModule, MatButtonModule, MatRippleModule, MatListModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {

  private _authService: AuthenticationService = inject(AuthenticationService);

  nls = nls;
  moment = moment;
  isModalOpen: WritableSignal<boolean> = signal(false);
  modalType: WritableSignal<string> = signal('');
  accountItems: WritableSignal<any> = signal([]);
  modalId: WritableSignal<string> = signal('');
  modalHeading: WritableSignal<string> = signal('');
  myProfileData: WritableSignal<any> = signal(null);

  constructor() {
    this.accountItems.set([
      { id: 'view-profile', label: nls.ViewProfile },
      { id: 'edit-profile', label: nls.EditProfile },
      { id: 'change-password', label: nls.ChangePassword },
      { id: 'my-plan', label: nls.MyPlan, disabled: true },
      { id: 'help', label: nls.HelpSupport },
      { id: 'about', label: nls.About },
    ]);
    this.getMyProfileData();
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
    }
  }
  toggleModal(state: boolean) {
    this.isModalOpen.set(state);
  }
  submitModal(state: boolean) {
    switch (this.modalId()) {
      case 'logout': {
        this.modalType.set('');
        this.modalId.set('');
        this.modalHeading.set('');
        this.toggleModal(false);
        this.logout();
        break;
      }
    }

  }

  private logout() {
    this._authService.logout();
  }

}
