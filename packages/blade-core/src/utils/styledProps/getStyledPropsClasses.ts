/**
 * Converts styled props to CSS class names
 * Uses utility classes from @razorpay/blade-core/tokens/theme.css
 * Note: The theme.css must be imported globally for these classes to work
 */

import type { StyledPropsBlade } from './getStyledProps';
import { getSpacingValue } from './spacingUtils';

/**
 * Converts a responsive value to a CSS value for the current breakpoint
 */
const getResponsiveValue = <T extends string | number | string[]>(
  value: T | { base?: T; xs?: T; s?: T; m?: T; l?: T; xl?: T } | undefined,
  breakpoint: 'base' | 'xs' | 's' | 'm' | 'l' | 'xl' = 'base',
): T | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === 'string' || typeof value === 'number' || Array.isArray(value)) {
    if (breakpoint === 'base') {
      return value as T;
    }
    return undefined;
  }

  return value[breakpoint];
};

/**
 * Checks if a value is a spacing token (e.g., "spacing.3")
 */
const isSpacingToken = (value: string): boolean => {
  return typeof value === 'string' && value.startsWith('spacing.');
};

/**
 * Converts spacing value to class name
 * Handles spacing tokens (spacing.0 to spacing.11) and arbitrary values
 */
const spacingToClass = (value: string | undefined, prefix: string): string | undefined => {
  if (!value) return undefined;

  // Handle spacing tokens (e.g., "spacing.3" -> "spacing-3")
  if (isSpacingToken(value)) {
    const tokenNumber = value.replace('spacing.', '');
    return `${prefix}-spacing-${tokenNumber}`;
  }

  // Handle CSS variables (e.g., "var(--spacing-6)" -> "spacing-6")
  // This happens when getSpacingValue has already converted the token
  if (value.startsWith('var(--spacing-')) {
    const match = value.match(/var\(--spacing-(\d+)\)/);
    if (match) {
      const tokenNumber = match[1];
      return `${prefix}-spacing-${tokenNumber}`;
    }
  }

  // For arbitrary values (px, %, etc.), we'll need to use inline styles
  return undefined;
};

/**
 * Converts styled props to CSS class names array
 * Returns both class names and any inline styles needed for arbitrary values
 */
