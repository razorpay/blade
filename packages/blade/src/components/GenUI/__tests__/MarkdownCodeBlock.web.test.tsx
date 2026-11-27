import React from 'react';
import { act, fireEvent } from '@testing-library/react';
import { MarkdownCodeBlockRenderer } from '../MarkdownCodeBlock';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('MarkdownCodeBlockRenderer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: jest.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
  });
  afterEach(() => jest.useRealTimers());

  it('clears the copied state’s timer when it unmounts', () => {
    const { getByRole, unmount } = renderWithTheme(
      <MarkdownCodeBlockRenderer>
        <code className="language-bash">npm i</code>
      </MarkdownCodeBlockRenderer>,
    );
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    act(() => {
      fireEvent.click(getByRole('button', { name: 'Copy code block' }));
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('npm i');
    // the copy button's own timer: it puts the icon back after 2 s
    const resetCall = setTimeoutSpy.mock.calls.findIndex(([, delay]) => delay === 2000);
    expect(resetCall).toBeGreaterThanOrEqual(0);
    const resetTimer = setTimeoutSpy.mock.results[resetCall].value;
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalledWith(resetTimer);
  });
});
