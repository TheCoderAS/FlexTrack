import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-fab-button',
  standalone: true,
  imports: [MatIconModule, MatRippleModule,
    MatButtonModule,
  ],
  templateUrl: './fab-button.component.html',
  styleUrl: './fab-button.component.scss'
})
export class FabButtonComponent {
  @Output('on-click') onClick = new EventEmitter();
  @Input('disabled') disabled = false;
  constructor() { }

  onClickButton(event: MouseEvent): void {
    this.onClick.emit(event);
  }
}
