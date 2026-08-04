import React from 'react';
import BaseBox from '~components/Box/BaseBox';

type CardInfoSurfaceProps = {
  /**
   * Content of the emphasized (white) header section.
   */
  top: React.ReactNode;
  /**
   * Content of the subtle (gray) body section.
   */
  bottom: React.ReactNode;
  /**
   * Interactive overlay (link/button) that spans the whole card.
   */
  children?: React.ReactNode;
  isSelected?: boolean;
  isDisabled?: boolean;
};

/**
 * Renders the "info" ticket chrome: two stacked sections — an emphasized header on
 * `surface.background.gray.intense` and a subtle body on `surface.background.gray.moderate` —
 * wrapped by a single rounded border. Unlike the `ticket` variant there is no perforated tear
 * line, notches or scallops. `overflow: hidden` clips the section backgrounds to the border radius.
 */
const CardInfoSurface = ({
  top,
  bottom,
  children,
  isSelected,
  isDisabled,
}: CardInfoSurfaceProps): React.ReactElement => {
  const borderColor =
    isSelected && !isDisabled ? 'surface.border.primary.normal' : 'surface.border.gray.subtle';
  const borderStyle = isDisabled ? 'dashed' : 'solid';

  return (
    <BaseBox
      position="relative"
      display="flex"
      flexDirection="column"
      width="100%"
      overflow="hidden"
      borderWidth="thin"
      borderColor={borderColor}
      borderStyle={borderStyle}
      borderRadius="medium"
    >
      {children}
      <BaseBox backgroundColor="surface.background.gray.intense" padding="spacing.4">
        {top}
      </BaseBox>
      <BaseBox backgroundColor="surface.background.gray.moderate" padding="spacing.4">
        {bottom}
      </BaseBox>
    </BaseBox>
  );
};

export { CardInfoSurface };
