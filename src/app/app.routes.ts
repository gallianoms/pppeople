import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'welcome'
  },
  {
    path: 'welcome',
    loadComponent: () => import('./features/welcome/welcome.component').then(c => c.WelcomeComponent)
  },
  {
    path: 'room/:id',
    loadComponent: () => import('./features/room/room.component').then(c => c.RoomComponent)
  }
];
