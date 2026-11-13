import { opacity } from '~tokens/global';

/**
 * The DrawerHeader gradient is a radial-gradient centred at the bottom-middle of the header.
 * On its own it still has colour at the bottom corners, which shows up as a hard edge where the
 * header meets the drawer body (most visible in dark mode).
 *
 * To avoid that edge, the gradient layer is faded out towards the bottom: it stays fully visible
 * for the top part of the header and fades to transparent by the bottom edge.
 *
 * Shared by web (CSS mask-image) and native (react-native-svg Mask) so both platforms match Figma.
 */

/**
 * Fraction of the header height (0–1) where the gradient starts fading out.
 * Above this point the gradient is unchanged; below it, it fades linearly to transparent.
 */
const DRAWER_HEADER_GRADIENT_FADE_START = 0.45;

/**
 * Opacity of the whole gradient layer. Tones the tint down so it stays a subtle colour cue,
 * especially in dark mode where the full-strength tint looks heavy behind the header content.
 */
const DRAWER_HEADER_GRADIENT_OPACITY = opacity[800];

export { DRAWER_HEADER_GRADIENT_FADE_START, DRAWER_HEADER_GRADIENT_OPACITY };
