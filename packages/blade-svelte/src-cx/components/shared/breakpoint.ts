// The one breakpoint (Blade's `m`, uno.config.ts), for the few looks
// whose behaviour switches with it: the `m:` classes and this query must
// agree, so the width lives here and nowhere else in the preset.
export const DESKTOP_MIN_WIDTH = '768px';

/** Matches below the desktop breakpoint: where no `m:` class applies. */
export const PHONE_MEDIA = `not all and (min-width: ${DESKTOP_MIN_WIDTH})`;
