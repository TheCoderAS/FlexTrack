import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, inject, Input, Output, TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AppService } from '../../services/app.service';
import { slideInOut } from '../../animations';
import nls from '../resources/nls/generic';

@Component({
  selector: 'app-right-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatRippleModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './right-panel.component.html',
  styleUrl: './right-panel.component.scss',
  animations: [slideInOut]
})
export class RightPanelComponent {

  _appService: AppService = inject(AppService);

  @Input() type: 'confirm' | 'info' = 'confirm';
  @Input('panel-heading') heading: string = '';
  @Input() isOpen: boolean = false;
  @Input() showCloseButton: boolean = true;
  @Input() showHeader: boolean = true;
  @Output() onCancel = new EventEmitter<boolean>();
  @Output() onSubmit = new EventEmitter<boolean>();

  @ContentChild(TemplateRef) content!: TemplateRef<any>;

  nls = nls;
  cancelPanel() {
    this.isOpen = !this.isOpen;
    this.onCancel.emit(this.isOpen);
  }
  submitPanel() {
    this.isOpen = !this.isOpen;
    this.onSubmit.emit(this.isOpen);
  }
}
