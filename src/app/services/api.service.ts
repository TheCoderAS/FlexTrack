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
    newData.push(value);
    this.storage.setItem(key, JSON.stringify(newData));
  }

  // Read
  get(key: string): any {
    const item = this.storage.getItem(key);
    return item ? JSON.parse(item) : [];
  }

  // Update (can be combined with save)
  update(key: string, value: any): void {
    this.save(key, value);
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
