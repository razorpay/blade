/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { act, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import type { BladeCommonEvents } from '..';
import { Tooltip, TooltipInteractiveWrapper } from '..';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import { Button } from '~components/Button';
import { paymentTheme } from '~tokens/theme';
import assertAccessible from '~src/_helpers/testing/assertAccessible.web';
import { InfoIcon } from '~components/Icons';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';

const waitForPosition = () => act(async () => {});
const animationDuration = paymentTheme.motion.duration.quick;

describe('<Tooltip />', () => {
  jest.useFakeTimers();

  it('should render', () => {
    const buttonText = 'Hover me';
    const { container, getByRole } = renderWithTheme(
      <Tooltip content="Hello world">
        <Button>{buttonText}</Button>
      </Tooltip>,
    );

    // snapshot while on opened
    fireEvent.focus(getByRole('button', { name: buttonText }));
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should open on hovering over', async () => {
    const buttonText = 'Hover me';
    const { getByRole } = renderWithTheme(
      <Tooltip content="Hello world">
        <Button>{buttonText}</Button>
      </Tooltip>,
    );
    await waitForPosition();

    fireEvent.mouseEnter(getByRole('button', { name: buttonText }));

    // should not be opened by default
    await act(async () => {
      jest.advanceTimersByTime(1);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    // should open after 300ms
    await act(async () => {
      jest.advanceTimersByTime(299);
    });
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    // close after 300ms
    fireEvent.mouseLeave(getByRole('button', { name: buttonText }));
    await act(async () => {
      jest.advanceTimersByTime(299 + animationDuration);
    });
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(1);
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('should open/close immediately on focus/blur without the default delay of 300ms', async () => {
    const buttonText = 'Hover me';
    const { getByRole } = renderWithTheme(
      <Tooltip content="Hello world">
        <Button>{buttonText}</Button>
      </Tooltip>,
    );
    await waitForPosition();

    fireEvent.focus(getByRole('button', { name: buttonText }));

    // on focus it should immediately open
    await act(async () => {
      jest.advanceTimersByTime(1);
    });
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    // close
    fireEvent.blur(getByRole('button', { name: buttonText }));
    await act(async () => {
      jest.advanceTimersByTime(animationDuration);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('should open/close on hovering over with non-interactive trigger element', async () => {
    const tooltipContent = 'Hello world';
    const { getByTestId } = renderWithTheme(
      <Tooltip content={tooltipContent}>
        <TooltipInteractiveWrapper>
          <InfoIcon color="surface.action.icon.default.highContrast" size="medium" />
        </TooltipInteractiveWrapper>
      </Tooltip>,
    );
    await waitForPosition();

    const wrapper = getByTestId('tooltip-interactive-wrapper');
    fireEvent.mouseEnter(wrapper);

    // should not be opened by default
    await act(async () => {
      jest.advanceTimersByTime(1);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    // should open after 300ms
    await act(async () => {
      jest.advanceTimersByTime(299);
    });
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    // close afrer 300ms
    fireEvent.mouseLeave(wrapper);
    await act(async () => {
      jest.advanceTimersByTime(299 + animationDuration);
    });
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(1);
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('should open/close on focus/blur with non-interactive trigger element', async () => {
    const { getByTestId } = renderWithTheme(
      <Tooltip content="Hello world">
        <TooltipInteractiveWrapper>
          <InfoIcon color="surface.action.icon.default.highContrast" size="medium" />
        </TooltipInteractiveWrapper>
      </Tooltip>,
    );
    await waitForPosition();

    const wrapper = getByTestId('tooltip-interactive-wrapper');
    fireEvent.focus(wrapper);

    // on focus it should immediately open
    await act(async () => {
      jest.advanceTimersByTime(1);
    });
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    // close
    fireEvent.blur(wrapper);
    await act(async () => {
      jest.advanceTimersByTime(animationDuration);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('should work with custom trigger element', async () => {
    const testId = 'custom-trigger';
    const CustomTrigger = React.forwardRef<
      HTMLDivElement,
      { children: React.ReactNode } & BladeCommonEvents
    >(
      (
        {
          children,
          onBlur,
          onFocus,
          onMouseLeave,
          onMouseMove,
          onPointerDown,
          onPointerEnter,
          onTouchEnd,
          onTouchStart,
        },
        ref,
      ) => {
        return (
          <Box
            ref={ref}
            tabIndex={0}
            onBlur={onBlur}
            onFocus={onFocus}
            onMouseLeave={onMouseLeave}
            onMouseMove={onMouseMove}
            onPointerDown={onPointerDown}
            onPointerEnter={onPointerEnter}
            onTouchEnd={onTouchEnd}
            onTouchStart={onTouchStart}
            testID={testId}
          >
            <Text contrast="low">{children}</Text>
          </Box>
        );
      },
    );

    const { getByTestId } = renderWithTheme(
      <Tooltip content="Hello world">
        <CustomTrigger>Custom Trigger</CustomTrigger>
      </Tooltip>,
    );
    await waitForPosition();

    fireEvent.mouseEnter(getByTestId(testId));

    // should not be opened by default
    await act(async () => {
      jest.advanceTimersByTime(1);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    // should open after 300ms
    await act(async () => {
      jest.advanceTimersByTime(299);
    });
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    // close
    fireEvent.blur(getByTestId(testId));
    await act(async () => {
      jest.advanceTimersByTime(animationDuration);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('should pass a11y', async () => {
    jest.useRealTimers();

    const tooltipContent = 'Hello world';
    const buttonText = 'Hover me';
    const { getByRole } = renderWithTheme(
      <Tooltip content={tooltipContent}>
        <Button>{buttonText}</Button>
      </Tooltip>,
    );
    fireEvent.focus(getByRole('button', { name: buttonText }));
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    expect(getByRole('button', { name: buttonText })).toHaveAccessibleDescription(tooltipContent);
    await assertAccessible(getByRole('tooltip'));
  });
});
