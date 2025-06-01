import { Component, EventEmitter, HostListener, Output, input } from '@angular/core';

import { RoomConfig } from '../../core/types/room.types';
import { RoomHeaderComponent } from './components/room-header/room-header.component';
import { VoteControlsComponent } from './components/vote-controls/vote-controls.component';
import { RoomStatsComponent } from './components/room-stats/room-stats.component';
import { VoteCardComponent } from './components/vote-card/vote-card.component';
import { SocialLinksFooterComponent } from '../../shared/components/social-links-footer/social-links-footer.component';
import { ImageCardComponent } from '../../shared/components/image-card/image-card.component';
import { ContainerComponent } from '../../shared/components/container/container.component';

@Component({
  selector: 'app-room-presentation',
  standalone: true,
  imports: [
    RoomHeaderComponent,
    VoteControlsComponent,
    RoomStatsComponent,
    VoteCardComponent,
    SocialLinksFooterComponent,
    ImageCardComponent,
    ContainerComponent
  ],
  templateUrl: './room-presentation.component.html'
})
export class RoomPresentationComponent {
  readonly numbers = input<number[]>([]);
  readonly tshirtSizes = input<string[]>([]);
  readonly selectedNumber = input<number | null>(null);
  readonly selectedSize = input<string | null>(null);
  readonly state = input.required<RoomConfig>();
  readonly copyingLink = input(false);
  readonly votes = input<(number | null)[] | null>([]);
  readonly usersConnectedCount = input<number | null>(0);
  readonly usersVotedCount = input<number | null>(0);
  readonly averageVotes = input<number | string>(0);
  readonly forceReveal = input(false);

  @Output() valueSelected = new EventEmitter<number | string>();
  @Output() deleteVote = new EventEmitter<void>();
  @Output() resetVotes = new EventEmitter<void>();
  @Output() copyInviteLink = new EventEmitter<void>();
  @Output() leave = new EventEmitter<void>();
  @Output() toggleSpectator = new EventEmitter<void>();
  @Output() forceRevealCards = new EventEmitter<void>();

  @HostListener('window:beforeunload')
  handleWindowClose(): void {
    const isPageRefresh = performance.navigation?.type === 1;

    const state = this.state();
    if (state?.roomId && state?.userId && !isPageRefresh) {
      this.leave.emit();
    }
  }

  hasNullVotes(votes: (number | null)[] | null): boolean {
    if (!votes) return false;
    return votes.some(vote => vote === null);
  }

  shouldRevealCards(): boolean {
    return (
      this.forceReveal() ||
      ((this.usersVotedCount() ?? 0) === (this.usersConnectedCount() ?? 0) && (this.usersConnectedCount() ?? 0) > 0)
    );
  }
}