export const getStyledPropsClasses = (
  styledProps: StyledPropsBlade,
  breakpoint: 'base' | 'xs' | 's' | 'm' | 'l' | 'xl' = 'base',
): { classes: string[]; inlineStyles: Record<string, string | number> } => {
  const classes: string[] = [];
  const inlineStyles: Record<string, string | number> = {};

  // Display
  const display = getResponsiveValue(styledProps.display, breakpoint);
  if (display !== undefined) {
    classes.push(`display-${display}`);
  }

  // Visibility
  const visibility = getResponsiveValue(styledProps.visibility, breakpoint);
  if (visibility !== undefined) {
    classes.push(`visibility-${visibility}`);
  }

  // Position
  const position = getResponsiveValue(styledProps.position, breakpoint);
  if (position !== undefined) {
    classes.push(`position-${position}`);
  }

  const zIndex = getResponsiveValue(styledProps.zIndex, breakpoint);
  if (zIndex !== undefined) {
    // zIndex needs inline style for numeric values
    inlineStyles.zIndex = zIndex;
  }

  // Top, Right, Bottom, Left - use spacing utilities
  const topValue = getResponsiveValue(styledProps.top, breakpoint);
  if (topValue !== undefined) {
    if (isSpacingToken(topValue)) {
      const topClass = spacingToClass(topValue, 'top');
      if (topClass) {
        classes.push(topClass);
      }
    } else {
      const top = getSpacingValue(topValue);
      if (top !== undefined) {
        inlineStyles.top = top;
      }
    }
  }

  const rightValue = getResponsiveValue(styledProps.right, breakpoint);
  if (rightValue !== undefined) {
    if (isSpacingToken(rightValue)) {
      const rightClass = spacingToClass(rightValue, 'right');
      if (rightClass) {
        classes.push(rightClass);
      }
    } else {
      const right = getSpacingValue(rightValue);
      if (right !== undefined) {
        inlineStyles.right = right;
      }
    }
  }

  const bottomValue = getResponsiveValue(styledProps.bottom, breakpoint);
  if (bottomValue !== undefined) {
    if (isSpacingToken(bottomValue)) {
      const bottomClass = spacingToClass(bottomValue, 'bottom');
      if (bottomClass) {
        classes.push(bottomClass);
      }
    } else {
      const bottom = getSpacingValue(bottomValue);
      if (bottom !== undefined) {
        inlineStyles.bottom = bottom;
      }
    }
  }

  const leftValue = getResponsiveValue(styledProps.left, breakpoint);
  if (leftValue !== undefined) {
    if (isSpacingToken(leftValue)) {
      const leftClass = spacingToClass(leftValue, 'left');
      if (leftClass) {
        classes.push(leftClass);
      }
    } else {
      const left = getSpacingValue(leftValue);
      if (left !== undefined) {
        inlineStyles.left = left;
      }
    }
  }

  // Margin X and Y
  const marginXValue = getResponsiveValue(styledProps.marginX, breakpoint);
  if (marginXValue !== undefined) {
    // Check if it's a spacing token first (before conversion)
    if (isSpacingToken(marginXValue)) {
      const marginXClass = spacingToClass(marginXValue, 'margin-x');
      if (marginXClass) {
        classes.push(marginXClass);
      }
    } else {
      // For arbitrary values, convert and use inline styles
      const marginX = getSpacingValue(marginXValue);
      if (marginX !== undefined) {
        inlineStyles.marginLeft = marginX;
        inlineStyles.marginRight = marginX;
      }
    }
  }

  const marginYValue = getResponsiveValue(styledProps.marginY, breakpoint);
  if (marginYValue !== undefined) {
    // Check if it's a spacing token first (before conversion)
    if (isSpacingToken(marginYValue)) {
      const marginYClass = spacingToClass(marginYValue, 'margin-y');
      if (marginYClass) {
        classes.push(marginYClass);
      }
    } else {
      // For arbitrary values, convert and use inline styles
      const marginY = getSpacingValue(marginYValue);
      if (marginY !== undefined) {
        inlineStyles.marginTop = marginY;
        inlineStyles.marginBottom = marginY;
      }
    }
  }

  // Individual margin props
  const marginTopValue = getResponsiveValue(styledProps.marginTop, breakpoint);
  if (marginTopValue !== undefined) {
    if (isSpacingToken(marginTopValue)) {
      const marginTopClass = spacingToClass(marginTopValue, 'margin-top');
      if (marginTopClass) {
        classes.push(marginTopClass);
      }
    } else {
      const marginTop = getSpacingValue(marginTopValue);
      if (marginTop !== undefined) {
        inlineStyles.marginTop = marginTop;
      }
    }
  }

  const marginBottomValue = getResponsiveValue(styledProps.marginBottom, breakpoint);
  if (marginBottomValue !== undefined) {
    if (isSpacingToken(marginBottomValue)) {
      const marginBottomClass = spacingToClass(marginBottomValue, 'margin-bottom');
      if (marginBottomClass) {
        classes.push(marginBottomClass);
      }
    } else {
      const marginBottom = getSpacingValue(marginBottomValue);
      if (marginBottom !== undefined) {
        inlineStyles.marginBottom = marginBottom;
      }
    }
  }

  const marginLeftValue = getResponsiveValue(styledProps.marginLeft, breakpoint);
  if (marginLeftValue !== undefined) {
    if (isSpacingToken(marginLeftValue)) {
      const marginLeftClass = spacingToClass(marginLeftValue, 'margin-left');
      if (marginLeftClass) {
        classes.push(marginLeftClass);
      }
    } else {
      const marginLeft = getSpacingValue(marginLeftValue);
      if (marginLeft !== undefined) {
        inlineStyles.marginLeft = marginLeft;
      }
    }
  }

  const marginRightValue = getResponsiveValue(styledProps.marginRight, breakpoint);
  if (marginRightValue !== undefined) {
    if (isSpacingToken(marginRightValue)) {
      const marginRightClass = spacingToClass(marginRightValue, 'margin-right');
      if (marginRightClass) {
        classes.push(marginRightClass);
      }
    } else {
      const marginRight = getSpacingValue(marginRightValue);
      if (marginRight !== undefined) {
        inlineStyles.marginRight = marginRight;
      }
    }
  }

  // Margin shorthand (array or single value)
  const margin = getResponsiveValue(styledProps.margin, breakpoint);
  if (margin !== undefined) {
    if (Array.isArray(margin)) {
      // For arrays, use inline style
      inlineStyles.margin = margin
        .map((val) => getSpacingValue(val))
        .filter(Boolean)
        .join(' ');
    } else if (isSpacingToken(margin)) {
      const marginClass = spacingToClass(margin, 'margin');
      if (marginClass) {
        classes.push(marginClass);
      }
    } else {
      const marginValue = getSpacingValue(margin);
      if (marginValue !== undefined) {
        inlineStyles.margin = marginValue;
      }
    }
  }

  // Flexbox
  const alignSelf = getResponsiveValue(styledProps.alignSelf, breakpoint);
  if (alignSelf !== undefined) {
    classes.push(`align-self-${alignSelf}`);
  }

  const justifySelf = getResponsiveValue(styledProps.justifySelf, breakpoint);
  if (justifySelf !== undefined) {
    classes.push(`justify-self-${justifySelf}`);
  }

  const placeSelf = getResponsiveValue(styledProps.placeSelf, breakpoint);
  if (placeSelf !== undefined) {
    classes.push(`place-self-${placeSelf}`);
  }

  const order = getResponsiveValue(styledProps.order, breakpoint);
  if (order !== undefined) {
    // Order needs inline style for numeric values
    inlineStyles.order = order;
  }

  const flexWrap = getResponsiveValue(styledProps.flexWrap, breakpoint);
  if (flexWrap !== undefined) {
    classes.push(`flex-wrap-${flexWrap}`);
  }

  // Grid
  const gridColumn = getResponsiveValue(styledProps.gridColumn, breakpoint);
  if (gridColumn !== undefined) {
    // Grid properties typically need inline styles for complex values
    inlineStyles.gridColumn = gridColumn;
  }

  const gridRow = getResponsiveValue(styledProps.gridRow, breakpoint);
  if (gridRow !== undefined) {
    inlineStyles.gridRow = gridRow;
  }

  const gridRowStart = getResponsiveValue(styledProps.gridRowStart, breakpoint);
  if (gridRowStart !== undefined) {
    inlineStyles.gridRowStart = gridRowStart;
  }

  const gridRowEnd = getResponsiveValue(styledProps.gridRowEnd, breakpoint);
  if (gridRowEnd !== undefined) {
    inlineStyles.gridRowEnd = gridRowEnd;
  }

  const gridColumnStart = getResponsiveValue(styledProps.gridColumnStart, breakpoint);
  if (gridColumnStart !== undefined) {
    inlineStyles.gridColumnStart = gridColumnStart;
  }

  const gridColumnEnd = getResponsiveValue(styledProps.gridColumnEnd, breakpoint);
  if (gridColumnEnd !== undefined) {
    inlineStyles.gridColumnEnd = gridColumnEnd;
  }

  const gridArea = getResponsiveValue(styledProps.gridArea, breakpoint);
  if (gridArea !== undefined) {
    inlineStyles.gridArea = gridArea;
  }

  return { classes, inlineStyles };
};
