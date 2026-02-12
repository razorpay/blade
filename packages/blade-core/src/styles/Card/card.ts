// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './card.module.css';

// --- Spacing map utility ---
const spacingToPaddingMap: Record<string, string> = {
  'spacing.0': styles.paddingSpacing0,
  'spacing.3': styles.paddingSpacing3,
  'spacing.4': styles.paddingSpacing4,
  'spacing.5': styles.paddingSpacing5,
  'spacing.7': styles.paddingSpacing7,
};

const spacingToHeaderPaddingMap: Record<string, string> = {
  'spacing.0': styles.headerPaddingSpacing0,
  'spacing.3': styles.headerPaddingSpacing3,
  'spacing.4': styles.headerPaddingSpacing4,
  'spacing.5': styles.headerPaddingSpacing5,
  'spacing.7': styles.headerPaddingSpacing7,
};

const spacingToHeaderMarginMap: Record<string, string> = {
  'spacing.0': styles.headerMarginSpacing0,
  'spacing.3': styles.headerMarginSpacing3,
  'spacing.4': styles.headerMarginSpacing4,
  'spacing.5': styles.headerMarginSpacing5,
  'spacing.7': styles.headerMarginSpacing7,
};

const spacingToFooterPaddingMap: Record<string, string> = {
  'spacing.0': styles.footerPaddingSpacing0,
  'spacing.3': styles.footerPaddingSpacing3,
  'spacing.4': styles.footerPaddingSpacing4,
  'spacing.5': styles.footerPaddingSpacing5,
  'spacing.7': styles.footerPaddingSpacing7,
};

const spacingToFooterMarginMap: Record<string, string> = {
  'spacing.0': styles.footerMarginSpacing0,
  'spacing.3': styles.footerMarginSpacing3,
  'spacing.4': styles.footerMarginSpacing4,
  'spacing.5': styles.footerMarginSpacing5,
  'spacing.7': styles.footerMarginSpacing7,
};

const elevationMap: Record<string, string> = {
  none: styles.elevationNone,
  lowRaised: styles.elevationLowRaised,
  midRaised: styles.elevationMidRaised,
  highRaised: styles.elevationHighRaised,
};

const backgroundColorMap: Record<string, string> = {
  'surface.background.gray.subtle': styles.bgGraySubtle,
  'surface.background.gray.moderate': styles.bgGrayModerate,
  'surface.background.gray.intense': styles.bgGrayIntense,
};

const borderRadiusMap: Record<string, string> = {
  medium: styles.borderRadiusMedium,
  large: styles.borderRadiusLarge,
  xlarge: styles.borderRadiusXlarge,
};

// --- Class getters ---

export type CardRootClassesProps = {
  borderRadius?: string;
  shouldScaleOnHover?: boolean;
  isPressed?: boolean;
  asLabel?: boolean;
};

export function getCardRootClasses(props: CardRootClassesProps): string {
  const classes = [styles.cardRoot];

  if (props.borderRadius) {
    classes.push(borderRadiusMap[props.borderRadius] || '');
  }

  if (props.asLabel) {
    classes.push(styles.cardRootLabel);
  }

  if (props.shouldScaleOnHover) {
    classes.push(styles.shouldScaleOnHover);
  }

  if (props.isPressed) {
    classes.push(styles.cardRootPressed);
  }

  return classes.filter(Boolean).join(' ');
}

export type CardSurfaceClassesProps = {
  elevation?: string;
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
};

export function getCardSurfaceClasses(props: CardSurfaceClassesProps): string {
  const classes = [styles.cardSurface];

  if (props.elevation) {
    classes.push(elevationMap[props.elevation] || '');
  }

  if (props.backgroundColor) {
    classes.push(backgroundColorMap[props.backgroundColor] || '');
  }

  if (props.padding) {
    classes.push(spacingToPaddingMap[props.padding] || '');
  }

  if (props.borderRadius) {
    classes.push(borderRadiusMap[props.borderRadius] || '');
  }

  return classes.filter(Boolean).join(' ');
}

export type CardHeaderClassesProps = {
  paddingBottom?: string;
  marginBottom?: string;
};

export function getCardHeaderClasses(props: CardHeaderClassesProps): {
  wrapper: string;
  content: string;
} {
  const wrapperClasses = [styles.cardHeader];
  if (props.marginBottom) {
    wrapperClasses.push(spacingToHeaderMarginMap[props.marginBottom] || '');
  }

  const contentClasses = [styles.cardHeaderContent];
  if (props.paddingBottom) {
    contentClasses.push(spacingToHeaderPaddingMap[props.paddingBottom] || '');
  }

  return {
    wrapper: wrapperClasses.filter(Boolean).join(' '),
    content: contentClasses.filter(Boolean).join(' '),
  };
}

export type CardFooterClassesProps = {
  paddingTop?: string;
  marginTop?: string;
  justifyEnd?: boolean;
};

export function getCardFooterClasses(props: CardFooterClassesProps): {
  wrapper: string;
  content: string;
} {
  const wrapperClasses = [styles.cardFooter];
  if (props.marginTop) {
    wrapperClasses.push(spacingToFooterMarginMap[props.marginTop] || '');
  }

  const contentClasses = [styles.cardFooterContent];
  if (props.paddingTop) {
    contentClasses.push(spacingToFooterPaddingMap[props.paddingTop] || '');
  }
  if (props.justifyEnd) {
    contentClasses.push(styles.cardFooterContentEnd);
  }

  return {
    wrapper: wrapperClasses.filter(Boolean).join(' '),
    content: contentClasses.filter(Boolean).join(' '),
  };
}

/**
 * Get template classes to prevent Svelte tree-shaking.
 * Call this function in component script blocks.
 */
export function getCardTemplateClasses() {
  return {
    cardRoot: styles.cardRoot,
    cardSurface: styles.cardSurface,
    linkOverlay: styles.linkOverlay,
    cardHeaderLeading: styles.cardHeaderLeading,
    cardHeaderLeadingRow: styles.cardHeaderLeadingRow,
    cardHeaderLeadingPrefix: styles.cardHeaderLeadingPrefix,
    cardHeaderLeadingTitleWrap: styles.cardHeaderLeadingTitleWrap,
    cardHeaderLeadingTitleRow: styles.cardHeaderLeadingTitleRow,
    cardHeaderLeadingSuffix: styles.cardHeaderLeadingSuffix,
    cardHeaderTrailing: styles.cardHeaderTrailing,
    cardBody: styles.cardBody,
    cardFooterLeading: styles.cardFooterLeading,
    cardFooterTrailing: styles.cardFooterTrailing,
    cardFooterActionWrapper: styles.cardFooterActionWrapper,
    cardFooterActionSpacer: styles.cardFooterActionSpacer,
    cardHeaderIconButtonWrapper: styles.cardHeaderIconButtonWrapper,
  };
}
