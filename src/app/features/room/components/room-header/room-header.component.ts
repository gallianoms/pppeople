import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablerIconComponent } from 'angular-tabler-icons';

@Component({
  selector: 'app-room-header',
  standalone: true,
  imports: [CommonModule, TablerIconComponent],
  templateUrl: './room-header.component.html',
  styleUrls: ['./styles/button-effect.css']
})
export class RoomHeaderComponent {
  public readonly copyingLink = input(false);
  public readonly isSpectator = input(false);
  public readonly canToggleSpectator = input(true);
  public readonly copyInviteLink = output<void>();
  public readonly leave = output<void>();
  public readonly toggleSpectator = output<void>();
}
