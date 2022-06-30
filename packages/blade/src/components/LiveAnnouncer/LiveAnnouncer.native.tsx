import { AccessibilityInfo } from 'react-native';
import type { Assertiveness } from './LiveAnnouncer.d';

export function announce(message: string, _assertiveness: Assertiveness = 'assertive'): void {
  AccessibilityInfo.announceForAccessibility(message);
}

export function clearAnnouncer(_assertiveness: Assertiveness): void {
  console.warn('[Blade LiveAnnouncer]: clearAnnouncer is not needed in react-native');
}

export function destroyAnnouncer(): void {
  console.warn('[Blade LiveAnnouncer]: destroyAnnouncer is not needed in react-native');
}
