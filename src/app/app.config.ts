import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTablerIcons } from 'angular-tabler-icons';
import {
  IconInfoCircle,
  IconBrandLinkedin,
  IconDoorExit,
  IconSpade,
  IconClipboardCheck,
  IconX,
  IconPlus,
  IconUserPlus,
  IconCheck,
  IconLink,
  IconEye,
  IconEdit,
  IconMenu2
} from 'angular-tabler-icons/icons';

import { routes } from './app.routes';

const icons = {
  IconInfoCircle,
  IconBrandLinkedin,
  IconSpade,
  IconClipboardCheck,
  IconDoorExit,
  IconX,
  IconPlus,
  IconUserPlus,
  IconCheck,
  IconLink,
  IconEye,
  IconEdit,
  IconMenu2
};

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideTablerIcons(icons)]
};
