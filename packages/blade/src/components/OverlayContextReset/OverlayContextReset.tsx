import React from 'react';
import { ButtonGroupProvider } from '~components/ButtonGroup/ButtonGroupContext';

const noop = {};

/**
 * OverlayContextReset is used to reset contexts that shouldn't leak into overlay content.
 *
 * When components like Popover, Dropdown etc render content,
 * the React context from parent components can leak into the overlay content.
 * For example, if a Popover is triggered from inside a ButtonGroup, buttons
 * inside the Popover would inherit the ButtonGroup's styles (size, variant, etc.).
 *
 * This component resets those contexts so overlay content behaves independently.
 */
const OverlayContextReset = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    // Reset ButtonGroup context so buttons inside overlays don't inherit group styles
    <ButtonGroupProvider value={noop}>{children}</ButtonGroupProvider>
  );
};

export { OverlayContextReset };
