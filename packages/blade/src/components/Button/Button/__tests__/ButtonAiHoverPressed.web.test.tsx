import React from 'react';
import Button from '../Button';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

// RazorSense live on the button (its canvas drawn over it): jsdom has no WebGL, so the layer just says it's live
jest.mock('~components/Spark/ButtonRazorSense', () => {
  const { useEffect } = jest.requireActual('react');
  return {
    ButtonRazorSense: ({ onLiveChange }: { onLiveChange: (isLive: boolean) => void }) => {
      useEffect(() => onLiveChange(true), [onLiveChange]);
      return null;
    },
  };
});

describe('<Button aiHover="razorsense" />', () => {
  it('keeps its resting surface when pressed while RazorSense is live', () => {
    const { getByRole } = renderWithTheme(
      <Button color="neutral" aiHover="razorsense">
        Ask Ray
      </Button>,
    );
    const button = getByRole('button');
    // the background styled-components wrote for this button (in that state)
    const background = (state = ''): string | undefined => {
      const css = Array.from(document.querySelectorAll('style'))
        .map((style) => style.textContent ?? '')
        .join('');
      return Array.from(button.classList)
        .map((name) => new RegExp(`\\.${name}${state}\\{[^}]*?background-color:([^;}]+)`).exec(css))
        .find(Boolean)?.[1];
    };
    const resting = background();
    expect(resting).toBeDefined();
    expect(background(':hover')).toBe(resting);
    expect(background(':active')).toBe(resting);
  });
});
