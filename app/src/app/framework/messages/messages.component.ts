import { Component, inject, Signal } from '@angular/core';
import { Message, MessagesService } from '../../services/messages.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {
  private messageService = inject(MessagesService);
  messages: Signal<Message[]> = this.messageService.messages;
}
