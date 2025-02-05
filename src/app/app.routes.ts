import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';

export const routes: Routes = [
  {
    path: 'welcome',
    loadComponent: () => import('./features/welcome/welcome.component').then(c => c.WelcomeComponent)
  },
  {
    path: 'room/:roomId',
    loadComponent: () => import('./features/room/room.component').then(c => c.RoomComponent),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(c => c.NotFoundComponent)
  }
];
