import type React from 'react';
import type { RazorSenseDrawProps } from '../RazorSenseEngine/drawProps';

type RazorSenseChatBackgroundProps = {
  /**
   * The chat input it sits behind (flow 9's landing). The strip stretches to the input's width and height, the bands keeping
   * their size, and its glow spills outside it. Fits chat inputs 280-1260 px wide (a phone's, up to 1.5x flow 9's 840) and
   * 58-320 px tall (growing with lines or attachments); past those it stretches as for the nearest end, centred on the input.
   * Typing in it (any input, textarea or editable element inside) pulses the strip into its typing surge; it dies back down when
   * the typing stops. What's typed is never read.
   */
  children: React.ReactNode;
} & RazorSenseDrawProps;

export type { RazorSenseChatBackgroundProps };
