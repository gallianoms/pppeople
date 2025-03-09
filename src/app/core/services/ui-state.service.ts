import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from './room.service';

@Injectable({
  providedIn: 'root'
})
export class UIStateService {
  constructor(
    private router: Router,
    private roomService: RoomService
  ) {}

  public copyRoomCode(roomId: string): () => void {
    navigator.clipboard.writeText(roomId);
    return () => {
      return;
    };
  }

  public async leaveRoom(roomId: string, userId: string, isHost: boolean): Promise<void> {
    if (isHost) {
      await this.roomService.deleteRoom(roomId, userId).catch(console.error);
    } else {
      await this.roomService.removeParticipant(roomId, userId);
    }
    this.router.navigate(['/welcome']);
  }

  public setupRoomDeletionListener(roomId: string): void {
    this.roomService.listenToRoomDeletion(roomId).subscribe(() => {
      this.router.navigate(['/welcome']);
    });
  }
}
