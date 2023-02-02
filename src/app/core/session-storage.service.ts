import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService<T> {

  addItem(key: string, value: T) {
    const array = this.getItem(key);
    array.push(value)
    sessionStorage.setItem(key, JSON.stringify(array));
  }

  getItem(key: string) {
    const session = sessionStorage.getItem(key)

    if (session != null) {
      const value: T[] = JSON.parse(session);
      return value;
    }
    return new Array<T>;
  }
}
