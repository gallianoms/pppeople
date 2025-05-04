import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RoomManagementService } from './room-management.service';
import { ParticipantService } from './participant.service';

@Injectable({
  providedIn: 'root'
})
export class UIStateService {
  constructor(
    private router: Router,
    private roomManagementService: RoomManagementService,
    private participantService: ParticipantService
  ) {}

  public copyRoomCode(roomId: string): void {
    navigator.clipboard.writeText(roomId);
  }

  public setTemporaryState(callback: (value: boolean) => void, duration = 2000): void {
    callback(true);
    setTimeout(() => callback(false), duration);
  }

  public async leaveRoom(roomId: string, userId: string, isHost: boolean): Promise<void> {
    if (isHost) {
      await this.roomManagementService.deleteRoom(roomId, userId).catch(console.error);
    } else {
      await this.participantService.removeParticipant(roomId, userId);
    }
    this.router.navigate(['/welcome']);
  }

  public setupRoomDeletionListener(roomId: string): void {
    this.roomManagementService.listenToRoomDeletion(roomId).subscribe(() => {
      this.router.navigate(['/welcome']);
    });
  }
}
