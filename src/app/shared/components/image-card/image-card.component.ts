import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-card.component.html'
})
export class ImageCardComponent {
  @Input() imageSrc = 'images/planning-poker.webp';
  @Input() imageAlt = 'Planning Poker';
  @Input() containerClass = 'h-80';
  @Input() mobileClass = 'h-48';
}
