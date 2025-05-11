import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomConfig } from '../../core/types/room.types';
import { RoomHeaderComponent } from './components/room-header/room-header.component';
import { VoteControlsComponent } from './components/vote-controls/vote-controls.component';
import { RoomStatsComponent } from './components/room-stats/room-stats.component';
import { VoteCardComponent } from './components/vote-card/vote-card.component';
import { SocialLinksFooterComponent } from '../../shared/components/social-links-footer/social-links-footer.component';

@Component({
  selector: 'app-room-presentation',
  standalone: true,
  imports: [
    CommonModule,
    RoomHeaderComponent,
    VoteControlsComponent,
    RoomStatsComponent,
    VoteCardComponent,
    SocialLinksFooterComponent
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
  @Input() averageVotes = 0;

  @Output() valueSelected = new EventEmitter<number | string>();
  @Output() deleteVote = new EventEmitter<void>();
  @Output() resetVotes = new EventEmitter<void>();
  @Output() copyInviteLink = new EventEmitter<void>();
  @Output() leave = new EventEmitter<void>();

  @HostListener('window:beforeunload')
  handleWindowClose(): void {
    if (this.state?.roomId && this.state?.userId) {
      this.leave.emit();
    }
  }

  hasNullVotes(votes: (number | null)[]): boolean {
    return votes.some(vote => vote === null);
  }
}
