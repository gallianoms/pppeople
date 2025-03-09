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

  /**
   * Copies the room code to clipboard and manages the copying state
   * @param roomId The room ID to copy
   * @returns A function to set copying state to false after delay
   */
  public copyRoomCode(roomId: string): () => void {
    navigator.clipboard.writeText(roomId);
    return () => {
      return;
    };
  }

  /**
   * Handles leaving a room, with different behavior for hosts and participants
   * @param roomId The room ID
   * @param userId The user ID
   * @param isHost Whether the user is the host
   */
  public async leaveRoom(roomId: string, userId: string, isHost: boolean): Promise<void> {
    if (isHost) {
      await this.roomService.deleteRoom(roomId, userId).catch(console.error);
    } else {
      await this.roomService.removeParticipant(roomId, userId);
    }
    this.router.navigate(['/welcome']);
  }

  /**
   * Sets up a listener for room deletion (for non-host participants)
   * @param roomId The room ID to listen for deletion
   */
  public setupRoomDeletionListener(roomId: string): void {
    this.roomService.listenToRoomDeletion(roomId).subscribe(() => {
      this.router.navigate(['/welcome']);
    });
  }
}
