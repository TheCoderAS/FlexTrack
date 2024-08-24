import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { ModalWindowComponent } from '../../framework/modal-window/modal-window.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [ModalWindowComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {

  private _authService: AuthenticationService = inject(AuthenticationService);

  isModalOpen: WritableSignal<boolean> = signal(false);


  openModal() {
    this.isModalOpen.set(true);
  }
  logout() {
    this._authService.logout()
  }
  onModalStateChange(isOpen: boolean) {
    this.isModalOpen.set(isOpen);
  }
}
