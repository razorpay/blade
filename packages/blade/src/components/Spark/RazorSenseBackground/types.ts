import type { RazorSenseDrawProps } from '../RazorSenseEngine/drawProps';

type RazorSenseBackgroundProps = {
  /**
   * Width of the background. It fills its box, and the piece is placed in it as the login page has it (cover-fitted: on a 1512 x
   * 862 box, 1 px of the design is 0.5 px); what falls outside the box is cut off by it.
   * @default '100%'
   */
  width?: string | number;
  /**
   * Height of the background.
   * @default '100%'
   */
  height?: string | number;
} & RazorSenseDrawProps;

export type { RazorSenseBackgroundProps };
