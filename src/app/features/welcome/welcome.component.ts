import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { RoomConfig } from '../../core/types/room.types';
import { RoomService } from '../../core/services/room.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-welcome',
  imports: [FormsModule],
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent {
  public roomId = '';
  public isSpectator = false;

  private router = inject(Router);
  private roomService = inject(RoomService);
  private notificationService = inject(NotificationService);

  public async createRoom() {
    const { roomId, hostId } = await this.roomService.createRoom();

    this.navigateToRoom({
      roomId,
      userId: hostId,
      isHost: true,
      isSpectator: false
    });
  }

  public async joinRoom() {
    try {
      const { userId } = await this.roomService.joinRoom(this.roomId, this.isSpectator);

      this.navigateToRoom({
        roomId: this.roomId,
        userId,
        isHost: false,
        isSpectator: this.isSpectator
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
