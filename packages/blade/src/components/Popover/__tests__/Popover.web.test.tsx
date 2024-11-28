/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { act, fireEvent } from '@testing-library/react';
import React from 'react';
import { Popover, PopoverInteractiveWrapper } from '..';
import { Button } from '~components/Button';
import { bladeTheme } from '~tokens/theme';
import { InfoIcon } from '~components/Icons';
import { MetaConstants } from '~utils/metaAttribute';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';

const waitForPosition = () => act(async () => {});
const animationDuration = bladeTheme.motion.duration.quick;
const popoverInteractiveWrapperId = 'popover-interactive-wrapper';

describe('<Popover />', () => {
  jest.useFakeTimers();

  it('should render', async () => {
    const buttonText = 'Click me';
    const popoverContent = <Text>Hello world</Text>;
    const { baseElement, getByRole, queryByRole, getByText } = renderWithTheme(
      <Popover content={popoverContent}>
        <Button>{buttonText}</Button>
      </Popover>,
    );

    // snapshot while on opened
    fireEvent.click(getByRole('button', { name: buttonText }));
    await act(async () => {
      jest.advanceTimersByTime(animationDuration);
    });

    expect(queryByRole('dialog')).toBeInTheDocument();
    expect(queryByRole('dialog')).toHaveStyle({ 'z-index': 1100 });
    expect(queryByRole('dialog')).toHaveAttribute('data-blade-component', MetaConstants.Popover);
    expect(getByText('Hello world')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with title,footer', () => {
    const buttonText = 'Click me';
    const popoverContent = <Text>Hello world</Text>;
    const { baseElement, getByRole, queryByRole } = renderWithTheme(
      <Popover content={popoverContent} title="This is title" footer={<Text>Footer</Text>}>
        <Button>{buttonText}</Button>
      </Popover>,
    );

    // snapshot while on opened
    fireEvent.click(getByRole('button', { name: buttonText }));
    expect(queryByRole('dialog')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('should render popover with custom zIndex', () => {
    const popoverContent = <Text>Hello world</Text>;
    const buttonText = 'Click me';
    const { baseElement, getByRole, queryByRole } = renderWithTheme(
      <Popover content={popoverContent} zIndex={9999}>
        <Button>{buttonText}</Button>
      </Popover>,
    );

    // snapshot while on opened
    fireEvent.click(getByRole('button', { name: buttonText }));
    expect(queryByRole('dialog')).toBeInTheDocument();
    expect(queryByRole('dialog')).toHaveStyle({ 'z-index': 9999 });
    expect(baseElement).toMatchSnapshot();
  });

  it('should open on clicking', async () => {
    const popoverContent = <Text>Hello world</Text>;
    const buttonText = 'Click me';
    const { getByRole, queryByRole } = renderWithTheme(
      <Popover content={popoverContent}>
        <Button>{buttonText}</Button>
      </Popover>,
    );
    await waitForPosition();

    // should not be opened by default
    expect(queryByRole('dialog')).not.toBeInTheDocument();

    // should open after 300ms
    fireEvent.click(getByRole('button', { name: buttonText }));
    expect(queryByRole('dialog')).toBeInTheDocument();

    // close after 300ms
    fireEvent.click(getByRole('button', { hidden: true, name: buttonText }));

    await act(async () => {
      jest.advanceTimersByTime(299 + animationDuration);
    });
    expect(queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should close clicking the close icon', async () => {
    const popoverContent = <Text>Hello world</Text>;
    const buttonText = 'Click me';
    const { getByRole, queryByRole } = renderWithTheme(
      <Popover content={popoverContent}>
        <Button>{buttonText}</Button>
      </Popover>,
    );
    await waitForPosition();

    // should not be opened by default
    expect(queryByRole('dialog')).not.toBeInTheDocument();

    // should open after 300ms
    fireEvent.click(getByRole('button', { name: buttonText }));
    expect(queryByRole('dialog')).toBeInTheDocument();

    // close after 300ms
    fireEvent.click(getByRole('button', { hidden: true, name: 'Close' }));

    await act(async () => {
      jest.advanceTimersByTime(299 + animationDuration);
    });
    expect(queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should not close when interacting with internal components', async () => {
    const buttonText = 'Click me';
    const internalButtonText = 'Internal Button Click me';
    const clickFn = jest.fn();
    const { getByRole, queryByRole } = renderWithTheme(
      <Popover
        content={
          <Box>
            <Button onClick={clickFn}>{internalButtonText}</Button>
          </Box>
        }
      >
        <Button>{buttonText}</Button>
      </Popover>,
    );
    await waitForPosition();

    // should not be opened by default
    expect(queryByRole('dialog')).not.toBeInTheDocument();

    // should open after 300ms
    fireEvent.click(getByRole('button', { name: buttonText }));
    expect(queryByRole('dialog')).toBeInTheDocument();

    // should not close after 300ms
    fireEvent.click(getByRole('button', { name: internalButtonText }));

    await act(async () => {
      jest.advanceTimersByTime(299 + animationDuration);
    });

    expect(clickFn).toHaveBeenCalledTimes(1);
    expect(queryByRole('dialog')).toBeInTheDocument();
  });

  it('should work with uncontrolled state', async () => {
    const popoverContent = <Text>Hello world</Text>;
    const buttonText = 'Click me';
    const onChange = jest.fn();
    const { getByRole, queryByRole } = renderWithTheme(
      <Popover
        defaultIsOpen
        onOpenChange={({ isOpen }) => onChange(isOpen)}
        content={popoverContent}
      >
        <Button>{buttonText}</Button>
      </Popover>,
    );
    await waitForPosition();

    // should be opened by default
    expect(queryByRole('dialog')).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledTimes(0);

    // close after 300ms
    fireEvent.click(getByRole('button', { hidden: true, name: 'Close' }));

    await act(async () => {
      jest.advanceTimersByTime(299 + animationDuration);
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(false);

    expect(queryByRole('dialog')).not.toBeInTheDocument();

    // open
    fireEvent.click(getByRole('button', { name: buttonText }));
    expect(queryByRole('dialog')).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('should work with controlled isOpen', async () => {
    const popoverContent = <Text>Hello world</Text>;
    const buttonText = 'Click me';
    const toggleButtonText = 'Toggle';

    const ControlledExample = () => {
      const [isOpen, setIsOpen] = React.useState(true);

      return (
        <>
          <Popover
            content={popoverContent}
            isOpen={isOpen}
            onOpenChange={({ isOpen }) => setIsOpen(isOpen)}
          >
            <Button onClick={() => setIsOpen(true)}>{buttonText}</Button>
          </Popover>
          <Button onClick={() => setIsOpen((prev) => !prev)}>{toggleButtonText}</Button>
        </>
      );
    };
    const { getByRole, queryByRole } = renderWithTheme(<ControlledExample />);
    await waitForPosition();

    // should be opened by default
    expect(queryByRole('dialog')).toBeInTheDocument();

    // should close after 300ms
    fireEvent.click(getByRole('button', { hidden: true, name: toggleButtonText }));

    await act(async () => {
      jest.advanceTimersByTime(299 + animationDuration);
    });
    expect(queryByRole('dialog')).not.toBeInTheDocument();

    // open again
    fireEvent.click(getByRole('button', { name: buttonText }));

    await act(async () => {
      jest.advanceTimersByTime(299);
    });

    expect(queryByRole('dialog')).toBeInTheDocument();

    // close again with close icon
    fireEvent.click(getByRole('button', { hidden: true, name: 'Close' }));

    await act(async () => {
      jest.advanceTimersByTime(299 + animationDuration);
    });
    expect(queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should have work with PopoverInteractiveWrapper', async () => {
    const popoverContent = <Text>Hello world</Text>;
    jest.useFakeTimers();
    const { getByTestId, queryByRole } = renderWithTheme(
      <Popover content={popoverContent}>
        <PopoverInteractiveWrapper testID={popoverInteractiveWrapperId}>
          <InfoIcon color="interactive.icon.gray.normal" size="medium" />
        </PopoverInteractiveWrapper>
      </Popover>,
    );
    const wrapper = getByTestId('popover-interactive-wrapper');
    expect(wrapper).toHaveAttribute(
      'data-blade-component',
      MetaConstants.PopoverInteractiveWrapper,
    );

    // should open after 300ms
    fireEvent.click(wrapper);
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    expect(queryByRole('dialog')).toHaveAttribute('data-blade-component', MetaConstants.Popover);

    fireEvent.click(wrapper);

    await act(async () => {
      jest.advanceTimersByTime(299 + animationDuration);
    });
    expect(queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should pass a11y', async () => {
    jest.useRealTimers();

    const popoverContent = <Text>Hello world</Text>;
    const title = 'Popover title';
    const buttonText = 'Click me';
    const { getByRole } = renderWithTheme(
      <Popover defaultIsOpen title={title} content={popoverContent}>
        <Button>{buttonText}</Button>
      </Popover>,
    );
    expect(getByRole('dialog')).toHaveAccessibleName(title);
    await assertAccessible(getByRole('dialog'));
  });

  describe('<Popover />', () => {
    it('should accept DataAnalyticsAttribute', async () => {
      const buttonText = 'Click me';
      const { getByRole } = renderWithTheme(
        <Popover content={<Text>Hello world</Text>} data-analytics-popover="demo">
          <Button>{buttonText}</Button>
        </Popover>,
      );

      fireEvent.click(getByRole('button', { name: buttonText }));

      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
      expect(getByRole('dialog')).toHaveAttribute('data-analytics-popover', 'demo');
    });
  });
});
