import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const navigationState = router.getCurrentNavigation()?.extras.state;

  if (!navigationState || !navigationState['roomId'] || !navigationState['userId']) {
    router.navigate(['/welcome']);
    return false;
  }

  return true;
};
