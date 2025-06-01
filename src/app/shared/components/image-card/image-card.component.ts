import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-card',
  standalone: true,
  imports: [],
  templateUrl: './image-card.component.html'
})
export class ImageCardComponent {
  @Input() imageSrc = 'images/planning-poker.webp';
  @Input() imageAlt = 'Planning Poker';
  @Input() containerClass = 'h-48';
  @Input() mobileClass = 'h-24';
}
