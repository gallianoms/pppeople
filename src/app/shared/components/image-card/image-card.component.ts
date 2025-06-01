import { Component, input } from '@angular/core';

@Component({
  selector: 'app-image-card',
  standalone: true,
  imports: [],
  templateUrl: './image-card.component.html'
})
export class ImageCardComponent {
  readonly imageSrc = input('images/planning-poker.webp');
  readonly imageAlt = input('Planning Poker');
  readonly containerClass = input('h-48');
  readonly mobileClass = input('h-24');
}
