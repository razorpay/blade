/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import { Tooltip } from '..';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';

const triggerId = 'tooltip-interactive-wrapper';
const modalBackdropId = 'tooltip-modal-backdrop';

describe('<Tooltip />', () => {
  jest.useFakeTimers();

  it('should render', () => {
    const buttonText = 'Hover me';
    const { toJSON, getByTestId } = renderWithTheme(
      <Tooltip content="Hello world">
        <Button>{buttonText}</Button>
      </Tooltip>,
    );
    expect(getByTestId(triggerId)).toBeTruthy();
    fireEvent.press(getByTestId(triggerId));

    expect(toJSON()).toMatchSnapshot();
  });

  it('should open on pressing trigger', () => {
    const triggerText = 'Press me';
    const tooltipContent = 'hello world';
    const { getByTestId, getByA11yLabel } = renderWithTheme(
      <Tooltip content={tooltipContent}>
        <Text>{triggerText}</Text>
      </Tooltip>,
    );

    expect(getByTestId(triggerId)).toBeTruthy();
    expect(getByA11yLabel(tooltipContent)).toHaveProp('visible', false);

    fireEvent.press(getByTestId(triggerId));
    expect(getByA11yLabel(tooltipContent)).toHaveProp('visible', true);
  });

  it('should close on pressing outside of trigger', () => {
    const triggerText = 'Press me';
    const tooltipContent = 'hello world';
    const { getByTestId, getByA11yLabel } = renderWithTheme(
      <Tooltip content={tooltipContent}>
        <Text>{triggerText}</Text>
      </Tooltip>,
    );

    expect(getByTestId(triggerId)).toBeTruthy();
    fireEvent.press(getByTestId(triggerId));
    expect(getByA11yLabel(tooltipContent)).toHaveProp('visible', true);

    // close on clicking backdrop
    fireEvent.press(getByTestId(modalBackdropId));
    expect(getByA11yLabel(tooltipContent)).toHaveProp('visible', false);
  });
});
