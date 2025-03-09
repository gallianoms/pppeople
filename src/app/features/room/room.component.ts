import { CommonModule, Location } from '@angular/common';
import { Component, inject, HostListener, OnInit } from '@angular/core';
import { RoomConfig } from '../../core/types/room.types';
import { RoomService } from '../../core/services/room.service';
import { Observable } from 'rxjs';
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
  numbers = [1, 2, 3, 5, 8];
  selectedNumber: number | null = null;
  state!: RoomConfig;
  copying = false;
  usersConnectedCount$!: Observable<number>;
  usersVotedCount$!: Observable<number>;
  votes$!: Observable<number[]>;
  averageVotes$!: Observable<number>;

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
    voteState$.subscribe(({ votes, usersConnectedCount, usersVotedCount, averageVote }) => {
      this.votes$ = new Observable(observer => observer.next(votes));
      this.usersConnectedCount$ = new Observable(observer => observer.next(usersConnectedCount));
      this.usersVotedCount$ = new Observable(observer => observer.next(usersVotedCount));
      this.averageVotes$ = new Observable(observer => observer.next(averageVote));
    });

    this.roomService.getUserVote(this.state.roomId, this.state.userId).subscribe(vote => {
      this.selectedNumber = vote;
    });
  }

  onNumberSelect(vote: number): void {
    if (this.selectedNumber === null) this.selectedNumber = vote;
    this.voteStateService.handleVote(this.state.roomId, this.state.userId, vote);
  }

  deleteMyVote(): void {
    this.voteStateService.handleVote(this.state.roomId, this.state.userId, null);
    this.selectedNumber = null;
  }

  copyRoomCode() {
    this.copying = true;
    this.uiStateService.copyRoomCode(this.state.roomId);
    setTimeout(() => (this.copying = false), 2000);
  }

  async onResetVotes(): Promise<void> {
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

  leaveRoom(): void {
    this.uiStateService.leaveRoom(this.state.roomId, this.state.userId, this.state.isHost);
  }
}
