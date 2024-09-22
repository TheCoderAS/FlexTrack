import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isLoading: WritableSignal<boolean>=signal(true);

  changeLoaderState(state: string) {
    if (state === 'stop') {
      this.isLoading.set(false);
    } else if (state === 'start') {
      this.isLoading.set(true)
    }
  }
}
