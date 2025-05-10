import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-social-links-footer',
  templateUrl: './social-links-footer.component.html',
  standalone: true,
  imports: [CommonModule, TablerIconsModule]
})
export class SocialLinksFooterComponent {
  @Input() theme: 'light' | 'dark' = 'light';
}
