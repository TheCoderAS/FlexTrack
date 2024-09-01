import { inject, Injectable } from '@angular/core';
import { LoaderService } from './loader.service';
import axios from 'axios';
import { MessagesService } from './messages.service';
import nls from '../framework/resources/nls/generic';
import { v4 as uuidv4 } from 'uuid';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

declare var cordova: any;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private _base_url = 'https://api.websiterahouse.com/';
  private _storage: Storage = localStorage;
  private _loader: LoaderService = inject(LoaderService);
  private _message: MessagesService = inject(MessagesService);

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
          value.id = uuidv4();
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
  async local_put(key: string, value: any): Promise<void> {
    switch (key) {
      case 'widgets': {
        let data;
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
        this._storage.setItem(this.getSavingKey(key), JSON.stringify(data));
        return;
      }
    }
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
  async local_clear(): Promise<void> {
    for (let i = 0; i < this._storage.length; i++) {
      const key = this._storage.key(i);
      const user = await this.local_get('user');
      if (key?.startsWith(`${user.email}/`)) {
        this._storage.removeItem(key);
        i--;
      }
    }
  }

  async backupData(): Promise<void> {
    let backup = {};
    let backupFile = nls.backupFileName;

    for (let i = 0; i < this._storage.length; i++) {
      const key = this._storage.key(i);
      const user = await this.local_get('user');
      if (key?.startsWith(`${user.email}/`)) {
        let data = this._storage.getItem(key);
        if (data) {
          let parsedData = JSON.parse(data);
          backup = { ...backup, [(key as string).split(`${user.email}/`)[1]]: parsedData };
        }
      }
    }
    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/octet-stream' });

    if (typeof cordova !== 'undefined') {

      (window as any).resolveLocalFileSystemURL(cordova.file.externalRootDirectory, (entry: any) => {
        const dirEntry = entry as any;
        this.createFile(dirEntry, backupFile, blob);
      }, (error: any) => {
        this._message.error(nls.resolveError)
      });
    } else {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = backupFile;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      this._message.success(nls.createBackupSuccess)
    }
  }
  private createFile(dirEntry: any, fileName: string, dataObj: Blob): void {
    dirEntry.getDirectory('Download', { create: true, exclusive: false }, (dirEntry: any) => {
      dirEntry.getFile(fileName, { create: true, exclusive: false }, (fileEntry: any) => {
        this.writeFile(fileEntry, dataObj);
        console.log(fileEntry, dataObj)
      }, (error: any) => {
        this._message.error(nls.createBackupError)
      });
    })
  }
  private writeFile(fileEntry: any, dataObj: Blob): void {
    fileEntry.createWriter((fileWriter: any) => {
      fileWriter.onwriteend = () => {
        this._message.success(nls.createBackupSuccess)
      };

      fileWriter.onerror = (error: any) => {
        this._message.error(nls.saveBackupError)
      };

      fileWriter.write(dataObj);
    });
  }
  async restoreBackupData(file: File) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const fileContent = e.target.result;
      // console.log('File content:', fileContent);

      if (fileContent) {
        try {
          let parsedRestoreData = JSON.parse(fileContent);

          Object.keys(parsedRestoreData).forEach(async (key: string) => {
            let oldData = await this.local_get(key);
            let mergedData = this.mergeUnique(oldData, parsedRestoreData[key]);
            this._storage.setItem(this.getSavingKey(key), JSON.stringify(mergedData));
          });
          this._message.success(nls.restoreFromBackupSuccessful)

        } catch (error) {
          this._message.error(nls.parseBackupFileError)
        }
      }
    };

    reader.onerror = (error) => {
      // console.error('Error reading file:', error);
      this._message.error(nls.readBackupFileError)
    };

    reader.readAsText(file);
  }
  private mergeUnique(oldData: any, restoredData: any) {
    const mergedMap = new Map();

    // function mergeObject(existingObj:any, newObj:any) {
    //   return { ...existingObj, ...newObj };
    // }

    oldData.forEach((item: any) => mergedMap.set(item.id, item));

    restoredData.forEach((item: any) => {
      if (mergedMap.has(item.id)) {
        // const existingObj = mergedMap.get(item.id);
        // mergedMap.set(item.id, mergeObject(existingObj, item));
      } else {
        mergedMap.set(item.id, item);
      }
    });

    // Convert the Map back to an array
    return Array.from(mergedMap.values());
  }
}
