import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { get, getDatabase, onValue, push, ref, set, update } from 'firebase/database';
import { environment } from '../../../environments/environment.development';
import { map, Observable } from 'rxjs';
import { Participant } from '../types/participant.types';

export type CreateRoomResponse = {
  roomId: string;
  hostId: string;
};

export type JoinRoomResponse = {
  userId: string;
};

interface Participants {
  [key: string]: {
    isHost: boolean;
    isSpectator: boolean;
    vote: number | null;
  };
}

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

  public getActiveParticipantsCount(roomId: string): Observable<number> {
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

  public getVotedParticipantsCount(roomId: string): Observable<number> {
    const participantsRef = ref(this.db, `rooms/${roomId}/participants`);
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
    const participantsRef = ref(this.db, `rooms/${roomId}/participants`);
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
    const userRef = ref(this.db, `rooms/${roomId}/participants/${userId}`);
    const userSnapshot = await get(userRef);

    if (!userSnapshot.exists() || !userSnapshot.val().isHost) {
      throw new Error('Only the host can reset votes');
    }

    const participantsRef = ref(this.db, `rooms/${roomId}/participants`);
    const snapshot = await get(participantsRef);

    if (!snapshot.exists()) return;

    const participants: Participants = snapshot.val();
    const updates: { [key: string]: any } = {};

    Object.entries(participants).forEach(([participantId, participant]) => {
      if (!participant.isSpectator) {
        updates[`${participantId}/vote`] = null;
      }
    });

    await update(participantsRef, updates);
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

  public getUserVote(roomId: string, userId: string): Observable<number | null> {
    const voteRef = ref(this.db, `rooms/${roomId}/participants/${userId}/vote`);
    return new Observable(subs => {
      onValue(voteRef, snapshot => {
        subs.next(snapshot.exists() ? snapshot.val() : null);
      });
    });
  }
}
