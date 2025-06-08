import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-social-links',
  templateUrl: './social-links.component.html',
  standalone: true,
  imports: [CommonModule, TablerIconsModule]
})
export class SocialLinksComponent {
  readonly theme = input<'light' | 'dark'>('light');
}
