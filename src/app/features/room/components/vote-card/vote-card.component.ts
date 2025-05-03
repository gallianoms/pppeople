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
  public readonly estimationType = input<'fibonacci' | 't-shirt'>('fibonacci');
  public readonly tshirtSizes = ['XS', 'S', 'M', 'L', 'XL'];

  public getDisplayValue(): string {
    if (this.vote() === null) {
      return '?';
    }

    if (this.estimationType() === 't-shirt') {
      const index = this.vote()! - 1;
      if (index >= 0 && index < this.tshirtSizes.length) {
        return this.tshirtSizes[index];
      }
    }

    return this.vote()!.toString();
  }

  public getImageSrc(): string {
    if (!this.vote()) return '';

    if (this.estimationType() === 'fibonacci') {
      return `images/numbers/${this.vote()}.webp`;
    } else {
      const tshirtSize = this.getDisplayValue();
      return `images/tshirts/${tshirtSize.toLowerCase()}.webp`;
    }
  }
}
