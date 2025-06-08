import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { inject } from '@vercel/analytics';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { GlobalLoadingComponent } from './shared/components/global-loading/global-loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NotificationComponent, GlobalLoadingComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'pppeople | Planning Poker for teams';

  constructor() {
    inject();
  }
}
