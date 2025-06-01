import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { VotingService } from './voting.service';
import { ParticipantService } from './participant.service';
import { ConfettiService } from './confetti.service';
import { RoomManagementService } from './room-management.service';

@Injectable({
  providedIn: 'root'
})
export class VoteStateService {
  private votingService = inject(VotingService);
  private participantService = inject(ParticipantService);
  private confettiService = inject(ConfettiService);
  private roomManagementService = inject(RoomManagementService);
  private confettiTriggeredFor: { [roomId: string]: string } = {};

  public getVoteState(roomId: string): Observable<{
    votes: number[];
    usersConnectedCount: number;
    usersVotedCount: number;
    averageVote: number | string;
    forceReveal: boolean;
  }> {
    const votes$ = this.votingService.getVotes(roomId);
    const usersConnectedCount$ = this.participantService.getActiveParticipantsCount(roomId);
    const usersVotedCount$ = this.votingService.getVotedParticipantsCount(roomId);
    const forceReveal$ = this.votingService.getForceRevealStatus(roomId);

    return combineLatest([votes$, usersConnectedCount$, usersVotedCount$, forceReveal$]).pipe(
      switchMap(([votes, connected, voted, forceReveal]) => {
        if (connected === voted && connected > 0 && this.checkUnanimousVotes(votes)) {
          this.triggerConfettiOnce(roomId, votes);
        } else if (votes.length === 0 || voted === 0) {
          this.resetConfettiState(roomId);
        }
        return from(this.calculateStatistic(roomId, votes)).pipe(
          map(statistic => ({
            votes,
            usersConnectedCount: connected,
            usersVotedCount: voted,
            averageVote: statistic,
            forceReveal
          }))
        );
      })
    );
  }

  public async handleVote(roomId: string, userId: string, vote: number | null): Promise<void> {
    if (vote === null) {
      await this.votingService.removeVote(roomId, userId);
    } else {
      await this.votingService.addVote(roomId, userId, vote);
    }
  }

  public resetConfettiState(roomId: string): void {
    delete this.confettiTriggeredFor[roomId];
  }

  public hasNullVotes(votes: (number | null)[]): boolean {
    return votes.some(v => v === undefined);
  }

  private checkUnanimousVotes(votes: number[]): boolean {
    const validVotes = votes.filter(vote => typeof vote === 'number');
    return validVotes.length > 1 && validVotes.every(vote => vote === validVotes[0]);
  }

  private triggerConfettiOnce(roomId: string, votes: number[]): void {
    const voteSignature = votes.sort().join(',');
    const lastTriggeredFor = this.confettiTriggeredFor[roomId];

    if (lastTriggeredFor !== voteSignature) {
      this.confettiService.trigger();
      this.confettiTriggeredFor[roomId] = voteSignature;
    }
  }

  private calculateAverage(votes: number[]): number {
    if (!votes.length) return 0;
    return votes.reduce((a, b) => a + b, 0) / votes.length;
  }

  private calculateMode(votes: number[]): number {
    if (!votes.length) return 0;

    const frequency: { [key: number]: number } = {};
    let maxFreq = 0;
    let mode = 0;

    // Count frequency of each vote
    for (const vote of votes) {
      frequency[vote] = (frequency[vote] || 0) + 1;
      if (frequency[vote] > maxFreq || (frequency[vote] === maxFreq && vote > mode)) {
        maxFreq = frequency[vote];
        mode = vote;
      }
    }

    return mode;
  }

  private numberToTshirtSize(vote: number): string {
    const tshirtSizes = ['XS', 'S', 'M', 'L', 'XL'];
    const index = vote - 1;
    return index >= 0 && index < tshirtSizes.length ? tshirtSizes[index] : 'XS';
  }

  private async calculateStatistic(roomId: string, votes: number[]): Promise<number | string> {
    if (!votes.length) {
      try {
        const estimationType = await this.roomManagementService.getRoomEstimationType(roomId);
        return estimationType === 't-shirt' ? '-' : 0;
      } catch (error) {
        return 0;
      }
    }

    try {
      const estimationType = await this.roomManagementService.getRoomEstimationType(roomId);
      if (estimationType === 't-shirt') {
        const modeNumber = this.calculateMode(votes);
        return this.numberToTshirtSize(modeNumber);
      } else {
        return this.calculateAverage(votes);
      }
    } catch (error) {
      console.error('Error getting estimation type, falling back to average:', error);
      return this.calculateAverage(votes);
    }
  }
}
