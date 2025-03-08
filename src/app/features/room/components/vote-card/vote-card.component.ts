import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vote-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vote-card.component.html'
})
export class VoteCardComponent {
  public readonly vote = input<number | null>(null);
  public readonly showNullVote = input(false);
}
