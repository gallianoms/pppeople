import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { get, getDatabase, onValue, push, ref, set, update } from 'firebase/database';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Participant } from '../types/participant.types';

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
    const roomsRef = ref(this.db, 'rooms');
    const newRoomRef = push(roomsRef);
    const roomId = newRoomRef.key!;

    const participantsRef = ref(this.db, `rooms/${roomId}/participants`);
    const newHostRef = push(participantsRef);
    const hostId = newHostRef.key!;

    await set(newRoomRef, {
      hostId,
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
      hostId
    };
  }

  public async joinRoom(roomId: string, isSpectator = false): Promise<JoinRoomResponse> {
    const roomExists = await this.checkRoomExists(roomId);

    if (!roomExists) throw new Error('Room does not exist');

    const participantsRef = ref(this.db, `rooms/${roomId}/participants`);
    const newUserRef = push(participantsRef);
    const userId = newUserRef.key!;

    await set(newUserRef, {
      isHost: false,
      isSpectator,
      vote: null
    });

    return {
      userId
    };
  }

  public getUsersInRoom(roomId: string): Observable<number> {
    const participantsRef = ref(this.db, `rooms/${roomId}/participants`);
    return new Observable(subs =>
      onValue(participantsRef, snapshot => {
        if (!snapshot.exists()) return subs.next(0);

        const participants = snapshot.val();
        const activeParticipants = Object.values(participants).filter(
          participant => !(participant as Participant).isSpectator
        );

        subs.next(activeParticipants.length);
      })
    );
  }

  public async addVote(roomId: string, userId: string, vote: number): Promise<void> {
    const hasVoted = await this.hasUserVoted(roomId, userId);

    if (hasVoted) return;

    const participantRef = ref(this.db, `rooms/${roomId}/participants/${userId}`);
    await update(participantRef, {
      vote
    });
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

  private async hasUserVoted(roomId: string, userId: string): Promise<boolean> {
    const voteRef = ref(this.db, `rooms/${roomId}/participants/${userId}/vote`);
    const snapshot = await get(voteRef);
    return snapshot.exists() && snapshot.val() !== null;
  }
}
