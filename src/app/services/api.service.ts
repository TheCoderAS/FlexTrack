import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private storage: Storage = localStorage;
  constructor() { }

  // Create or Update
  save(key: string, value: any): void {
    let newData = [];
    let prevData = this.storage.getItem(key);
    if (prevData) {
      newData = JSON.parse(prevData);
    }
    value.order = newData.length + 1;
    newData.push(value);
    this.storage.setItem(key, JSON.stringify(newData));
  }

  // Read
  get(key: string): any {
    let result;
    if (key === 'widgets') {
      let item = this.storage.getItem(key);
      let parsedItem = item ? JSON.parse(item) : [];
      parsedItem.sort((a: any, b: any) => {
        return a.order - b.order;
      })
      result = parsedItem;
    }
    return result;
  }

  // Update (can be combined with save)
  update(key: string, value: any): void {
    let data;
    if (key === 'widgets') {
      let newData = value.map((item: any, index: number) => {
        item.order = index + 1;
        return item;
      });
      data = newData;
    }
    this.storage.setItem(key, JSON.stringify(data));
  }

  // Delete
  delete(key: string): void {
    this.storage.removeItem(key);
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
