import { Component, EventEmitter, Output, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-room-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mt-12 flex flex-col gap-4">
      <div class="flex gap-4">
        <div class="flex items-center gap-2 backdrop-blur-sm px-4 py-2 rounded-full">
          <p class="text-gray-300 font-mono">
            Average:
            <span class="text-indigo-300 font-bold text-xl">{{ average() | number: '1.1-1' }}</span>
          </p>
        </div>
        <button
          *ngIf="!isSpectator()"
          (click)="onDeleteVote()"
          [disabled]="!canChangeVote()"
          class="px-4 py-2 border border-yellow-500/50 text-yellow-400 rounded-full font-mono transition-all duration-300 bg-gray-800/30 backdrop-blur-sm"
          [class.opacity-50]="!canChangeVote()"
          [class.cursor-not-allowed]="!canChangeVote()"
          [class.hover:text-yellow-500]="canChangeVote()"
        >
          Change vote
        </button>
      </div>
      @if (isHost()) {
        <button
          (click)="onReset()"
          class="w-full px-4 py-2 border border-red-500/50 text-red-400 rounded-full hover:text-red-500 font-mono transition-all duration-300 bg-gray-800/30 backdrop-blur-sm"
        >
          Reset votes
        </button>
      }
    </div>
  `
})
export class RoomStatsComponent {
  public readonly average = input(0);
  public readonly isHost = input(false);
  public readonly isSpectator = input(false);
  public readonly canChangeVote = input(false);
  @Output() deleteVote = new EventEmitter<void>();
  @Output() resetVotes = new EventEmitter<void>();

  onDeleteVote() {
    this.deleteVote.emit();
  }

  onReset() {
    this.resetVotes.emit();
  }
}
