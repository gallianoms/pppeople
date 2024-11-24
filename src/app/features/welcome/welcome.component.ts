import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { RoomConfig } from '../../core/types/room.types';
import { RoomService } from '../../core/services/room.service';

@Component({
  selector: 'app-welcome',
  imports: [FormsModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  public roomId = '';
  public isSpectator = false;

  private router = inject(Router);
  private roomService = inject(RoomService);

  public async createRoom() {
    const { roomId, hostId } = await this.roomService.createRoom();

    this.navigateToRoom({
      roomId,
      userId: hostId,
      isHost: true
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
      if (error instanceof Error) alert(error.message);
      else alert('An unexpected error occurred');
    }
  }

  private navigateToRoom(config: RoomConfig): void {
    this.router.navigate(['/room/' + config.roomId], { state: config });
  }
}
