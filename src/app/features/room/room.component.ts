import { CommonModule, Location } from '@angular/common';
import { Component, inject, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomConfig } from '../../core/types/room.types';
import { RoomService } from '../../core/services/room.service';
import { combineLatest, Observable, of, switchMap } from 'rxjs';
import { RoomHeaderComponent } from './components/room-header/room-header.component';
import { VoteControlsComponent } from './components/vote-controls/vote-controls.component';
import { RoomStatsComponent } from './components/room-stats/room-stats.component';
import { VoteCardComponent } from './components/vote-card/vote-card.component';
import { TablerIconComponent } from 'angular-tabler-icons';
import { ConfettiService } from '../../core/services/confetti.service';

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
  averageVotes$!: Observable<number | null>;

  private location = inject(Location);
  private roomService = inject(RoomService);
  private router = inject(Router);
  private confettiService = inject(ConfettiService);

  public ngOnInit(): void {
    this.state = this.location.getState() as RoomConfig;

    if (!this.state.isHost) {
      this.roomService.listenToRoomDeletion(this.state.roomId).subscribe(() => {
        this.router.navigate(['/welcome']);
      });
    }

    this.usersConnectedCount$ = this.roomService.getActiveParticipantsCount(this.state.roomId);
    this.usersVotedCount$ = this.roomService.getVotedParticipantsCount(this.state.roomId);
    this.votes$ = this.roomService.getVotes(this.state.roomId);

    // Replace the simple votes subscription with a combined check
    combineLatest([this.votes$, this.usersConnectedCount$, this.usersVotedCount$]).subscribe(
      ([votes, connected, voted]) => {
        if (connected === voted && connected > 0 && this.checkUnanimousVotes(votes)) {
          this.confettiService.trigger();
        }
      }
    );

    this.averageVotes$ = combineLatest([this.usersConnectedCount$, this.usersVotedCount$]).pipe(
      switchMap(([connected, voted]) => {
        if (connected === voted && connected > 0) {
          return this.roomService.calcAverageVote(this.state.roomId);
        }
        return of(0.0);
      })
    );

    this.roomService.getUserVote(this.state.roomId, this.state.userId).subscribe(vote => {
      this.selectedNumber = vote;
    });
  }

  onNumberSelect(vote: number): void {
    if (this.selectedNumber === null) this.selectedNumber = vote;
    this.roomService.addVote(this.state.roomId, this.state.userId, vote);
  }

  deleteMyVote(): void {
    this.roomService.removeVote(this.state.roomId, this.state.userId);
    this.selectedNumber = null;
  }

  copyRoomCode() {
    navigator.clipboard.writeText(this.state.roomId);
    this.copying = true;
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
    return votes.some(v => v === undefined);
  }

  private checkUnanimousVotes(votes: number[]): boolean {
    const validVotes = votes.filter(vote => typeof vote === 'number');
    return validVotes.length > 1 && validVotes.every(vote => vote === validVotes[0]);
  }

  @HostListener('window:beforeunload')
  private handleWindowClose(): void {
    if (this.state?.roomId && this.state?.userId) {
      this.leaveRoom();
    }
  }

  leaveRoom(): void {
    if (this.state.isHost) {
      this.roomService.deleteRoom(this.state.roomId, this.state.userId).catch(console.error);
    } else {
      this.roomService.removeParticipant(this.state.roomId, this.state.userId);
    }
    this.router.navigate(['/welcome']);
  }
}
