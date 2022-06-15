import mapAccessibilityProps from './mapProps';

describe('mapAccessibilityprops', () => {
  it('should return correct accessibility attributes for flat accessibility keys', () => {
    expect(
      mapAccessibilityProps({
        accessibilityLabel: 'hello world',
        accessibilityLabelledBy: 'id1',
        accessibilityRole: 'button',
      }),
    ).toStrictEqual({
      'aria-label': 'hello world',
      'aria-labelledby': 'id1',
      role: 'button',
    });
  });

  it('should return correct accessibility roles', () => {
    expect(
      mapAccessibilityProps({
        accessibilityRole: 'slider',
      }),
    ).toStrictEqual({
      role: 'slider',
    });
  });

  it('should return correct accessibility attributes for live region', () => {
    expect(mapAccessibilityProps({ accessibilityLiveRegion: 'polite' })).toStrictEqual({
      'aria-live': 'polite',
    });
  });

  it('should ignore invalid roles in native', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(mapAccessibilityProps({ accessibilityRole: 'invalid' })).toStrictEqual({
      role: 'invalid',
    });
  });

  it('should return correct attributes for accessibilityState', () => {
    expect(
      mapAccessibilityProps({
        accessibilityChecked: false,
        accessibilitySelected: false,
        accessibilityDisabled: false,
        accessibilityExpanded: false,
        accessibilityBusy: false,
      }),
    ).toStrictEqual({
      'aria-checked': false,
      'aria-selected': false,
      'aria-disabled': false,
      'aria-expanded': false,
      'aria-busy': false,
    });
  });

  it('should return correct attributes for accessibilityValue', () => {
    expect(
      mapAccessibilityProps({
        accessibilityValueMax: 10,
        accessibilityValueMin: 11,
        accessibilityValueNow: 2,
        accessibilityValueText: 'text',
      }),
    ).toStrictEqual({
      'aria-valuemax': 10,
      'aria-valuemin': 11,
      'aria-valuenow': 2,
      'aria-valuetext': 'text',
    });
  });
});
