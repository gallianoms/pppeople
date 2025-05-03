import { Injectable } from '@angular/core';
import { filter, map, Observable } from 'rxjs';

import { FirebaseConnectionService } from './firebase-connection.service';
import { RoomAuthorizationService } from './room-authorization.service';

export interface CreateRoomResponse {
  roomId: string;
  hostId: string;
  estimationType?: 'fibonacci' | 't-shirt';
}

export interface JoinRoomResponse {
  userId: string;
  estimationType: 'fibonacci' | 't-shirt';
}

@Injectable({
  providedIn: 'root'
})
export class RoomManagementService {
  constructor(
    private firebaseService: FirebaseConnectionService,
    private authService: RoomAuthorizationService
  ) {}

  public async createRoom(estimationType: 'fibonacci' | 't-shirt' = 'fibonacci'): Promise<CreateRoomResponse> {
    const roomId = await this.firebaseService.pushData('rooms');
    const hostId = await this.firebaseService.pushData(this.firebaseService.getParticipantsPath(roomId));

    await this.firebaseService.setData(this.firebaseService.getRoomPath(roomId), {
      hostId,
      estimationType,
      participants: {
        [hostId]: {
          isHost: true,
          isSpectator: false,
          vote: null
        }
      }
    });

    return {
      roomId,
      hostId,
      estimationType
    };
  }

  public async joinRoom(roomId: string, isSpectator = false): Promise<JoinRoomResponse> {
    const roomExists = await this.authService.checkRoomExists(roomId);

    if (!roomExists) throw new Error('Room does not exist');

    const roomData = await this.firebaseService.getData(this.firebaseService.getRoomPath(roomId));
    const estimationType = roomData.estimationType || 'fibonacci';

    const userId = await this.firebaseService.pushData(this.firebaseService.getParticipantsPath(roomId), {
      isHost: false,
      isSpectator,
      vote: null
    });

    return {
      userId,
      estimationType
    };
  }

  public async deleteRoom(roomId: string, userId: string): Promise<void> {
    const isHost = await this.authService.checkIsHost(roomId, userId);

    if (!isHost) {
      throw new Error('Only the host can delete the room');
    }

    await this.firebaseService.setData(this.firebaseService.getRoomPath(roomId), null);
  }

  public listenToRoomDeletion(roomId: string): Observable<void> {
    return this.firebaseService
      .createObservable(this.firebaseService.getRoomPath(roomId), snapshot => {
        if (!snapshot.exists()) {
          return void 0;
        }
        return null;
      })
      .pipe(
        filter(value => value !== null),
        map(() => undefined)
      );
  }

  public async getRoomEstimationType(roomId: string): Promise<'fibonacci' | 't-shirt'> {
    const roomData = await this.firebaseService.getData(this.firebaseService.getRoomPath(roomId));
    return roomData?.estimationType || 'fibonacci';
  }
}
