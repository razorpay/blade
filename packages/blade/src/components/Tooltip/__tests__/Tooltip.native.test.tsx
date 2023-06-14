/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { act, fireEvent } from '@testing-library/react-native';
import React from 'react';
import { Tooltip, TooltipInteractiveWrapper } from '..';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';

const triggerId = 'tooltip-interactive-wrapper';
const modalBackdropId = 'tooltip-modal-backdrop';

describe('<Tooltip />', () => {
  jest.useFakeTimers();

  it('should render', () => {
    const tooltipContent = 'Hello world';
    const buttonText = 'Hover me';
    const { toJSON, getByRole, getByA11yLabel } = renderWithTheme(
      <Tooltip content={tooltipContent}>
        <Button>{buttonText}</Button>
      </Tooltip>,
    );

    expect(getByRole('button')).toBeTruthy();
    fireEvent(getByRole('button'), 'touchEnd');

    expect(getByA11yLabel(tooltipContent)).toHaveProp('visible', true);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should open on pressing trigger', () => {
    const triggerText = 'Press me';
    const tooltipContent = 'hello world';
    const { getByTestId, getByA11yLabel } = renderWithTheme(
      <Tooltip content={tooltipContent}>
        <TooltipInteractiveWrapper>
          <Text>{triggerText}</Text>
        </TooltipInteractiveWrapper>
      </Tooltip>,
    );

    expect(getByTestId(triggerId)).toBeTruthy();
    expect(getByA11yLabel(tooltipContent)).toHaveProp('visible', false);

    fireEvent(getByTestId(triggerId), 'touchEnd');

    expect(getByA11yLabel(tooltipContent)).toHaveProp('visible', true);
  });

  it('should close on pressing outside of trigger', async () => {
    const triggerText = 'Press me';
    const tooltipContent = 'hello world';
    const { getByTestId, getByA11yLabel } = renderWithTheme(
      <Tooltip content={tooltipContent}>
        <TooltipInteractiveWrapper>
          <Text>{triggerText}</Text>
        </TooltipInteractiveWrapper>
      </Tooltip>,
    );

    expect(getByTestId(triggerId)).toBeTruthy();
    fireEvent(getByTestId(triggerId), 'touchEnd');
    expect(getByA11yLabel(tooltipContent)).toHaveProp('visible', true);

    // close on clicking backdrop
    fireEvent.press(getByTestId(modalBackdropId));

    // wait for closing animation to finish
    await act(async () => {
      // theme.motion.duration.gentle
      jest.advanceTimersByTime(400);
    });
    expect(getByA11yLabel(tooltipContent)).toHaveProp('visible', false);
  });
});
