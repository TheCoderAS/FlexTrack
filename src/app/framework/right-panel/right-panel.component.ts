import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

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
  styleUrl: './right-panel.component.scss'
})
export class RightPanelComponent {

  @Input('panel-heading') heading: string = '';
  @Input() isOpen: boolean = false;
  @Input() showCloseButton: boolean = true;
  @Output() panelStateChanged = new EventEmitter<boolean>();
  @Input() showHeader: boolean = true;

  @ContentChild(TemplateRef) content!: TemplateRef<any>;

  togglePanel() {
    this.isOpen = !this.isOpen;
    this.panelStateChanged.emit(this.isOpen);
  }

}
