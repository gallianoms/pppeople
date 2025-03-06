import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { TablerIconComponent } from 'angular-tabler-icons';

@Component({
  selector: 'app-help-modal',
  standalone: true,
  imports: [TablerIconComponent],
  template: `
    <div
      class="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn motion-safe:transition-all motion-safe:duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        class="bg-gray-800/95 rounded-2xl p-8 max-w-2xl w-full relative border border-emerald-500/30 shadow-xl shadow-emerald-500/20 overflow-hidden animate-scaleIn motion-safe:transition-all motion-safe:duration-300 hover:border-emerald-500/50"
      >
        <button
          (click)="close.emit()"
          class="absolute top-4 right-4 text-gray-400 hover:text-emerald-400 transition-all duration-300"
          aria-label="Close modal"
        >
          <i-tabler name="x"></i-tabler>
        </button>

        <div class="text-center mb-8">
          <h2
            id="modal-title"
            class="text-3xl font-bold text-emerald-400 mb-3 font-mono tracking-tight"
          >
            Welcome to Planning Poker
          </h2>
          <p class="text-gray-400">Let's get you started with a quick guide</p>
        </div>

        <div class="space-y-6 text-gray-300">
          <div
            class="p-4 rounded-lg bg-gray-900/50 border border-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300"
          >
            <div class="flex items-start gap-3">
              <div class="p-2 bg-emerald-500/10 rounded-lg shrink-0 flex items-center justify-center">
                <i-tabler
                  name="plus"
                  class="text-emerald-400"
                ></i-tabler>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-emerald-400 mb-2">Creating a Room</h3>
                <p class="text-gray-400">
                  Start your planning session by clicking "Create Room". As the host, you'll have full control over the
                  session.
                </p>
              </div>
            </div>
          </div>

          <div
            class="p-4 rounded-lg bg-gray-900/50 border border-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300"
          >
            <div class="flex items-start gap-3">
              <div class="p-2 bg-emerald-500/10 rounded-lg shrink-0 flex items-center justify-center">
                <i-tabler
                  name="user-plus"
                  class="text-emerald-400"
                ></i-tabler>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-emerald-400 mb-2">Joining a Room</h3>
                <p class="text-gray-400 mb-2">Enter the room code and select your role:</p>
                <ul class="list-none space-y-2">
                  <li class="flex items-center gap-2">
                    <span class="w-2 h-2 bg-emerald-400 rounded-full"></span>
                    <span>Player: Actively participate in voting</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="w-2 h-2 bg-emerald-400 rounded-full"></span>
                    <span>Spectator: Observe the session without voting</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div
            class="p-4 rounded-lg bg-gray-900/50 border border-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300"
          >
            <div class="flex items-start gap-3">
              <div class="p-2 bg-emerald-500/10 rounded-lg shrink-0 flex items-center justify-center">
                <i-tabler
                  name="check"
                  class="text-emerald-400"
                ></i-tabler>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-emerald-400 mb-2">Voting & Results</h3>
                <p class="text-gray-400">
                  Choose your estimate by selecting a card. Once everyone votes, cards are revealed and the average
                  score is calculated automatically.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 text-center">
          <button
            (click)="close.emit()"
            class="px-8 py-3 bg-emerald-500/20 text-emerald-400 rounded-full hover:bg-emerald-500/30 transition-all duration-300 text-base font-medium transform  hover:shadow-emerald-500/20 active:scale-95"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  `
})
export class HelpModalComponent {
  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.close.emit();
  }

  @HostListener('click', ['$event'])
  onBackdropClick(event: MouseEvent): void {
    // Close modal when clicking on backdrop (not on modal content)
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.close.emit();
    }
  }
}
