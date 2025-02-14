import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-room-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="absolute bottom-4 right-4 flex items-center gap-2">
      <a
        href="https://www.linkedin.com/in/gallianoms/"
        target="_blank"
        rel="noopener noreferrer"
        class="text-gray-400 hover:text-emerald-400 transition-colors duration-300"
        aria-label="Galliano's LinkedIn profile"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
          />
        </svg>
      </a>
      <span class="text-gray-400 font-mono">|</span>
      <a
        href="https://jsalvadev.github.io/"
        target="_blank"
        rel="noopener noreferrer"
        class="text-gray-400 hover:text-emerald-400 transition-colors duration-300 font-mono"
        aria-label="jsalvadev.github.io"
      >
        jsalvadev.github.io
      </a>
    </div>
  `
})
export class RoomFooterComponent {}
