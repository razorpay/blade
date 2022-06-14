import mapProps from './mapProps';

describe('mapProps', () => {
  it('should work', () => {
    expect(
      mapProps({
        accessibilityLabel: 'hello world',
        accessibilityLabelledBy: 'id1',
        accessibilityRole: 'button',
      }),
    ).toStrictEqual({
      accessibilityLabel: 'hello world',
      accessibilityLabelledBy: 'id1',
      accessibilityRole: 'button',
    });

    expect(mapProps({ accessibilityLiveRegion: 'polite' })).toStrictEqual({
      accessibilityLiveRegion: 'polite',
    });

    expect(mapProps({ accessibilityRole: 'invalid' })).toStrictEqual({});

    expect(
      mapProps({
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

    expect(
      mapProps({
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

    expect(
      mapProps({
        accessibilityHidden: true,
      }),
    ).toStrictEqual({
      accessibilityElementsHidden: true,
      importantForAccessibility: 'no-hide-descendants',
    });
  });
});
