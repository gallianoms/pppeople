import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-help-modal',
  standalone: true,
  template: `
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-gray-800 rounded-xl p-6 md:p-8 max-w-2xl w-full relative">
        <button
          (click)="close.emit()"
          class="absolute top-4 right-4 text-gray-400 hover:text-white"
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

        <h2 class="text-2xl font-bold text-emerald-500 mb-6">How it works</h2>
        <div class="space-y-4 text-gray-300">
          <div>
            <h3 class="text-lg font-semibold text-emerald-400 mb-2">Creating a Room</h3>
            <p>Click "Create Room" to start a new planning session. You'll be the host with full control.</p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-emerald-400 mb-2">Joining a Room</h3>
            <p>Enter the room code and choose your role:</p>
            <ul class="list-disc list-inside ml-4 mt-2">
              <li>Player: Can participate in voting</li>
              <li>Spectator: Can only watch the session</li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-emerald-400 mb-2">Voting</h3>
            <p>Select a card with your estimate. The host can reset votes for a new round.</p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-emerald-400 mb-2">Results</h3>
            <p>Once everyone votes, all cards are revealed and the average is calculated.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HelpModalComponent {
  @Output() close = new EventEmitter<void>();
}
