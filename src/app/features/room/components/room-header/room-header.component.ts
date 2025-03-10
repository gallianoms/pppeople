import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablerIconComponent } from 'angular-tabler-icons';

@Component({
  selector: 'app-room-header',
  standalone: true,
  imports: [CommonModule, TablerIconComponent],
  template: `
    <div class="absolute top-8 right-8 flex flex-col gap-2">
      <div
        role="button"
        tabindex="0"
        class="flex items-center gap-2 bg-gray-800/30 backdrop-blur-sm border border-emerald-400/50 px-4 py-2 rounded-full cursor-pointer hover:bg-emerald-500/20 transition-all duration-300 min-w-[206px]"
        (click)="onCopyCode()"
        (keyup.enter)="onCopyCode()"
        [attr.aria-label]="copying() ? 'Code copied' : 'Copy room code'"
      >
        @if (!copying()) {
          <i-tabler
            name="clipboard"
            class="text-gray-300"
          ></i-tabler>
        }
        @if (copying()) {
          <i-tabler
            name="clipboard-check"
            class="text-emerald-300"
          ></i-tabler>
        }
        <p class="text-gray-300 font-mono">
          {{ copying() ? 'Copied code' : 'Share code room' }}
        </p>
      </div>

      <div
        role="button"
        tabindex="0"
        class="flex items-center gap-2 bg-gray-800/30 backdrop-blur-sm border border-gray-400/50 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-500/20 transition-all duration-300"
        (click)="onLeave()"
        (keyup.enter)="onLeave()"
        aria-label="Leave room"
      >
        <i-tabler
          name="door-exit"
          class="text-gray-300"
        ></i-tabler>
        <p class="text-gray-300 font-mono">Leave room</p>
      </div>
    </div>
  `
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
