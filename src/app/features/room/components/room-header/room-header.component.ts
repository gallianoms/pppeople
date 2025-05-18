import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButtonComponent } from '../../../../shared/components/action-button/action-button.component';
import { TablerIconComponent } from 'angular-tabler-icons';

@Component({
  selector: 'app-room-header',
  standalone: true,
  imports: [CommonModule, ActionButtonComponent, TablerIconComponent],
  templateUrl: './room-header.component.html',
  styleUrls: ['./styles/button-effect.css', './styles/mobile-menu.css']
})
export class RoomHeaderComponent {
  public readonly copyingLink = input(false);
  public readonly isSpectator = input(false);
  public readonly canToggleSpectator = input(true);
  public readonly isHost = input(false);
  public readonly showRevealButton = input(false);
  public readonly copyInviteLink = output<void>();
  public readonly leave = output<void>();
  public readonly toggleSpectator = output<void>();
  public readonly forceRevealCards = output<void>();

  // Mobile menu state
  public isMobileMenuOpen = signal(false);

  public toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(open => !open);
  }

  public closeMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
