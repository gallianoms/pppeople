import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    CommonModule,
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
  @Input() numbers: number[] = [];
  @Input() tshirtSizes: string[] = [];
  @Input() selectedNumber: number | null = null;
  @Input() selectedSize: string | null = null;
  @Input() state!: RoomConfig;
  @Input() copyingLink = false;
  @Input() votes: number[] | null = [];
  @Input() usersConnectedCount: number | null = 0;
  @Input() usersVotedCount: number | null = 0;
  @Input() averageVotes: number | string = 0;
  @Input() forceReveal = false;

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

    if (this.state?.roomId && this.state?.userId && !isPageRefresh) {
      this.leave.emit();
    }
  }

  hasNullVotes(votes: (number | null)[]): boolean {
    return votes.some(vote => vote === null);
  }

  shouldRevealCards(): boolean {
    return (
      this.forceReveal ||
      ((this.usersVotedCount ?? 0) === (this.usersConnectedCount ?? 0) && (this.usersConnectedCount ?? 0) > 0)
    );
  }
}
