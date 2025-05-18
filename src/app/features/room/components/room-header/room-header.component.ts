import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButtonComponent } from '../../../../shared/components/action-button/action-button.component';

@Component({
  selector: 'app-room-header',
  standalone: true,
  imports: [CommonModule, ActionButtonComponent],
  templateUrl: './room-header.component.html',
  styleUrls: ['./styles/button-effect.css']
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
}
