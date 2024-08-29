import { inject, Injectable } from '@angular/core';
import { LoaderService } from './loader.service';
import axios from 'axios';
import { MessagesService } from './messages.service';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private _base_url = 'https://api.websiterahouse.com/';
  private _storage: Storage = localStorage;
  private _user: any;
  private _loader: LoaderService = inject(LoaderService);

  constructor() {
    this._user = this._storage.getItem('currentuser');
    if (this._user) {
      this._user = JSON.parse(this._user);
    }
  }

  getSavingKey(key: string) {
    let userString = this._storage.getItem('user');
    if (userString) {
      let user = JSON.parse(userString);
      return `${user.email}/${key}`;
    }

    throw new Error("User not logged in!");
  }
  // Create or Update
  async hit(endpoint: string, method: string = 'get', data: any = null): Promise<any> {
    this._loader.changeLoaderState('start');
    let result: any;
    let config = {
      headers: {
        'Authorization': `Bearer ${await this.local_get('access')}`
      }
    }
    try {
      let response: any;
      switch (method) {
        case 'get':
          response = await axios.get(this._base_url + endpoint, config);
          break;
        case 'post':
          response = await axios.post(this._base_url + endpoint, data, config);
          break;
        case 'put':
          response = await axios.put(this._base_url + endpoint, data, config);
          break;
        case 'delete':
          response = await axios.get(this._base_url + endpoint, config);
          break;
      }
      result = response.data;
      result.success = true;
    } catch (error) {
      result = (error as any).response.data;
      result.success = false;
    } finally {
      this._loader.changeLoaderState('stop');
      return result;
    }
  }

  async local_post(key: string, value: any): Promise<any> {
    switch (key) {
      case 'widgets':
        try {
          let newData = [];
          let prevData = this._storage.getItem(this.getSavingKey(key));
          if (prevData) {
            newData = JSON.parse(prevData);
          }
          value.order = newData.length + 1;
          value.id = "id" + (newData.length + 1);
          newData.push(value);
          this._storage.setItem(this.getSavingKey(key), JSON.stringify(newData));
          return { message: "Added successfully in storage.", success: true };
        } catch (error: any) {
          return { message: error.message, success: false };
        }
      case 'access':
      case 'user':
        this._storage.setItem(key, JSON.stringify(value));
        return { message: "Added successfully in storage.", success: true };

      default:
        console.log("No default action configured.")
    }

  }
  async local_get(key: string): Promise<any> {

    switch (key) {
      case 'widgets': {
        let item = this._storage.getItem(this.getSavingKey(key));
        let parsedItem = item ? JSON.parse(item) : [];
        parsedItem.sort((a: any, b: any) => {
          return a.order - b.order;
        })
        return parsedItem;
      }
      case 'access':
      case 'user': {
        let item = this._storage.getItem(key);
        return item ? JSON.parse(item) : null;
      }
    }
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
        let oldData: any = this._storage.getItem(this.getSavingKey(key));
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
      // let prevData: any = this._storage.getItem('users');
      // prevData = prevData ? JSON.parse(prevData) : [];

      // let existingValue = prevData.find((item: any) => item.email === value.email);
      // if (existingValue) {
      this._storage.setItem('currentuser', JSON.stringify({ email: value.email }));
      // }
      this._user = value
      return;
    }
    this._storage.setItem(this.getSavingKey(key), JSON.stringify(data));
    this._loader.changeLoaderState('stop');
  }

  // Delete
  async local_delete(key: string, data: any = null): Promise<void> {
    switch (key) {
      case 'widgets': {
        let oldData: any = this._storage.getItem(this.getSavingKey(key));
        oldData = oldData ? JSON.parse(oldData) : [];
        let newdata = oldData.filter((item: any) => {
          return item.id !== data;
        });
        this._storage.setItem(this.getSavingKey(key), JSON.stringify(newdata));
        return;
      }
      case 'user':
      case 'access': {
        this._storage.removeItem(key);
      }
    }

  }

  // List all keys
  listKeys(): string[] {
    return Object.keys(this._storage);
  }

  // Clear all
  clearAll(): void {
    this._storage.clear();
  }
}
