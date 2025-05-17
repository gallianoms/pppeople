import { Injectable, inject } from '@angular/core';
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
  private firebaseService = inject(FirebaseConnectionService);
  private authService = inject(RoomAuthorizationService);

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
    console.log('joinRoom called with roomId:', roomId, 'isSpectator:', isSpectator);
    const roomExists = await this.authService.checkRoomExists(roomId);

    if (!roomExists) throw new Error('Room does not exist');

    const roomData = await this.firebaseService.getData(this.firebaseService.getRoomPath(roomId));
    const estimationType = roomData.estimationType || 'fibonacci';
    console.log('Room data:', { roomId, estimationType, existingParticipants: roomData?.participants });

    // Check if we have a stored userId from a previous session
    const storedConfig = sessionStorage.getItem('roomConfig');
    console.log('Stored config from sessionStorage:', storedConfig);

    if (storedConfig) {
      try {
        const sessionState = JSON.parse(storedConfig) as { roomId: string; userId: string; isHost: boolean };
        console.log('Parsed session state:', sessionState);

        if (sessionState.roomId === roomId) {
          console.log('Session state matches current room, attempting to rejoin...');
          try {
            await this.rejoinRoom(roomId, sessionState.userId, isSpectator);
            console.log('Successfully rejoined with existing userId:', sessionState.userId);

            // Update the stored config with fresh data
            const updatedConfig = {
              ...sessionState,
              lastReconnected: Date.now()
            };
            sessionStorage.setItem('roomConfig', JSON.stringify(updatedConfig));

            return {
              userId: sessionState.userId,
              estimationType
            };
          } catch (error) {
            console.warn('Failed to rejoin with existing userId, creating new participant', error);
            // Continue to create a new participant if rejoining fails
          }
        } else {
          console.log('Session state does not match current room, creating new participant');
        }
      } catch (e) {
        console.warn('Failed to parse stored room config', e);
      }
    } else {
      console.log('No stored config found, creating new participant');
    }

    // If we get here, either there was no stored config or rejoining failed
    console.log('Creating new participant for room:', roomId);
    const newParticipantData = {
      isHost: false,
      isSpectator,
      vote: null,
      lastActive: Date.now(),
      createdAt: Date.now()
    };

    console.log('New participant data:', newParticipantData);
    const userId = await this.firebaseService.pushData(
      this.firebaseService.getParticipantsPath(roomId),
      newParticipantData
    );

    // Store the new participant info in session storage
    const newSessionState = {
      roomId,
      userId,
      isHost: false,
      joinedAt: Date.now()
    };
    console.log('Storing new session state:', newSessionState);
    sessionStorage.setItem('roomConfig', JSON.stringify(newSessionState));

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

  public async checkRoomExists(roomId: string): Promise<boolean> {
    try {
      const roomData = await this.firebaseService.getData(this.firebaseService.getRoomPath(roomId));
      return roomData !== null;
    } catch (error) {
      console.error('Error checking if room exists:', error);
      return false;
    }
  }

  public async rejoinRoom(roomId: string, userId: string, isSpectator: boolean): Promise<void> {
    console.log('Attempting to rejoin room:', { roomId, userId, isSpectator });
    try {
      const participantPath = this.firebaseService.getParticipantPath(roomId, userId);
      console.log('Participant path:', participantPath);

      const participantData = await this.firebaseService.getData(participantPath);
      console.log('Existing participant data:', participantData);

      if (!participantData) {
        console.log('No existing participant found, creating new participant with userId:', userId);
        // If participant doesn't exist, create a new one with the same userId
        const newParticipantData = {
          isHost: false,
          isSpectator,
          vote: null,
          lastActive: Date.now(),
          reconnectedAt: Date.now()
        };
        console.log('Creating new participant with data:', newParticipantData);
        await this.firebaseService.setData(participantPath, newParticipantData);
      } else {
        console.log('Updating existing participant with lastActive timestamp');
        // Update the existing participant's last active timestamp
        await this.firebaseService.updateData(participantPath, {
          isSpectator,
          lastActive: Date.now(),
          reconnectedAt: Date.now()
        });
      }
    } catch (error) {
      console.error('Error rejoining room:', error);
      throw error;
    }
  }

  public async restoreHostSession(
    roomId: string,
    userId: string,
    estimationType: 'fibonacci' | 't-shirt' = 'fibonacci'
  ): Promise<void> {
    try {
      // First, check if the room exists
      const roomExists = await this.checkRoomExists(roomId);
      if (!roomExists) {
        throw new Error('Room does not exist');
      }

      // Update the room with the host information
      await this.firebaseService.updateData(`rooms/${roomId}`, {
        hostId: userId,
        estimationType,
        lastActivity: Date.now()
      });

      // Update the participant's data to mark as host
      await this.firebaseService.updateData(this.firebaseService.getParticipantPath(roomId, userId), {
        isHost: true,
        isSpectator: false,
        lastActive: Date.now()
      });
    } catch (error) {
      console.error('Error restoring host session:', error);
      throw error;
    }
  }
}
