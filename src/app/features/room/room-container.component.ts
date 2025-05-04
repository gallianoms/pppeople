import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoomConfig } from '../../core/types/room.types';
import { VoteStateService } from '../../core/services/vote-state.service';
import { UIStateService } from '../../core/services/ui-state.service';
import { VotingService } from '../../core/services/voting.service';
import { RoomPresentationComponent } from './room-presentation.component';

@Component({
  selector: 'app-room-container',
  standalone: true,
  imports: [CommonModule, RoomPresentationComponent],
  templateUrl: './room-container.component.html'
})
export class RoomContainerComponent implements OnInit {
  public numbers = [1, 2, 3, 5, 8, 13, 21];
  public tshirtSizes = ['XS', 'S', 'M', 'L', 'XL'];
  public selectedNumber: number | null = null;
  public selectedSize: string | null = null;
  public state!: RoomConfig;
  public copying = false;
  public usersConnectedCount$!: Observable<number>;
  public usersVotedCount$!: Observable<number>;
  public votes$!: Observable<number[]>;
  public averageVotes$!: Observable<number>;

  constructor(
    private location: Location,
    private votingService: VotingService,
    private voteStateService: VoteStateService,
    private uiStateService: UIStateService
  ) {}

  public ngOnInit(): void {
    this.state = this.location.getState() as RoomConfig;

    if (!this.state.isHost) {
      this.uiStateService.setupRoomDeletionListener(this.state.roomId);
    }

    const voteState$ = this.voteStateService.getVoteState(this.state.roomId);

    this.votes$ = voteState$.pipe(map(state => state.votes));
    this.usersConnectedCount$ = voteState$.pipe(map(state => state.usersConnectedCount));
    this.usersVotedCount$ = voteState$.pipe(map(state => state.usersVotedCount));
    this.averageVotes$ = voteState$.pipe(map(state => state.averageVote));

    this.votingService.getUserVote(this.state.roomId, this.state.userId).subscribe(vote => {
      if (vote === null) {
        this.selectedNumber = null;
        this.selectedSize = null;
        return;
      }

      if (this.state.estimationType === 't-shirt') {
        this.selectedSize = this.tshirtSizes[vote - 1] || null;
        this.selectedNumber = vote;
      } else {
        this.selectedNumber = vote;
      }
    });
  }

  public onValueSelect(vote: number | string): void {
    let numericVote: number;
    if (this.state.estimationType === 't-shirt') {
      numericVote = this.tshirtSizes.indexOf(vote as string) + 1;
      this.selectedSize = vote as string;
    } else {
      numericVote = vote as number;
    }

    if (this.selectedNumber === null) {
      this.selectedNumber = numericVote;
    }
    this.voteStateService.handleVote(this.state.roomId, this.state.userId, numericVote);
  }

  public deleteMyVote(): void {
    this.voteStateService.handleVote(this.state.roomId, this.state.userId, null);
    this.selectedNumber = null;
    this.selectedSize = null;
  }

  public copyRoomCode(): void {
    this.uiStateService.copyRoomCode(this.state.roomId);
    this.uiStateService.setTemporaryState(value => (this.copying = value));
  }

  public async onResetVotes(): Promise<void> {
    try {
      await this.votingService.resetVotes(this.state.roomId, this.state.userId);
      this.selectedNumber = null;
    } catch (error) {
      console.error('Error resetting votes:', error);
    }
  }

  public hasNullVotes(votes: (number | null)[]): boolean {
    return this.voteStateService.hasNullVotes(votes);
  }

  public leaveRoom(): void {
    this.uiStateService.leaveRoom(this.state.roomId, this.state.userId, this.state.isHost);
  }
}
