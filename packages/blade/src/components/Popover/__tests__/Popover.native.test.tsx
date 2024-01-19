/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { act, fireEvent } from '@testing-library/react-native';
import React from 'react';
import { Popover, PopoverInteractiveWrapper } from '..';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';
import { bladeTheme } from '~tokens/theme';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { InfoIcon } from '~components/Icons';

const triggerId = 'popover-interactive-wrapper';
const modalBackdropId = 'popover-modal-backdrop';
const popoverModalId = 'popover-modal';
const popoverInteractiveWrapperId = 'popover-interactive-wrapper';

describe('<Popover />', () => {
  jest.useFakeTimers();

  it('should render', async () => {
    const popoverContent = 'Hello world';
    const buttonText = 'Click me';
    const { toJSON, getByRole, getByTestId } = renderWithTheme(
      <Popover content={<Text>{popoverContent}</Text>}>
        <Button>{buttonText}</Button>
      </Popover>,
    );
    expect(getByTestId(popoverModalId)).toHaveProp('visible', false);

    expect(getByRole('button', { name: buttonText })).toBeTruthy();
    fireEvent(getByRole('button', { name: buttonText }), 'touchEnd');

    await act(async () => {
      jest.advanceTimersByTime(bladeTheme.motion.duration.quick);
    });
    expect(getByTestId(popoverModalId)).toHaveProp('visible', true);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with title,footer', async () => {
    const popoverContent = 'Hello world';
    const buttonText = 'Click me';
    const { toJSON, getByRole } = renderWithTheme(
      <Popover
        title="This is title"
        titleLeading={<InfoIcon color="surface.icon.gray.disabled" size="small" />}
        content={<Text>{popoverContent}</Text>}
        footer={<Text>Footer</Text>}
      >
        <Button>{buttonText}</Button>
      </Popover>,
    );
    fireEvent(getByRole('button', { name: buttonText }), 'touchEnd');

    await act(async () => {
      jest.advanceTimersByTime(bladeTheme.motion.duration.quick);
    });
    expect(toJSON()).toMatchSnapshot();
  });

  it('should work with PopoverInteractiveWrapper', () => {
    const triggerText = 'Press me';
    const popoverContent = 'hello world';
    const { getByTestId } = renderWithTheme(
      <Popover content={<Text>{popoverContent}</Text>}>
        <PopoverInteractiveWrapper testID={popoverInteractiveWrapperId}>
          <Text>{triggerText}</Text>
        </PopoverInteractiveWrapper>
      </Popover>,
    );

    expect(getByTestId(triggerId)).toBeTruthy();
    expect(getByTestId(popoverModalId)).toHaveProp('visible', false);

    fireEvent(getByTestId(triggerId), 'touchEnd');

    expect(getByTestId(popoverModalId)).toHaveProp('visible', true);
  });

  it('should close clicking the close icon', async () => {
    const buttonText = 'Click me';
    const popoverContent = 'hello world';
    const { getByRole, getByTestId } = renderWithTheme(
      <Popover content={<Text>{popoverContent}</Text>}>
        <Button>{buttonText}</Button>
      </Popover>,
    );
    expect(getByTestId(popoverModalId)).toHaveProp('visible', false);

    fireEvent(getByRole('button', { name: buttonText }), 'touchEnd');

    expect(getByTestId(popoverModalId)).toHaveProp('visible', true);

    // close on clicking close icon
    fireEvent.press(getByRole('button', { name: 'Close' }));

    // wait for closing animation to finish
    await act(async () => {
      jest.advanceTimersByTime(bladeTheme.motion.duration.gentle);
    });
    expect(getByTestId(popoverModalId)).toHaveProp('visible', false);
  });

  it('should close on pressing outside of trigger', async () => {
    const buttonText = 'Press me';
    const popoverContent = 'hello world';
    const { getByRole, getByTestId } = renderWithTheme(
      <Popover content={<Text>{popoverContent}</Text>}>
        <Button>{buttonText}</Button>
      </Popover>,
    );
    expect(getByTestId(popoverModalId)).toHaveProp('visible', false);

    fireEvent(getByRole('button', { name: buttonText }), 'touchEnd');

    expect(getByTestId(popoverModalId)).toHaveProp('visible', true);

    // close on clicking backdrop
    fireEvent.press(getByTestId(modalBackdropId));

    // wait for closing animation to finish
    await act(async () => {
      jest.advanceTimersByTime(bladeTheme.motion.duration.gentle);
    });
    expect(getByTestId(popoverModalId)).toHaveProp('visible', false);
  });

  it('should not close when interacting with internal components', async () => {
    const buttonText = 'Click me';
    const internalButtonText = 'Internal Button Click me';
    const clickFn = jest.fn();
    const { getByRole, getByTestId } = renderWithTheme(
      <Popover content={<Button onClick={clickFn}>{internalButtonText}</Button>}>
        <Button>{buttonText}</Button>
      </Popover>,
    );

    fireEvent(getByRole('button', { name: buttonText }), 'touchEnd');

    expect(getByTestId(popoverModalId)).toHaveProp('visible', true);

    // should not close when interacting with internal components
    fireEvent.press(getByRole('button', { name: internalButtonText }));

    expect(clickFn).toHaveBeenCalledTimes(1);
    expect(getByTestId(popoverModalId)).toHaveProp('visible', true);
  });

  it('should work with uncontrolled state', async () => {
    const buttonText = 'Click me';
    const popoverContent = 'hello world';
    const { getByRole, getByTestId } = renderWithTheme(
      <Popover content={<Text>{popoverContent}</Text>} defaultIsOpen>
        <Button>{buttonText}</Button>
      </Popover>,
    );
    expect(getByTestId(popoverModalId)).toHaveProp('visible', true);

    fireEvent(getByRole('button', { name: buttonText }), 'touchEnd');

    fireEvent.press(getByRole('button', { name: 'Close' }));

    // wait for closing animation to finish
    await act(async () => {
      jest.advanceTimersByTime(bladeTheme.motion.duration.gentle);
    });

    expect(getByTestId(popoverModalId)).toHaveProp('visible', false);
  });

  it('should work with controlled isOpen', async () => {
    const buttonText = 'Click me';
    const toggleButtonText = 'Toggle';

    const ControlledExample = () => {
      const [isOpen, setIsOpen] = React.useState(true);

      return (
        <>
          <Popover
            content={<Text>Hello world</Text>}
            isOpen={isOpen}
            onOpenChange={({ isOpen }) => setIsOpen(isOpen)}
          >
            <Button onClick={() => setIsOpen(true)}>{buttonText}</Button>
          </Popover>
          <Button onClick={() => setIsOpen((prev) => !prev)}>{toggleButtonText}</Button>
        </>
      );
    };
    const { getByTestId, getByRole } = renderWithTheme(<ControlledExample />);

    // should be opened by default
    expect(getByTestId(popoverModalId)).toHaveProp('visible', true);

    // close
    fireEvent.press(getByRole('button', { name: toggleButtonText }));

    // wait for closing animation to finish
    await act(async () => {
      jest.advanceTimersByTime(bladeTheme.motion.duration.gentle);
    });

    expect(getByTestId(popoverModalId)).toHaveProp('visible', false);

    // open again
    fireEvent.press(getByRole('button', { name: toggleButtonText }));

    expect(getByTestId(popoverModalId)).toHaveProp('visible', true);

    // close again with close icon
    fireEvent.press(getByRole('button', { name: 'Close' }));

    // wait for closing animation to finish
    await act(async () => {
      jest.advanceTimersByTime(bladeTheme.motion.duration.gentle);
    });

    expect(getByTestId(popoverModalId)).toHaveProp('visible', false);
  });

  it('should render popover with custom zIndex', () => {
    const buttonText = 'Click me';
    const { toJSON, getByRole } = renderWithTheme(
      <Popover content={<Text>Hello world</Text>} zIndex={9999}>
        <Button>{buttonText}</Button>
      </Popover>,
    );

    fireEvent(getByRole('button'), 'touchEnd');
    expect(toJSON()).toMatchSnapshot();
  });
});
