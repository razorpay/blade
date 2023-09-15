import { AccessibilityInfo } from 'react-native';
import type { Assertiveness } from './types';
import { logger } from '~utils/logger';

export function announce(message: string, _assertiveness: Assertiveness = 'assertive'): void {
  AccessibilityInfo.announceForAccessibility(message);
}

export function clearAnnouncer(_assertiveness: Assertiveness): void {
  if (__DEV__) {
    logger({
      type: 'warn',
      message: 'clearAnnouncer is not needed in react-native',
      moduleName: 'LiveAnnouncer',
    });
  }
}

export function destroyAnnouncer(): void {
  if (__DEV__) {
    logger({
      type: 'warn',
      message: 'destroyAnnouncer is not needed in react-native',
      moduleName: 'LiveAnnouncer',
    });
  }
}
