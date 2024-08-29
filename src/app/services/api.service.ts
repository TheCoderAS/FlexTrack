import { inject, Injectable } from '@angular/core';
import { LoaderService } from './loader.service';
import { DashboardCards } from '../framework/resources/dashboard-cards';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private storage: Storage = localStorage;
  private _loader: LoaderService = inject(LoaderService);
  private _user: any;
  constructor() {
    this._user = this.storage.getItem('currentuser');
    if (this._user) {
      this._user = JSON.parse(this._user);
    }
  }
  getSavingKey(key: string) {
    return this._user?.email + '/' + key;
  }
  // Create or Update
  async post(key: string, value: any): Promise<void> {
    this._loader.changeLoaderState('start');
    await delay(200);
    if (key === 'widgets') {
      let newData = [];
      let prevData = this.storage.getItem(this.getSavingKey(key));
      if (prevData) {
        newData = JSON.parse(prevData);
      }
      value.order = newData.length + 1;
      value.id = "id" + (newData.length + 1);
      newData.push(value);
      this.storage.setItem(this.getSavingKey(key), JSON.stringify(newData));
    } else if (key === 'users') {
      let prevData: any = this.storage.getItem(key);
      prevData = prevData ? JSON.parse(prevData) : [];

      let exists: boolean = false;
      let newData = prevData.map((item: any) => {
        if (item.email === value.email) {
          item = value;
          exists = true;
        }
        return item
      });
      if (!exists) {
        newData.push(value);
      }

      this.storage.setItem(key, JSON.stringify(newData));
      this.storage.setItem('currentuser', JSON.stringify(value));
      this._user = value;
    }
    this._loader.changeLoaderState('stop');
  }

  // Read
  async get(key: string): Promise<any> {
    this._loader.changeLoaderState('start');
    await delay(200);

    let result;
    if (key === 'widgets') {
      let item = this.storage.getItem(this.getSavingKey(key));
      let parsedItem = item ? JSON.parse(item) : [];
      parsedItem.sort((a: any, b: any) => {
        return a.order - b.order;
      })
      result = parsedItem;
    }
    this._loader.changeLoaderState('stop');

    return result;
  }

  // Update (can be combined with save)
  async put(key: string, value: any): Promise<void> {
    this._loader.changeLoaderState('start');
    await delay(200);

    let data;
    if (key === 'widgets') {
      if (Array.isArray(value)) {
        let newData = value.map((item: any, index: number) => {
          item.order = index + 1;
          return item;
        });
        data = newData;
      } else {
        let oldData: any = this.storage.getItem(this.getSavingKey(key));
        oldData = oldData ? JSON.parse(oldData) : [];
        let updatedData = oldData?.map((item: any) => {
          if (item.id === value.id) {
            item = value;
          }
          return item;
        });
        data = updatedData;

      }
    } else if (key === 'currentuser') {
      // let prevData: any = this.storage.getItem('users');
      // prevData = prevData ? JSON.parse(prevData) : [];

      // let existingValue = prevData.find((item: any) => item.email === value.email);
      // if (existingValue) {
      this.storage.setItem('currentuser', JSON.stringify({ email: value.email }));
      // }
      this._user = value
      return;
    }
    this.storage.setItem(this.getSavingKey(key), JSON.stringify(data));
    this._loader.changeLoaderState('stop');
  }

  // Delete
  async delete(key: string, id: string): Promise<void> {
    this._loader.changeLoaderState('start');
    await delay(200);
    let data;
    if (key === 'widgets') {
      let oldData: any = this.storage.getItem(this.getSavingKey(key));
      oldData = oldData ? JSON.parse(oldData) : [];
      oldData = oldData.filter((item: any) => {
        return item.id !== id;
      });
      data = oldData;
    }

    this.storage.setItem(this.getSavingKey(key), JSON.stringify(data));
    this._loader.changeLoaderState('stop');

  }

  // List all keys
  listKeys(): string[] {
    return Object.keys(this.storage);
  }

  // Clear all
  clearAll(): void {
    this.storage.clear();
  }
}
