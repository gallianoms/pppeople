import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="h-screen flex flex-col items-center justify-center">
      <h1 class="text-6xl font-bold text-emerald-500 mb-4">404</h1>
      <p class="text-xl text-gray-300 mb-8">Oops! Page not found</p>
      <a
        routerLink="/welcome"
        class="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-300"
      >
        Go to Home
      </a>
    </div>
  `,
  styles: ``
})
export class NotFoundComponent {}
