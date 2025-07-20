import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalLoadingService {
  private isLoading$ = new BehaviorSubject<boolean>(false);

  public readonly loading$ = this.isLoading$.asObservable();

  public show(): void {
    this.isLoading$.next(true);
  }

  public hide(): void {
    this.isLoading$.next(false);
  }
}
