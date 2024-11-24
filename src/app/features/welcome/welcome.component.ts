import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { RoomConfig } from '../../core/types/room.types';

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

  public createRoom() {
    const roomId = crypto.randomUUID();
    const userId = crypto.randomUUID();

    this.navigateToRoom({
      roomId,
      userId,
      isHost: true
    });
  }

  public joinRoom() {
    if (this.checkRoomExists(this.roomId)) {
      const userId = crypto.randomUUID();

      this.navigateToRoom({
        roomId: this.roomId,
        userId,
        isHost: false,
        isSpectator: this.isSpectator
      });
    } else alert('No valide room code');
  }

  private checkRoomExists(roomId: string): boolean {
    return false;
  }

  private navigateToRoom(config: RoomConfig): void {
    this.router.navigate(['/room/' + config.roomId], { state: config });
  }
}
