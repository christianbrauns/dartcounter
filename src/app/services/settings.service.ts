import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SettingsService {
  // public readonly isUlfMode: Observable<boolean>;
  private readonly _isUlfMode: BehaviorSubject<boolean>;

  constructor() {
    const ulfMode: boolean = this.getUlfMode();
    this._isUlfMode = new BehaviorSubject<boolean>(ulfMode);

  }

  public get isUlfMode(): Observable<boolean> {
    return this._isUlfMode;
  }

  public toggleUlfMode(): void {
    this.setUlfMode(!this._isUlfMode.getValue());
  }

  private getUlfMode(): boolean {
    return JSON.parse(localStorage.getItem('ulfMode')) as boolean;
  }

  private setUlfMode(value: boolean): void {
    localStorage.setItem('ulfMode', JSON.stringify(value));
    this._isUlfMode.next(value);
  }
}
