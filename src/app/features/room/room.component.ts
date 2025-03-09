import { CommonModule, Location } from '@angular/common';
import { Component, inject, HostListener, OnInit } from '@angular/core';
import { RoomConfig } from '../../core/types/room.types';
import { RoomService } from '../../core/services/room.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoomHeaderComponent } from './components/room-header/room-header.component';
import { VoteControlsComponent } from './components/vote-controls/vote-controls.component';
import { RoomStatsComponent } from './components/room-stats/room-stats.component';
import { VoteCardComponent } from './components/vote-card/vote-card.component';
import { TablerIconComponent } from 'angular-tabler-icons';
import { VoteStateService } from '../../core/services/vote-state.service';
import { UIStateService } from '../../core/services/ui-state.service';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [
    CommonModule,
    RoomHeaderComponent,
    VoteControlsComponent,
    RoomStatsComponent,
    VoteCardComponent,
    TablerIconComponent
  ],
  templateUrl: './room.component.html'
})
export class RoomComponent implements OnInit {
  public numbers = [1, 2, 3, 5, 8];
  public selectedNumber: number | null = null;
  public state!: RoomConfig;
  public copying = false;
  public usersConnectedCount$!: Observable<number>;
  public usersVotedCount$!: Observable<number>;
  public votes$!: Observable<number[]>;
  public averageVotes$!: Observable<number>;

  private location = inject(Location);
  private roomService = inject(RoomService);
  private voteStateService = inject(VoteStateService);
  private uiStateService = inject(UIStateService);

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

    this.roomService.getUserVote(this.state.roomId, this.state.userId).subscribe(vote => {
      this.selectedNumber = vote;
    });
  }

  public onNumberSelect(vote: number): void {
    if (this.selectedNumber === null) this.selectedNumber = vote;
    this.voteStateService.handleVote(this.state.roomId, this.state.userId, vote);
  }

  public deleteMyVote(): void {
    this.voteStateService.handleVote(this.state.roomId, this.state.userId, null);
    this.selectedNumber = null;
  }

  public copyRoomCode(): void {
    this.uiStateService.copyRoomCode(this.state.roomId);
    this.uiStateService.setTemporaryState(value => (this.copying = value));
  }

  public async onResetVotes(): Promise<void> {
    try {
      await this.roomService.resetVotes(this.state.roomId, this.state.userId);
      this.selectedNumber = null;
    } catch (error) {
      console.error('Error resetting votes:', error);
    }
  }

  public hasNullVotes(votes: (number | null)[]): boolean {
    return this.voteStateService.hasNullVotes(votes);
  }

  @HostListener('window:beforeunload')
  private handleWindowClose(): void {
    if (this.state?.roomId && this.state?.userId) {
      this.leaveRoom();
    }
  }

  public leaveRoom(): void {
    this.uiStateService.leaveRoom(this.state.roomId, this.state.userId, this.state.isHost);
  }
}
