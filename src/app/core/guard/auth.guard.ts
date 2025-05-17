import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { RoomManagementService } from '../services/room-management.service';

export const authGuard: CanActivateFn = async route => {
  const router = inject(Router);
  const roomManagementService = inject(RoomManagementService);
  const navigationState = router.getCurrentNavigation()?.extras.state;

  // If we have navigation state with roomId and userId, allow access
  if (navigationState && navigationState['roomId'] && navigationState['userId']) {
    // If we have a session state, try to rejoin the room
    const storedConfig = sessionStorage.getItem('roomConfig');
    if (storedConfig) {
      try {
        const sessionState = JSON.parse(storedConfig) as { roomId: string; userId: string; isHost: boolean };
        if (sessionState.roomId === navigationState['roomId'] && sessionState.userId === navigationState['userId']) {
          // If the session state matches the navigation state, try to rejoin
          try {
            await roomManagementService.rejoinRoom(sessionState.roomId, sessionState.userId, false);
            return true;
          } catch (error) {
            console.warn('Failed to rejoin room, continuing with normal flow', error);
          }
        }
      } catch (e) {
        console.warn('Failed to parse stored room config', e);
      }
    }
    return true;
  }

  // If we're trying to access a room directly via URL
  const roomId = route.paramMap.get('roomId');
  if (roomId) {
    try {
      // Try to join the room as a participant (not spectator)
      const { userId, estimationType } = await roomManagementService.joinRoom(roomId, false);

      // Create room configuration
      const roomConfig = {
        roomId,
        userId,
        isHost: false,
        isSpectator: false,
        estimationType
      };

      // Store room configuration in history state
      history.replaceState(roomConfig, '');

      // Store the room config in sessionStorage as backup
      sessionStorage.setItem('roomConfig', JSON.stringify(roomConfig));

      // Allow the navigation to continue
      return true;
    } catch (error) {
      console.error('Failed to join room via URL:', error);
    }
  }

  // If we get here, either there's no roomId or joining failed
  router.navigate(['/welcome']);
  return false;
};
