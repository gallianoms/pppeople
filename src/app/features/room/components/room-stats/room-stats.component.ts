import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-room-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './room-stats.component.html'
})
export class RoomStatsComponent {
  public readonly average = input(0);
  public readonly isHost = input(false);
  public readonly isSpectator = input(false);
  public readonly canChangeVote = input(false);
  public readonly deleteVote = output<void>();
  public readonly resetVotes = output<void>();

  onDeleteVote() {
    this.deleteVote.emit();
  }

  onReset() {
    this.resetVotes.emit();
  }
}
