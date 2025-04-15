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
  public readonly estimationType = input<'fibonacci' | 'tshirt'>('fibonacci');
  public readonly tshirtSizes = ['XS', 'S', 'M', 'L', 'XL'];

  public getDisplayValue(): string {
    if (this.vote() === null) {
      return '?';
    }

    if (this.estimationType() === 'tshirt') {
      return this.tshirtSizes[this.vote()! - 1] || this.vote()!.toString();
    }

    return this.vote()!.toString();
  }
}
