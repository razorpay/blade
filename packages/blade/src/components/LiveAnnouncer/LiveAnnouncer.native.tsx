/* eslint-disable @typescript-eslint/ban-ts-comment */

import { AccessibilityInfo } from 'react-native';
import type { Assertiveness } from './LiveAnnouncer.d';

export function announce(
  message: string,
  _assertiveness: Assertiveness = 'assertive',
  _timeout = 0,
): void {
  AccessibilityInfo.announceForAccessibility(message);
}

export function clearAnnouncer(_assertiveness: Assertiveness): void {
  console.log('[Blade LiveAnnouncer]: clearAnnouncer is not needed in react-native');
}

export function destroyAnnouncer(): void {
  console.log('[Blade LiveAnnouncer]: destroyAnnouncer is not needed in react-native');
}
