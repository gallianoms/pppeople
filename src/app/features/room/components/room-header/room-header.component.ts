import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-room-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="absolute top-8 right-8 flex flex-col gap-2">
      <div
        role="button"
        tabindex="0"
        class="flex items-center gap-2 bg-gray-800/30 backdrop-blur-sm border border-indigo-400/50 px-4 py-2 rounded-full cursor-pointer hover:bg-indigo-500/20 transition-all duration-300 min-w-[206px]"
        (click)="onCopyCode()"
        (keyup.enter)="onCopyCode()"
        [attr.aria-label]="copying ? 'Code copied' : 'Copy room code'"
      >
        <p class="text-gray-300 font-mono">
          {{ copying ? 'Copied code!' : 'Share code room' }}
        </p>
        <svg
          *ngIf="!copying"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <svg
          *ngIf="copying"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      </div>

      <div
        role="button"
        tabindex="0"
        class="flex items-center gap-2 bg-gray-800/30 backdrop-blur-sm border border-emerald-400/50 px-4 py-2 rounded-full cursor-pointer hover:bg-emerald-500/20 transition-all duration-300"
        (click)="onLeave()"
        (keyup.enter)="onLeave()"
        aria-label="Leave room"
      >
        <p class="text-gray-300 font-mono">Leave room</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      </div>
    </div>
  `
})
export class RoomHeaderComponent {
  @Input() copying = false;
  @Output() copyCode = new EventEmitter<void>();
  @Output() leave = new EventEmitter<void>();

  onCopyCode() {
    this.copyCode.emit();
  }

  onLeave() {
    this.leave.emit();
  }
}
