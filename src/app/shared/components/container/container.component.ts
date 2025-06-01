import { Component, input } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [CommonModule, NgClass],
  template: `
    <div
      class="container mx-auto px-4 max-sm:py-4 py-8"
      [ngClass]="customClasses()"
    >
      <ng-content></ng-content>
    </div>
  `
})
export class ContainerComponent {
  readonly customClasses = input('');
}
