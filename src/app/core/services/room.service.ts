import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { DataSnapshot, get, getDatabase, onValue, push, ref, set, update } from 'firebase/database';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Participant } from '../types/participant.types';

export interface CreateRoomResponse {
  roomId: string;
  hostId: string;
  estimationType?: 'fibonacci' | 'tshirt';
}

export interface JoinRoomResponse {
  userId: string;
}

interface ParticipantData {
  isHost: boolean;
  isSpectator: boolean;
  vote: number | null;
}

type Participants = Record<string, ParticipantData>;
type ParticipantUpdates = Record<string, ParticipantData['vote']>;

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private app = initializeApp(environment.firebaseConfig);
  private db = getDatabase(this.app);

  // Helper methods for path generation
  private getRoomPath(roomId: string): string {
    return `rooms/${roomId}`;
  }

  private getParticipantsPath(roomId: string): string {
    return `${this.getRoomPath(roomId)}/participants`;
  }

  private getParticipantPath(roomId: string, userId: string): string {
    return `${this.getParticipantsPath(roomId)}/${userId}`;
  }

  private getVotePath(roomId: string, userId: string): string {
    return `${this.getParticipantPath(roomId, userId)}/vote`;
  }

  // Reusable methods for common Firebase operations
  private createObservable<T>(dbPath: string, transformFn: (snapshot: DataSnapshot) => T): Observable<T> {
    const dbRef = ref(this.db, dbPath);
    return new Observable<T>(subscriber => {
      const unsubscribe = onValue(
        dbRef,
        snapshot => {
          subscriber.next(transformFn(snapshot));
        },
        error => {
          subscriber.error(error);
        }
      );

      // Return cleanup function
      return () => unsubscribe();
    });
  }

  private async checkIsHost(roomId: string, userId: string): Promise<boolean> {
    const userRef = ref(this.db, this.getParticipantPath(roomId, userId));
    const userSnapshot = await get(userRef);
    return userSnapshot.exists() && userSnapshot.val().isHost;
  }

  public async createRoom(estimationType: 'fibonacci' | 'tshirt' = 'fibonacci'): Promise<CreateRoomResponse> {
    const roomsRef = ref(this.db, 'rooms');
    const newRoomRef = push(roomsRef);
    const roomId = newRoomRef.key!;

    const participantsRef = ref(this.db, this.getParticipantsPath(roomId));
    const newHostRef = push(participantsRef);
    const hostId = newHostRef.key!;

    await set(newRoomRef, {
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
      hostId
    };
  }

  public async joinRoom(roomId: string, isSpectator = false): Promise<JoinRoomResponse> {
    const roomExists = await this.checkRoomExists(roomId);

    if (!roomExists) throw new Error('Room does not exist');

    const participantsRef = ref(this.db, this.getParticipantsPath(roomId));
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

  public getActiveParticipantsCount(roomId: string): Observable<number> {
    return this.createObservable(this.getParticipantsPath(roomId), snapshot => {
      if (!snapshot.exists()) return 0;

      const participants = snapshot.val();
      return Object.values(participants).filter(participant => !(participant as Participant).isSpectator).length;
    });
  }

  public getVotedParticipantsCount(roomId: string): Observable<number> {
    return this.createObservable(this.getParticipantsPath(roomId), snapshot => {
      if (!snapshot.exists()) return 0;

      const participants: Participants = snapshot.val();
      return Object.values(participants).filter(participant => participant.vote !== null && participant.vote > 0)
        .length;
    });
  }

  public getVotes(roomId: string): Observable<number[]> {
    return this.createObservable(this.getParticipantsPath(roomId), snapshot => {
      if (!snapshot.exists()) return [];

      const participants: Participants = snapshot.val();
      return Object.values(participants)
        .filter(participant => !participant.isSpectator)
        .map(participant => participant.vote)
        .filter(vote => vote !== null);
    });
  }

  public async resetVotes(roomId: string, userId: string): Promise<void> {
    const isHost = await this.checkIsHost(roomId, userId);

    if (!isHost) {
      throw new Error('Only the host can reset votes');
    }

    const participantsRef = ref(this.db, this.getParticipantsPath(roomId));
    const snapshot = await get(participantsRef);

    if (!snapshot.exists()) return;

    const participants: Participants = snapshot.val();
    const updates: ParticipantUpdates = {};

    Object.entries(participants).forEach(([participantId, participant]) => {
      if (!participant.isSpectator) {
        updates[`${participantId}/vote`] = null;
      }
    });

    await update(participantsRef, updates);
  }

  public async removeParticipant(roomId: string, userId: string): Promise<void> {
    const participantRef = ref(this.db, this.getParticipantPath(roomId, userId));
    await set(participantRef, null);
  }

  public async deleteRoom(roomId: string, userId: string): Promise<void> {
    const isHost = await this.checkIsHost(roomId, userId);

    if (!isHost) {
      throw new Error('Only the host can delete the room');
    }

    const roomRef = ref(this.db, this.getRoomPath(roomId));
    await set(roomRef, null);
  }

  public listenToRoomDeletion(roomId: string): Observable<void> {
    return this.createObservable(this.getRoomPath(roomId), snapshot => {
      if (!snapshot.exists()) {
        return undefined;
      }
    });
  }

  public getUserVote(roomId: string, userId: string): Observable<number | null> {
    return this.createObservable(this.getVotePath(roomId, userId), snapshot =>
      snapshot.exists() ? snapshot.val() : null
    );
  }

  private async checkRoomExists(roomId: string): Promise<boolean> {
    return await get(ref(this.db, this.getRoomPath(roomId)))
      .then(snapshot => {
        return snapshot.exists();
      })
      .catch(error => {
        console.error(error);
        return false;
      });
  }

  private async hasUserVoted(roomId: string, userId: string): Promise<boolean> {
    const voteRef = ref(this.db, this.getVotePath(roomId, userId));
    const snapshot = await get(voteRef);
    return snapshot.exists() && snapshot.val() !== null;
  }

  public async addVote(roomId: string, userId: string, vote: number): Promise<void> {
    const voteRef = ref(this.db, this.getVotePath(roomId, userId));
    await set(voteRef, vote);
  }

  public async removeVote(roomId: string, userId: string): Promise<void> {
    const voteRef = ref(this.db, this.getVotePath(roomId, userId));
    await set(voteRef, null);
  }
}
