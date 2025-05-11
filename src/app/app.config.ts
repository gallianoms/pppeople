import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTablerIcons } from 'angular-tabler-icons';
import {
  IconInfoCircle,
  IconBrandLinkedin,
  IconDoorExit,
  IconClipboard,
  IconClipboardCheck,
  IconX,
  IconPlus,
  IconUserPlus,
  IconCheck,
  IconLink,
  IconEye,
  IconEdit
} from 'angular-tabler-icons/icons';

import { routes } from './app.routes';

const icons = {
  IconInfoCircle,
  IconBrandLinkedin,
  IconClipboard,
  IconClipboardCheck,
  IconDoorExit,
  IconX,
  IconPlus,
  IconUserPlus,
  IconCheck,
  IconLink,
  IconEye,
  IconEdit
};

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideTablerIcons(icons)]
};
