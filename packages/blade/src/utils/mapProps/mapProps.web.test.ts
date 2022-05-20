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
      'aria-labelledby': 'id1',
      'aria-label': 'hello world',
      role: 'button',
    });

    expect(mapProps({ accessibilityLiveRegion: 'polite' })).toStrictEqual({
      'aria-live': 'polite',
    });

    expect(
      mapProps({
        accessibilityChecked: 'true',
        accessibilitySelected: 'false',
        accessibilityDisabled: 'true',
        accessibilityExpanded: 'false',
        accessibilityBusy: 'false',
      }),
    ).toStrictEqual({
      'aria-checked': 'true',
      'aria-selected': 'false',
      'aria-disabled': 'true',
      'aria-expanded': 'false',
      'aria-busy': 'false',
    });

    expect(
      mapProps({
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
