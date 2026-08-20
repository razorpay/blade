import { getTransitionProfile } from '../RazorSenseAuthoredTransition';

describe('RazorSense authored material transitions', () => {
  it('selects the calibrated spatial profile in both thinking and typing directions', () => {
    expect(getTransitionProfile('thinking', 'typing')).toBe('thinking-to-typing');
    expect(getTransitionProfile('typing', 'thinking')).toBe('typing-to-thinking');
    expect(getTransitionProfile('neutral', 'loading')).toBe('field-to-loader');
    expect(getTransitionProfile('loading', 'neutral')).toBe('loader-to-field');
    expect(getTransitionProfile('neutral', 'typing')).toBe('material-aperture');
  });
});
