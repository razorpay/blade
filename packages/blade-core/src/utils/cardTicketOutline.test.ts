import {
  buildTicketShellPath,
  CARD_TICKET_CORNER_RADIUS,
  CARD_TICKET_NOTCH_RADIUS,
  CARD_TICKET_OUTLINE_STROKE_WIDTH,
  CARD_TICKET_DISABLED_STROKE_DASHARRAY,
} from './cardTicketOutline';

describe('cardTicketOutline constants', () => {
  it('exports expected constant values', () => {
    expect(CARD_TICKET_CORNER_RADIUS).toBe(12);
    expect(CARD_TICKET_NOTCH_RADIUS).toBe(10);
    expect(CARD_TICKET_OUTLINE_STROKE_WIDTH).toBe(1);
    expect(CARD_TICKET_DISABLED_STROKE_DASHARRAY).toBe('6 4');
  });
});

describe('buildTicketShellPath', () => {
  it('returns empty string for zero width', () => {
    expect(buildTicketShellPath({ width: 0, height: 100, tearLineY: 50 })).toBe('');
  });

  it('returns empty string for zero height', () => {
    expect(buildTicketShellPath({ width: 100, height: 0, tearLineY: 50 })).toBe('');
  });

  it('returns empty string for negative width', () => {
    expect(buildTicketShellPath({ width: -10, height: 100, tearLineY: 50 })).toBe('');
  });

  it('returns empty string for negative height', () => {
    expect(buildTicketShellPath({ width: 100, height: -10, tearLineY: 50 })).toBe('');
  });

  it('produces a valid SVG path string starting with M (move) and ending with Z (close)', () => {
    const path = buildTicketShellPath({ width: 200, height: 100, tearLineY: 50 });
    expect(path.startsWith('M ')).toBe(true);
    expect(path.endsWith('Z')).toBe(true);
  });

  it('contains expected SVG path segments (arcs and lines)', () => {
    const path = buildTicketShellPath({ width: 200, height: 100, tearLineY: 50 });
    // Should contain arc commands (A), horizontal lines (H), vertical lines (V)
    expect(path).toMatch(/A \d+ \d+ 0 0 [01] \d+ \d+/);
    expect(path).toMatch(/H \d+/);
    expect(path).toMatch(/V \d+/);
  });

  it('clamps tearLineY to minimum (cornerRadius + notchRadius)', () => {
    const minTearY = CARD_TICKET_CORNER_RADIUS + CARD_TICKET_NOTCH_RADIUS; // 22
    // tearLineY of 0 should be clamped to minTearY
    const path = buildTicketShellPath({ width: 200, height: 100, tearLineY: 0 });
    // The path should contain the clamped tearY value in the V commands
    expect(path).toContain(`${minTearY - CARD_TICKET_NOTCH_RADIUS}`);
    expect(path).toContain(`${minTearY + CARD_TICKET_NOTCH_RADIUS}`);
  });

  it('clamps tearLineY to maximum (height - cornerRadius - notchRadius)', () => {
    const maxTearY = 100 - CARD_TICKET_CORNER_RADIUS - CARD_TICKET_NOTCH_RADIUS; // 78
    // tearLineY of 200 should be clamped to maxTearY
    const path = buildTicketShellPath({ width: 200, height: 100, tearLineY: 200 });
    expect(path).toContain(`${maxTearY - CARD_TICKET_NOTCH_RADIUS}`);
    expect(path).toContain(`${maxTearY + CARD_TICKET_NOTCH_RADIUS}`);
  });

  it('uses provided tearLineY when within valid range', () => {
    const path = buildTicketShellPath({ width: 200, height: 100, tearLineY: 50 });
    // tearY=50, notchRadius=10 → V 40 and V 60 should appear
    expect(path).toContain('V 40');
    expect(path).toContain('V 60');
  });

  it('produces a closed path with Z at the end', () => {
    const path = buildTicketShellPath({ width: 300, height: 150, tearLineY: 75 });
    expect(path).toMatch(/Z$/);
  });

  it('uses correct corner radius in arc commands', () => {
    const path = buildTicketShellPath({ width: 200, height: 100, tearLineY: 50 });
    // Corner radius arcs should use CARD_TICKET_CORNER_RADIUS (12)
    expect(path).toContain(`A ${CARD_TICKET_CORNER_RADIUS} ${CARD_TICKET_CORNER_RADIUS}`);
  });

  it('uses correct notch radius in arc commands', () => {
    const path = buildTicketShellPath({ width: 200, height: 100, tearLineY: 50 });
    // Notch radius arcs should use CARD_TICKET_NOTCH_RADIUS (10)
    expect(path).toContain(`A ${CARD_TICKET_NOTCH_RADIUS} ${CARD_TICKET_NOTCH_RADIUS}`);
  });
});
