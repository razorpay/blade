import { makeAccessible } from '..';

describe('makeAccessible', () => {
  it('should return correct accessibility attributes for flat accessibility keys', () => {
    expect(
      makeAccessible({
        label: 'hello world',
        labelledBy: 'id1',
        role: 'button',
      }),
    ).toStrictEqual({
      'aria-label': 'hello world',
      'aria-labelledby': 'id1',
      role: 'button',
    });
  });

  it('should return correct accessibility roles', () => {
    expect(
      makeAccessible({
        role: 'slider',
      }),
    ).toStrictEqual({
      role: 'slider',
    });
  });

  it('should return correct accessibility attributes for live region', () => {
    expect(makeAccessible({ liveRegion: 'polite' })).toStrictEqual({
      'aria-live': 'polite',
    });
  });

  it('should ignore invalid roles in native', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(makeAccessible({ role: 'invalid' })).toStrictEqual({
      role: 'invalid',
    });
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
      'aria-checked': false,
      'aria-selected': false,
      'aria-disabled': false,
      'aria-expanded': false,
      'aria-busy': false,
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
      'aria-valuemax': 10,
      'aria-valuemin': 11,
      'aria-valuenow': 2,
      'aria-valuetext': 'text',
    });

    expect(
      makeAccessible({
        hidden: true,
      }),
    ).toStrictEqual({
      'aria-hidden': true,
    });
  });
});
