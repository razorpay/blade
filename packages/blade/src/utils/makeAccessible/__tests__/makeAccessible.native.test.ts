import mapAccessibilityProps from '../makeAccessible';

describe('mapAccessibilityprops', () => {
  it('should return correct accessibility attributes for flat accessibility keys', () => {
    expect(
      mapAccessibilityProps({
        accessibilityLabel: 'hello world',
        accessibilityLabelledBy: 'id1',
        accessibilityRole: 'button',
      }),
    ).toStrictEqual({
      accessibilityLabel: 'hello world',
      accessibilityLabelledBy: 'id1',
      accessibilityRole: 'button',
    });
  });

  it('should return map correctly to native accessibility roles', () => {
    expect(
      mapAccessibilityProps({
        accessibilityRole: 'slider',
      }),
    ).toStrictEqual({
      accessibilityRole: 'adjustable',
    });

    // native specific roles
    expect(
      mapAccessibilityProps({
        accessibilityRole: 'text',
      }),
    ).toStrictEqual({
      accessibilityRole: 'text',
    });
  });

  it('should return correct accessibility attributes for live region', () => {
    expect(mapAccessibilityProps({ accessibilityLiveRegion: 'polite' })).toStrictEqual({
      accessibilityLiveRegion: 'polite',
    });
  });

  it('should ignore invalid roles in native', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(mapAccessibilityProps({ accessibilityRole: 'invalid' })).toStrictEqual({});
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
      accessibilityState: {
        checked: false,
        selected: false,
        disabled: false,
        expanded: false,
        busy: false,
      },
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
      accessibilityValue: {
        max: 10,
        min: 11,
        now: 2,
        text: 'text',
      },
    });
  });
});
