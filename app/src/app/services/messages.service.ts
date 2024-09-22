import { Injectable, signal, WritableSignal } from '@angular/core';

export interface Message {
  id: number;
  type: 'success' | 'error' | 'warning';
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private currentId = 0;
  messages: WritableSignal<Message[]> = signal([]);

  showMessage(type: 'success' | 'error' | 'warning', text: string) {
    const id = this.currentId++;
    const message: Message = { id, type, text };
    this.messages.update((currentMessages) => [...currentMessages, message]);

    setTimeout(() => {
      this.removeMessage(id);
    }, 3000); // 3 seconds
  }

  success(message: string) {
    this.showMessage('success', message);
  }

  error(message: string) {
    this.showMessage('error', message);
  }

  warning(message: string) {
    this.showMessage('warning', message);
  }

  private removeMessage(id: number) {
    this.messages.update((currentMessages) =>
      currentMessages.filter((msg) => msg.id !== id)
    );
  }
}
