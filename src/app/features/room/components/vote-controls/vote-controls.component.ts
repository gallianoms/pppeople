import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vote-controls',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-center items-center gap-4">
      @for (number of numbers(); track number) {
        <div
          (click)="onSelect(number)"
          (keyup.enter)="onSelect(number)"
          [tabindex]="selectedNumber() === null ? 0 : -1"
          [ngClass]="{
            'bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 text-white': selectedNumber() === number,
            'bg-gray-400/10 backdrop-blur-sm border border-gray-300/30 text-gray-300': selectedNumber() !== number,
            'cursor-not-allowed opacity-50': selectedNumber() !== null && selectedNumber() !== number,
            'cursor-pointer': selectedNumber() === null
          }"
          class="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <span class="text-2xl font-mono">{{ number }}</span>
        </div>
      }
    </div>
  `
})
export class VoteControlsComponent {
  public readonly numbers = input<number[]>([]);
  public readonly selectedNumber = input<number | null>(null);
  public readonly numberSelected = output<number>();

  onSelect(number: number) {
    if (this.selectedNumber() === null) {
      this.numberSelected.emit(number);
    }
  }
}
