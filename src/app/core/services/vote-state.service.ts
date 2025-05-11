import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { VotingService } from './voting.service';
import { ParticipantService } from './participant.service';
import { ConfettiService } from './confetti.service';

@Injectable({
  providedIn: 'root'
})
export class VoteStateService {
  private votingService = inject(VotingService);
  private participantService = inject(ParticipantService);
  private confettiService = inject(ConfettiService);

  public getVoteState(roomId: string): Observable<{
    votes: number[];
    usersConnectedCount: number;
    usersVotedCount: number;
    averageVote: number;
    forceReveal: boolean;
  }> {
    const votes$ = this.votingService.getVotes(roomId);
    const usersConnectedCount$ = this.participantService.getActiveParticipantsCount(roomId);
    const usersVotedCount$ = this.votingService.getVotedParticipantsCount(roomId);
    const forceReveal$ = this.votingService.getForceRevealStatus(roomId);

    return combineLatest([votes$, usersConnectedCount$, usersVotedCount$, forceReveal$]).pipe(
      map(([votes, connected, voted, forceReveal]) => {
        if (connected === voted && connected > 0 && this.checkUnanimousVotes(votes)) {
          this.confettiService.trigger();
        }
        return {
          votes,
          usersConnectedCount: connected,
          usersVotedCount: voted,
          averageVote: this.calculateAverage(votes),
          forceReveal
        };
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

  public hasNullVotes(votes: (number | null)[]): boolean {
    return votes.some(v => v === undefined);
  }

  private checkUnanimousVotes(votes: number[]): boolean {
    const validVotes = votes.filter(vote => typeof vote === 'number');
    return validVotes.length > 1 && validVotes.every(vote => vote === validVotes[0]);
  }

  private calculateAverage(votes: number[]): number {
    if (!votes.length) return 0;
    return votes.reduce((a, b) => a + b, 0) / votes.length;
  }
}
