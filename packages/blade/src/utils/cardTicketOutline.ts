/**
 * Keep in sync with packages/blade-core/src/utils/cardTicketOutline.ts
 * (blade does not depend on blade-core yet).
 * TODO: import from @razorpay/blade-core
 */
/** Corner radius — matches `--border-radius-medium`. */
export const CARD_TICKET_CORNER_RADIUS = 12;

/** Radius of the semicircular notch at the tear line on each edge. */
export const CARD_TICKET_NOTCH_RADIUS = 10;

/** Outline stroke width in px — matches `--border-width-thin`. */
export const CARD_TICKET_OUTLINE_STROKE_WIDTH = 1;

export type TicketOutlineDimensions = {
  width: number;
  height: number;
  tearLineY: number;
};

type TicketGeometry = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  tearY: number;
};

/**
 * Closed ticket shell with inward side notches and rounded corners. Shared by the SVG stroke
 * and the content clip path so borders and transparent notch bites stay aligned.
 */
export function buildTicketShellPath({
  width,
  height,
  tearLineY,
}: TicketOutlineDimensions): string {
  if (width <= 0 || height <= 0) {
    return '';
  }

  return buildInwardNotchBoundary(getTicketGeometry(width, height, tearLineY));
}

/** @deprecated Use {@link buildTicketShellPath}. */
export function buildTicketClipPath(dimensions: TicketOutlineDimensions): string {
  return buildTicketShellPath(dimensions);
}

/** @deprecated Use {@link buildTicketShellPath}. */
export function buildTicketOuterPath(dimensions: TicketOutlineDimensions): string {
  return buildTicketShellPath(dimensions);
}

function getTicketGeometry(width: number, height: number, tearLineY: number): TicketGeometry {
  const cornerRadius = CARD_TICKET_CORNER_RADIUS;
  const notchRadius = CARD_TICKET_NOTCH_RADIUS;

  const tearY = clamp(tearLineY, cornerRadius + notchRadius, height - cornerRadius - notchRadius);

  return {
    minX: 0,
    maxX: width,
    minY: 0,
    maxY: height,
    tearY,
  };
}

function buildInwardNotchBoundary({ minX, maxX, minY, maxY, tearY }: TicketGeometry): string {
  const cornerRadius = CARD_TICKET_CORNER_RADIUS;
  const notchRadius = CARD_TICKET_NOTCH_RADIUS;

  return [
    `M ${minX + cornerRadius} ${minY}`,
    `H ${maxX - cornerRadius}`,
    `A ${cornerRadius} ${cornerRadius} 0 0 1 ${maxX} ${minY + cornerRadius}`,
    `V ${tearY - notchRadius}`,
    // Inward notch on the right edge (arc bulges left).
    `A ${notchRadius} ${notchRadius} 0 0 0 ${maxX} ${tearY + notchRadius}`,
    `V ${maxY - cornerRadius}`,
    `A ${cornerRadius} ${cornerRadius} 0 0 1 ${maxX - cornerRadius} ${maxY}`,
    `H ${minX + cornerRadius}`,
    `A ${cornerRadius} ${cornerRadius} 0 0 1 ${minX} ${maxY - cornerRadius}`,
    `V ${tearY + notchRadius}`,
    // Inward notch on the left edge (arc bulges right).
    `A ${notchRadius} ${notchRadius} 0 0 0 ${minX} ${tearY - notchRadius}`,
    `V ${minY + cornerRadius}`,
    `A ${cornerRadius} ${cornerRadius} 0 0 1 ${minX + cornerRadius} ${minY}`,
    'Z',
  ].join(' ');
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
