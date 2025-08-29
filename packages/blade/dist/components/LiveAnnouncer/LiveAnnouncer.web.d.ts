import { Assertiveness } from './types';
/**
 * Announces the message using screen reader technology.
 */
export declare function announce(message: string, assertiveness?: Assertiveness): void;
/**
 * Stops all queued announcements.
 */
export declare function clearAnnouncer(assertiveness: Assertiveness): void;
/**
 * Removes the announcer from the DOM.
 */
export declare function destroyAnnouncer(): void;
