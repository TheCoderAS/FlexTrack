import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { fadeZoomInOut } from '../../animations';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import nls from '../resources/nls/generic';

@Component({
  selector: 'app-modal-window',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDividerModule, MatButtonModule],
  templateUrl: './modal-window.component.html',
  styleUrl: './modal-window.component.scss',
  animations: [fadeZoomInOut]
})
export class ModalWindowComponent {
  @Input() type: 'confirm' | 'info' | string = 'confirm';
  @Input() isOpen = false;
  @Input('message-title') messageTitle = nls.areYouSure;
  @Input('modal-heading') heading: string = '';
  @Input() showCloseButton: boolean = true;
  @Input() showHeader: boolean = true;
  @Output() onCancel = new EventEmitter<boolean>();
  @Output() onSubmit = new EventEmitter<boolean>();

  @ContentChild(TemplateRef) content!: TemplateRef<any>;

  nls = nls;
  cancelModal() {
    this.isOpen = !this.isOpen;
    this.onCancel.emit(this.isOpen);
  }
  submitModal() {
    this.isOpen = !this.isOpen;
    this.onSubmit.emit(this.isOpen);
  }

}
