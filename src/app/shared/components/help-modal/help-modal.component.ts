import { Component, EventEmitter, Output, HostListener } from '@angular/core';

@Component({
  selector: 'app-help-modal',
  standalone: true,
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
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
              <div class="p-2 bg-emerald-500/10 rounded-lg shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
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
              <div class="p-2 bg-emerald-500/10 rounded-lg shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
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
              <div class="p-2 bg-emerald-500/10 rounded-lg shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
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
