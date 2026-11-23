import React from 'react';
import { act } from '@testing-library/react';
import { RazorSenseSuccess } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme';

// an engine made, on screen, that never draws a frame (a Direct3D copy of its shader still compiling: Intel UHD's light Success
// drew nothing for 8.8 s) and never says it failed: the stage neither draws nor gives up
jest.mock('../../RazorSenseEngine', () => ({
  ...jest.requireActual('../../RazorSenseEngine'),
  runFreshStage: jest.fn(() => () => undefined),
}));

describe('<RazorSenseSuccess />: an engine that never draws', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('pops the badge in alone 0.8 s after it mounts and says why, and onLoad is never called', () => {
    const onError = jest.fn();
    const onLoad = jest.fn();
    const { container } = renderWithTheme(
      <RazorSenseSuccess onError={onError} onLoad={onLoad} label="Paid" />,
    );
    act(() => {
      jest.advanceTimersByTime(790);
    });
    expect(onError).not.toHaveBeenCalled();
    act(() => {
      jest.advanceTimersByTime(20);
    });
    expect(onError).toHaveBeenCalledTimes(1);
    expect(String(onError.mock.calls[0][0])).toMatch(/no first frame/);
    // (the orb's box is gone: the badge alone)
    expect(container.querySelector('svg[viewBox="0 0 100 100"]')).toBeNull();
    expect(onLoad).not.toHaveBeenCalled();
  });
});
