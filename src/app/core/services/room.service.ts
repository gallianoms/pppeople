import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { get, getDatabase, onValue, push, ref, set, update } from 'firebase/database';
import { environment } from '../../../environments/environment.development';
import { map, Observable } from 'rxjs';
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
    const participantsRef = ref(this.db, this.getParticipantsPath(roomId));
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

    const participantRef = ref(this.db, this.getParticipantPath(roomId, userId));
    await update(participantRef, {
      vote
    });
  }

  public async removeVote(roomId: string, userId: string): Promise<void> {
    const participantRef = ref(this.db, this.getParticipantPath(roomId, userId));
    await update(participantRef, {
      vote: null
    });
  }

  public getVotedParticipantsCount(roomId: string): Observable<number> {
    const participantsRef = ref(this.db, this.getParticipantsPath(roomId));
    return new Observable(subs => {
      onValue(participantsRef, snapshot => {
        if (!snapshot.exists()) return subs.next(0);

        const participants: Participants = snapshot.val();
        const votedParticipants = Object.values(participants).filter(
          participant => participant.vote !== null && participant.vote > 0
        );
        subs.next(votedParticipants.length);
      });
    });
  }

  public getVotes(roomId: string): Observable<number[]> {
    const participantsRef = ref(this.db, this.getParticipantsPath(roomId));
    return new Observable(subs => {
      onValue(participantsRef, snapshot => {
        if (!snapshot.exists()) return subs.next([]);

        const participants: Participants = snapshot.val();
        const votes = Object.values(participants)
          .filter(participant => !participant.isSpectator)
          .map(participant => participant.vote)
          .filter(vote => vote !== null);
        subs.next(votes);
      });
    });
  }

  public calcAverageVote(roomId: string): Observable<number> {
    const votes = this.getVotes(roomId);
    return votes.pipe(map(votes => votes.reduce((a, b) => a + b, 0) / votes.length));
  }

  public async resetVotes(roomId: string, userId: string): Promise<void> {
    const userRef = ref(this.db, this.getParticipantPath(roomId, userId));
    const userSnapshot = await get(userRef);

    if (!userSnapshot.exists() || !userSnapshot.val().isHost) {
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
    const userRef = ref(this.db, this.getParticipantPath(roomId, userId));
    const userSnapshot = await get(userRef);

    if (!userSnapshot.exists() || !userSnapshot.val().isHost) {
      throw new Error('Only the host can delete the room');
    }

    const roomRef = ref(this.db, this.getRoomPath(roomId));
    await set(roomRef, null);
  }

  public listenToRoomDeletion(roomId: string): Observable<void> {
    const roomRef = ref(this.db, this.getRoomPath(roomId));
    return new Observable(subs => {
      onValue(roomRef, snapshot => {
        if (!snapshot.exists()) {
          subs.next();
        }
      });
    });
  }

  public getUserVote(roomId: string, userId: string): Observable<number | null> {
    const voteRef = ref(this.db, this.getVotePath(roomId, userId));
    return new Observable(subs => {
      onValue(voteRef, snapshot => {
        subs.next(snapshot.exists() ? snapshot.val() : null);
      });
    });
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
}
