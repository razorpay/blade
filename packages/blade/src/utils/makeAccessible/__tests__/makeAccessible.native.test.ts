import { makeAccessible } from '../makeAccessible';

describe('makeAccessible', () => {
  it('should return correct accessibility attributes for flat accessibility keys', () => {
    expect(
      makeAccessible({
        label: 'hello world',
        labelledBy: 'id1',
        role: 'button',
      }),
    ).toStrictEqual({
      accessibilityLabel: 'hello world',
      accessibilityLabelledBy: 'id1',
      accessibilityRole: 'button',
    });
  });

  it('should return map correctly to native accessibility roles', () => {
    expect(
      makeAccessible({
        role: 'slider',
      }),
    ).toStrictEqual({
      accessibilityRole: 'adjustable',
    });

    // native specific roles
    expect(
      makeAccessible({
        role: 'text',
      }),
    ).toStrictEqual({
      accessibilityRole: 'text',
    });

    expect(
      makeAccessible({
        role: 'feed',
      }),
    ).toStrictEqual({});
  });

  it('should return correct accessibility attributes for live region', () => {
    expect(makeAccessible({ liveRegion: 'polite' })).toStrictEqual({
      accessibilityLiveRegion: 'polite',
    });
  });

  it('should ignore invalid roles in native', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(makeAccessible({ role: 'invalid' })).toStrictEqual({});
  });

  it('should return correct attributes for accessibilityState', () => {
    expect(
      makeAccessible({
        checked: false,
        selected: false,
        disabled: false,
        expanded: false,
        busy: false,
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
      makeAccessible({
        valueMax: 10,
        valueMin: 11,
        valueNow: 2,
        valueText: 'text',
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
      makeAccessible({
        hidden: true,
      }),
    ).toStrictEqual({
      accessibilityElementsHidden: true,
      importantForAccessibility: 'no-hide-descendants',
    });
  });
});
