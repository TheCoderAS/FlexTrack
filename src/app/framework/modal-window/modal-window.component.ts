import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { fadeZoomInOut } from '../../animations/fadeZoomInOut';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-modal-window',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDividerModule, MatButtonModule],
  templateUrl: './modal-window.component.html',
  styleUrl: './modal-window.component.scss',
  animations: [fadeZoomInOut]
})
export class ModalWindowComponent {
  @Input() isOpen = false;
  @Input('modal-heading') heading: string = '';
  @Input() showCloseButton: boolean = true;
  @Input() showHeader: boolean = true;
  
  @Output() isOpenChange = new EventEmitter<boolean>();

  @ContentChild(TemplateRef) content!: TemplateRef<any>;

  toggleModal() {
    this.isOpen = !this.isOpen;
    this.isOpenChange.emit(this.isOpen);
  }
}
