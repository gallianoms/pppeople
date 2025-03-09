import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vote-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vote-controls.component.html'
})
export class VoteControlsComponent {
  public readonly numbers = input<number[]>([]);
  public readonly selectedNumber = input<number | null>(null);
  public readonly numberSelected = output<number>();

  public onSelect(number: number): void {
    if (this.selectedNumber() === null) {
      this.numberSelected.emit(number);
    }
  }
}
