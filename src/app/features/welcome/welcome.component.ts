import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { RoomConfig } from '../../core/types/room.types';
import { RoomService } from '../../core/services/room.service';
import { NotificationService } from '../../core/services/notification.service';
import { HelpModalComponent } from '../../shared/components/help-modal/help-modal.component';
import { TablerIconComponent } from 'angular-tabler-icons';

@Component({
  selector: 'app-welcome',
  imports: [FormsModule, HelpModalComponent, TablerIconComponent],
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent {
  public roomId = '';
  public isSpectator = false;
  public showHelpModal = false;
  public estimationType: 'fibonacci' | 't-shirt' = 'fibonacci';

  private router = inject(Router);
  private roomService = inject(RoomService);
  private notificationService = inject(NotificationService);

  public async createRoom() {
    const { roomId, hostId } = await this.roomService.createRoom(this.estimationType);

    this.navigateToRoom({
      roomId,
      userId: hostId,
      isHost: true,
      isSpectator: false,
      estimationType: this.estimationType
    });
  }

  public async joinRoom() {
    if (!this.roomId?.trim()) {
      this.notificationService.showError('Please enter a room code');
      return;
    }

    try {
      const { userId, estimationType } = await this.roomService.joinRoom(this.roomId, this.isSpectator);

      this.navigateToRoom({
        roomId: this.roomId,
        userId,
        isHost: false,
        isSpectator: this.isSpectator,
        estimationType
      });
    } catch (error) {
      this.notificationService.showError(
        error instanceof Error
          ? `The table is currently unavailable. ${error.message}`
          : 'The table is not ready for new players at the moment'
      );
    }
  }

  private navigateToRoom(config: RoomConfig): void {
    this.router.navigate(['/room/' + config.roomId], { state: config });
  }
}
