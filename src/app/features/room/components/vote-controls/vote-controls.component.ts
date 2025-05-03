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
  public readonly tshirtSizes = input<string[]>([]);
  public readonly selectedNumber = input<number | null>(null);
  public readonly selectedSize = input<string | null>(null);
  public readonly estimationType = input<'fibonacci' | 't-shirt'>('fibonacci');
  public readonly numberSelected = output<number | string>();

  public onSelect(value: number | string): void {
    this.numberSelected.emit(value);
  }
}
