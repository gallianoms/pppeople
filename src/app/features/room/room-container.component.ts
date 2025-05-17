import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoomConfig } from '../../core/types/room.types';
import { VoteStateService } from '../../core/services/vote-state.service';
import { UIStateService } from '../../core/services/ui-state.service';
import { VotingService } from '../../core/services/voting.service';
import { RoomPresentationComponent } from './room-presentation.component';
import { Router } from '@angular/router';
import { RoomManagementService } from '../../core/services/room-management.service';
import { FirebaseConnectionService } from '../../core/services/firebase-connection.service';

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
  public copyingLink = false;
  public usersConnectedCount$!: Observable<number>;
  public usersVotedCount$!: Observable<number>;
  public votes$!: Observable<number[]>;
  public averageVotes$!: Observable<number>;
  public forceReveal$!: Observable<boolean>;

  private location = inject(Location);
  private router = inject(Router);
  private votingService = inject(VotingService);
  private voteStateService = inject(VoteStateService);
  private uiStateService = inject(UIStateService);
  private roomManagementService = inject(RoomManagementService);
  private firebaseService = inject(FirebaseConnectionService);

  public async ngOnInit(): Promise<void> {
    // Check location state first, then fall back to history state, then sessionStorage
    const locationState = this.location.getState() as RoomConfig;
    const historyState = history.state as RoomConfig;

    // Try to get room config from sessionStorage as last resort
    let sessionState: RoomConfig | null = null;
    const storedConfig = sessionStorage.getItem('roomConfig');
    if (storedConfig) {
      try {
        sessionState = JSON.parse(storedConfig) as RoomConfig;
      } catch (e) {
        console.error('Failed to parse room config from sessionStorage', e);
      }
    }

    // Use location state if valid, otherwise use history state, then session state
    if (locationState?.roomId && locationState?.userId) {
      this.state = locationState;
    } else if (historyState?.roomId && historyState?.userId) {
      this.state = historyState;
    } else if (sessionState?.roomId && sessionState?.userId) {
      this.state = sessionState;
      // Clean up after successful use
      sessionStorage.removeItem('roomConfig');
    } else {
      // If no valid state found, redirect to welcome page
      this.router.navigate(['/welcome']);
      return;
    }

    // For host, try to restore the session without checking room existence first
    if (this.state.isHost) {
      try {
        // Update the participant's last active time and mark as host
        await this.firebaseService.updateData(
          this.firebaseService.getParticipantPath(this.state.roomId, this.state.userId),
          {
            lastActive: Date.now(),
            isHost: true,
            isSpectator: false
          }
        );

        // Update room host reference if needed
        await this.firebaseService.updateData(`rooms/${this.state.roomId}`, {
          hostId: this.state.userId,
          lastActivity: Date.now()
        });
      } catch (error) {
        console.error('Error restoring host session:', error);
        // Continue even if there's an error - Firebase will handle reconnection
      }
    } else {
      // For participants, set up room deletion listener
      this.uiStateService.setupRoomDeletionListener(this.state.roomId);

      try {
        // Update the participant's last active time
        await this.firebaseService.updateData(
          this.firebaseService.getParticipantPath(this.state.roomId, this.state.userId),
          { lastActive: Date.now() }
        );
      } catch (error) {
        console.error('Error updating participant status:', error);
      }
    }

    const voteState$ = this.voteStateService.getVoteState(this.state.roomId);

    this.votes$ = voteState$.pipe(map(state => state.votes));
    this.usersConnectedCount$ = voteState$.pipe(map(state => state.usersConnectedCount));
    this.usersVotedCount$ = voteState$.pipe(map(state => state.usersVotedCount));
    this.averageVotes$ = voteState$.pipe(map(state => state.averageVote));
    this.forceReveal$ = voteState$.pipe(map(state => state.forceReveal));

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

  public copyInviteLink(): void {
    this.uiStateService.copyInviteLink(this.state.roomId);
    this.uiStateService.setTemporaryState(value => (this.copyingLink = value));
  }

  public async onResetVotes(): Promise<void> {
    try {
      await this.votingService.resetVotes(this.state.roomId, this.state.userId);
      this.selectedNumber = null;
    } catch (error) {
      console.error('Error resetting votes:', error);
    }
  }

  public async onForceReveal(): Promise<void> {
    try {
      // Verify conditions for revealing cards
      const usersVoted = await firstValueFrom(this.usersVotedCount$.pipe(map(count => count || 0)));
      const usersConnected = await firstValueFrom(this.usersConnectedCount$.pipe(map(count => count || 0)));

      // Don't reveal if:
      // 1. No votes yet
      // 2. Only one participant
      // 3. All participants have already voted (cards already revealed)
      if (usersVoted <= 0 || usersConnected <= 1 || usersVoted === usersConnected) {
        return;
      }

      await this.votingService.forceRevealCards(this.state.roomId, this.state.userId);
    } catch (error) {
      console.error('Error forcing card reveal:', error);
    }
  }

  public hasNullVotes(votes: (number | null)[]): boolean {
    return this.voteStateService.hasNullVotes(votes);
  }

  public leaveRoom(): void {
    this.uiStateService.leaveRoom(this.state.roomId, this.state.userId, this.state.isHost);
  }

  public async toggleSpectator(): Promise<void> {
    // Get latest values from observables
    const usersConnected = await firstValueFrom(this.usersConnectedCount$.pipe(map(count => count || 0)));
    const usersVoted = await firstValueFrom(this.usersVotedCount$.pipe(map(count => count || 0)));

    // Don't allow changing to spectator when all votes are revealed
    if (usersConnected && usersVoted && usersConnected === usersVoted && usersConnected > 0) {
      // Button should be disabled in the UI, this is just a fallback
      return;
    }

    // Toggle the spectator status
    this.state.isSpectator = !this.state.isSpectator;

    // Update the room configuration in session storage
    sessionStorage.setItem('roomConfig', JSON.stringify(this.state));

    // Update spectator status in Firebase
    await this.votingService.updateSpectatorStatus(this.state.roomId, this.state.userId, this.state.isSpectator);

    // Reset the UI state whether changing to spectator or voter
    this.selectedNumber = null;
    this.selectedSize = null;
  }
}
