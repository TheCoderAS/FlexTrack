import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { ModalWindowComponent } from '../../framework/modal-window/modal-window.component';
import { MatIconModule } from '@angular/material/icon';
import nls from '../../framework/resources/nls/accounts';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [ModalWindowComponent, MatIconModule, MatButtonModule, MatRippleModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {

  private _authService: AuthenticationService = inject(AuthenticationService);

  nls = nls;
  isModalOpen: WritableSignal<boolean> = signal(false);


  openModal() {
    this.isModalOpen.set(true);
  }
  closeModal() {
    this.isModalOpen.set(false);
  }
  logout() {
    this._authService.logout();
    this.closeModal();
  }
  onModalStateChange(isOpen: boolean) {
    this.isModalOpen.set(isOpen);
  }
}
