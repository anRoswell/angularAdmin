import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage = sessionStorage;

  constructor() {}

  create(key: string, value: any): void {
    this.storage.setItem(key, btoa(JSON.stringify(value)));
  }

  one(key: string): any {
    const value = this.storage.getItem(key);
    return value ? JSON.parse(atob(value)) : null;
  }

  destroy(key: string): void {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }
}
