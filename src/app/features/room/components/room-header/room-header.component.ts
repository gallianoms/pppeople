import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablerIconComponent } from 'angular-tabler-icons';

@Component({
  selector: 'app-room-header',
  standalone: true,
  imports: [CommonModule, TablerIconComponent],
  templateUrl: './room-header.component.html'
})
export class RoomHeaderComponent {
  public readonly copying = input(false);
  public readonly copyCode = output<void>();
  public readonly leave = output<void>();

  onCopyCode() {
    this.copyCode.emit();
  }

  onLeave() {
    this.leave.emit();
  }
}
