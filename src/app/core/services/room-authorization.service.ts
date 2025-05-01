import { Injectable } from '@angular/core';

import { FirebaseConnectionService } from './firebase-connection.service';

@Injectable({
  providedIn: 'root'
})
export class RoomAuthorizationService {
  constructor(private firebaseService: FirebaseConnectionService) {}

  public async checkRoomExists(roomId: string): Promise<boolean> {
    try {
      const roomData = await this.firebaseService.getData(this.firebaseService.getRoomPath(roomId));
      return roomData !== null;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  public async hasUserVoted(roomId: string, userId: string): Promise<boolean> {
    const voteData = await this.firebaseService.getData(this.firebaseService.getVotePath(roomId, userId));
    return voteData !== null;
  }

  public async checkIsHost(roomId: string, userId: string): Promise<boolean> {
    const userData = await this.firebaseService.getData(this.firebaseService.getParticipantPath(roomId, userId));
    return userData && userData.isHost;
  }
}
