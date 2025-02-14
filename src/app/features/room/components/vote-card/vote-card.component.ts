import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vote-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="w-16 h-24 bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-lg relative transition-all duration-300"
      [ngClass]="{ 'border-emerald-500/50': vote() }"
    >
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="text-2xl font-mono text-gray-300">
          {{ showNullVote() ? (vote() ? '✓' : '?') : vote() }}
        </span>
      </div>
      <div
        class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full"
        [class]="vote() ? 'bg-emerald-500' : 'bg-gray-500'"
      ></div>
    </div>
  `
})
export class VoteCardComponent {
  public readonly vote = input<number | null>(null);
  public readonly showNullVote = input(false);
}
