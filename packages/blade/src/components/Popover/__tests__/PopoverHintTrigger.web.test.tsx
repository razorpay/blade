/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { Popover, PopoverHintTrigger } from '..';
import { Text } from '~components/Typography';
import { MetaConstants } from '~utils/metaAttribute';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

const popoverContent = <Text>Breakdown details</Text>;

describe('<PopoverHintTrigger />', () => {
  it('should render with default neutral intent', () => {
    const { getByText, container } = renderWithTheme(
      <Popover openInteraction="hover" content={popoverContent}>
        <PopoverHintTrigger>45.2%</PopoverHintTrigger>
      </Popover>,
    );

    expect(getByText('45.2%')).toBeInTheDocument();
    const trigger = container.querySelector('[data-blade-component="popover-hint-trigger"]');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveStyle({ cursor: 'help' });
  });

  it('should render with negative intent', () => {
    const { getByText } = renderWithTheme(
      <Popover openInteraction="hover" content={popoverContent}>
        <PopoverHintTrigger intent="negative">12.1%</PopoverHintTrigger>
      </Popover>,
    );

    expect(getByText('12.1%')).toBeInTheDocument();
  });

  it('should render all intent variants without error', () => {
    const intents = ['positive', 'negative', 'notice', 'neutral', 'information'] as const;

    intents.forEach((intent) => {
      const { unmount } = renderWithTheme(
        <Popover openInteraction="hover" content={popoverContent}>
          <PopoverHintTrigger intent={intent}>value</PopoverHintTrigger>
        </Popover>,
      );
      unmount();
    });
  });
});
