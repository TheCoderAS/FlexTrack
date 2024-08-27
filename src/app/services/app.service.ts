import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardCards } from '../framework/resources/dashboard-cards';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private _api: ApiService = inject(ApiService);
  private cordova: any;
  private window: Window;
  widgets: WritableSignal<DashboardCards[]> = signal([]);

  constructor(private router: Router) {
    if (typeof window != "undefined") {
      this.window = window;
    } else {
      this.window = new Window();
    }
    if ((this.window as any).cordova) {
      this.cordova = (this.window as any).cordova;
    }

    //get widgets data
    this.getWidgets();

  }
  getCordova(): any {
    return this.cordova;
  }
  getWindow(): Window {
    return this.window;
  }

  async getWidgets(): Promise<void> {
    let result = await this._api.get('widgets');
    result = result.map((item: DashboardCards) => {
      item.to = '/logging/' + item.title.toLowerCase();
      return item;
    });
    this.widgets.set(result);
  }
  async setWidget(data: DashboardCards[]): Promise<void> {
    await this._api.put('widgets', data);
    this.getWidgets();
  }
  async createWidget(data: DashboardCards): Promise<void> {
    await this._api.post('widgets', data);
    this.getWidgets();
  }
  async updateWidget(data: DashboardCards): Promise<void> {
    await this._api.put('widgets', data)
    this.getWidgets();
  }
  async deleteWidget(id: string): Promise<void> {
    await this._api.delete('widgets', id);
    this.getWidgets();
  }
}
