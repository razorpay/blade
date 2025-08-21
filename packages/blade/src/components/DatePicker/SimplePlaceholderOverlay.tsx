import React from 'react';
import styled from 'styled-components';
import { Text } from '~components/Typography';

type SimplePlaceholderOverlayProps = {
  /**
   * The full placeholder format (e.g., "DD/MM/YYYY")
   */
  placeholder: string;
  /**
   * The current typed value (e.g., "03/1")
   */
  value: string;
  /**
   * Size to match the input (DatePicker only supports medium and large)
   */
  size?: 'medium' | 'large';
  /**
   * Whether the label is positioned on the left
   */
  isLabelLeftPositioned?: boolean;
  /**
   * Whether to show partial placeholder overlay (true) or use normal placeholder behavior (false)
   * When true: shows "03/MM/YYYY" when user types "03"
   * When false: shows normal placeholder behavior
   */
  showPartialPlaceholder?: boolean;
};

/**
 * DatePicker overlay container - simplified for medium/large sizes with CalendarIcon
 */
const OverlayContainer = styled.div<{
  $size: 'medium' | 'large';
  $isLabelLeftPositioned?: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none; /* Allow clicks to pass through */
  display: flex;
  align-items: center;
  z-index: 9999; /* Behind the input but above background */

  /* Simplified calculations for DatePicker (medium/large + CalendarIcon always present) */
  padding-top: ${({ $size = 'medium', $isLabelLeftPositioned }) => {
    const baseTopPadding = $size === 'medium' ? 8 : 12; // Base padding from input

    if ($isLabelLeftPositioned) {
      return `${baseTopPadding}px`;
    } else {
      // If label is not left positioned (top/bottom), add label space
      const labelSpace = $size === 'medium' ? 22 : 28;
      return `${baseTopPadding + labelSpace}px`;
    }
  }};

  padding-left: ${({ $size = 'medium', $isLabelLeftPositioned }) => {
    const iconSize = $size === 'medium' ? 28 : 32;
    const iconGap = 8;

    return `${
      ($isLabelLeftPositioned ? ($size === 'medium' ? 132 : 192) : 0) + iconSize + iconGap
    }px`;
  }};

  padding-right: 16px;

  padding-bottom: ${({ $size = 'medium' }) => ($size === 'medium' ? 8 : 12)}px;

  /* Height calculations based on label position and size */
  height: ${({ $size = 'medium', $isLabelLeftPositioned }) => {
    if ($isLabelLeftPositioned) {
      // Label left position: medium=36px, large=48px
      return $size === 'large' ? '48px' : '36px';
    } else {
      // Label top position: base height + extra space
      const baseHeight = $size === 'large' ? 48 : 36; // Same as label left base
      const extraSpace = $size === 'large' ? 28 : 22; // Extra space for top label
      return `${baseHeight + extraSpace}px`; // large: 76px, medium: 54px
    }
  }};
`;

/**
 * Simple placeholder overlay that updates dynamically as user types
 * Shows remaining placeholder text for untyped portions
 */
export const SimplePlaceholderOverlay: React.FC<SimplePlaceholderOverlayProps> = ({
  placeholder,
  value,
  size = 'medium',
  isLabelLeftPositioned = false,
  showPartialPlaceholder = false,
}) => {
  console.log('qswap', showPartialPlaceholder);

  // Don't render overlay if showPartialPlaceholder is false
  if (!showPartialPlaceholder) {
    return null;
  }

  // Calculate what to show in overlay
  const getOverlayText = (placeholder: string, value: string): string => {
    if (!value || value.trim() === '') {
      return placeholder; // Show full placeholder when empty
    }

    // Combine user's typed value with remaining placeholder
    // Example: value="01", placeholder="DD/MM/YYYY" → result="01/MM/YYYY"
    console.log('qswap', placeholder.length, value.length, placeholder.slice(value.length));
    const remainingPlaceholder = placeholder.slice(value.length);
    console.log('qswap', value + remainingPlaceholder);
    return value + remainingPlaceholder;
  };

  const overlayText = getOverlayText(placeholder, value).replace(/ /g, '\u00A0');
  // Replace regular spaces with non-breaking spaces to prevent CSS/font from collapsing
  // multiple spaces (especially around range separator " – ") in the overlay display

  // Don't render if no overlay text needed
  if (!overlayText.trim()) {
    return null;
  }
  return (
    <OverlayContainer $size={size} $isLabelLeftPositioned={isLabelLeftPositioned}>
      <Text size={size} color="surface.text.gray.disabled" weight="regular">
        {overlayText}
      </Text>
    </OverlayContainer>
  );
};
