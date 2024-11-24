import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { get, getDatabase, push, ref, set } from 'firebase/database';
import { environment } from '../../../environments/environment.development';

export type CreateRoomResponse = {
  roomId: string;
  hostId: string;
};

export type JoinRoomResponse = {
  userId: string;
};

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private app = initializeApp(environment.firebaseConfig);
  private db = getDatabase(this.app);

  public async createRoom(): Promise<CreateRoomResponse> {
    const usersRef = ref(this.db, 'users');
    const newHostRef = push(usersRef);
    const hostId = newHostRef.key!;

    await set(newHostRef, {
      isSpectator: false
    });

    const roomsRef = ref(this.db, 'rooms');
    const newRoomRef = push(roomsRef);
    const roomId = newRoomRef.key!;

    await set(newRoomRef, {
      hostId,
      participants: {}
    });

    return {
      roomId,
      hostId
    };
  }

  public async joinRoom(roomId: string, isSpectator = false): Promise<JoinRoomResponse> {
    const roomExists = await this.checkRoomExists(roomId);

    if (!roomExists) throw new Error('Room does not exist');

    const usersRef = ref(this.db, 'users');
    const newUserRef = push(usersRef);
    const userId = newUserRef.key!;

    await set(newUserRef, {
      isSpectator
    });

    const participantRef = ref(this.db, `rooms/${roomId}/participants/${userId}`);

    await set(participantRef, {
      vote: null
    });

    return {
      userId
    };
  }

  private async checkRoomExists(roomId: string): Promise<boolean> {
    return await get(ref(this.db, `rooms/${roomId}`))
      .then(snapshot => {
        return snapshot.exists();
      })
      .catch(error => {
        console.error(error);
        return false;
      });
  }
}
