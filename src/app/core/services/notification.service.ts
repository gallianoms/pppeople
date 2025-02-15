import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'table-closed' | 'table-ready' | 'dealer-message';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notification = new BehaviorSubject<Notification | null>(null);
  notification$ = this.notification.asObservable();

  showError(message: string) {
    const casinoMessage = this.formatCasinoMessage(message);
    this.notification.next({ message: casinoMessage, type: 'table-closed' });
    setTimeout(() => this.notification.next(null), 6000);
  }

  private formatCasinoMessage(message: string): string {
    if (message.includes('Please enter a room code')) {
      return 'Please enter a table number to join';
    }
    if (message.includes('Room does not exist')) {
      return 'Table not found in the casino';
    }
    if (message.includes('Only the host can reset')) {
      return 'Only the dealer can reset the table';
    }
    if (message.includes('unexpected error')) {
      return 'Casino servers are busy';
    }
    return 'Table temporarily unavailable';
  }
}
