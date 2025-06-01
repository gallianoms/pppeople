import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-room-stats',
  standalone: true,
  imports: [],
  templateUrl: './room-stats.component.html'
})
export class RoomStatsComponent {
  public readonly average = input<number | string>(0);
  public readonly isHost = input(false);
  public readonly isSpectator = input(false);
  public readonly canChangeVote = input(false);
  public readonly estimationType = input<'fibonacci' | 't-shirt'>('fibonacci');
  public readonly shouldReveal = input(false);
  public readonly deleteVote = output<void>();
  public readonly resetVotes = output<void>();

  public get statisticLabel(): string {
    return this.estimationType() === 't-shirt' ? 'Mode' : 'Average';
  }

  public get displayValue(): string {
    if (this.estimationType() === 't-shirt' && !this.shouldReveal()) {
      return '-';
    }

    const value = this.average();
    if (!value) {
      return this.estimationType() === 't-shirt' ? '-' : '0.0';
    }
    if (typeof value === 'string') {
      return value;
    }
    return value.toFixed(1);
  }
}
