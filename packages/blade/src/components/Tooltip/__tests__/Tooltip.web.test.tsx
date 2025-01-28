/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { act, fireEvent } from '@testing-library/react';
import React from 'react';
import { Tooltip, TooltipInteractiveWrapper } from '..';
import type { BladeCommonEvents } from '~components/types';
import { Button } from '~components/Button';
import { bladeTheme } from '~tokens/theme';
import { InfoIcon } from '~components/Icons';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import { MetaConstants } from '~utils/metaAttribute';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

const waitForPosition = () => act(async () => {});
const animationDuration = bladeTheme.motion.duration.quick;

describe('<Tooltip />', () => {
  jest.useFakeTimers();

  it('should render', () => {
    const buttonText = 'Hover me';
    const { baseElement, getByRole, queryByRole } = renderWithTheme(
      <Tooltip content="Hello world">
        <Button>{buttonText}</Button>
      </Tooltip>,
    );

    // snapshot while on opened
    fireEvent.focus(getByRole('button', { name: buttonText }));
    expect(queryByRole('tooltip')).toBeInTheDocument();
    expect(queryByRole('tooltip')).toHaveStyle({ 'z-index': 1100 });
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with title', () => {
    const buttonText = 'Hover me';
    const { baseElement, getByRole, queryByRole } = renderWithTheme(
      <Tooltip title="Tooltip title" content="Hello world">
        <Button>{buttonText}</Button>
      </Tooltip>,
    );

    // snapshot while on opened
    fireEvent.focus(getByRole('button', { name: buttonText }));
    expect(queryByRole('tooltip')).toBeInTheDocument();
    expect(queryByRole('tooltip')).toHaveStyle({ 'z-index': 1100 });
    expect(baseElement).toMatchSnapshot();
  });

  it('should render tooltip with custom zIndex', () => {
    const buttonText = 'Hover me';
    const { baseElement, getByRole, queryByRole } = renderWithTheme(
      <Tooltip content="Hello world" zIndex={9999}>
        <Button>{buttonText}</Button>
      </Tooltip>,
    );

    // snapshot while on opened
    fireEvent.focus(getByRole('button', { name: buttonText }));
    expect(queryByRole('tooltip')).toBeInTheDocument();
    expect(queryByRole('tooltip')).toHaveStyle({ 'z-index': 9999 });
    expect(baseElement).toMatchSnapshot();
  });

  it('should open on hovering over', async () => {
    const buttonText = 'Hover me';
    const { getByRole, queryByRole } = renderWithTheme(
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
    expect(queryByRole('tooltip')).not.toBeInTheDocument();

    // should open after 300ms
    await act(async () => {
      jest.advanceTimersByTime(299);
    });
    expect(queryByRole('tooltip')).toBeInTheDocument();

    // close after 300ms
    fireEvent.mouseLeave(getByRole('button', { name: buttonText }));
    await act(async () => {
      jest.advanceTimersByTime(299 + animationDuration);
    });
    expect(queryByRole('tooltip')).toBeInTheDocument();

    await act(async () => {
      jest.runAllTimers();
    });

    expect(queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('should open/close immediately on focus/blur without the default delay of 300ms', async () => {
    const buttonText = 'Hover me';
    const { getByRole, queryByRole } = renderWithTheme(
      <Tooltip content="Hello world">
        <Button>{buttonText}</Button>
      </Tooltip>,
    );
    await waitForPosition();

    getByRole('button', { name: buttonText }).focus();

    // on focus it should immediately open
    await act(async () => {
      jest.advanceTimersByTime(1);
    });
    expect(queryByRole('tooltip')).toBeInTheDocument();

    // close
    getByRole('button', { name: buttonText }).blur();
    await act(async () => {
      jest.advanceTimersByTime(animationDuration);
    });
    await act(async () => {
      jest.runAllTimers();
    });
    expect(queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('should open/close on hovering over with non-interactive trigger element', async () => {
    const tooltipContent = 'Hello world';
    const { getByTestId, queryByRole } = renderWithTheme(
      <Tooltip content={tooltipContent}>
        <TooltipInteractiveWrapper>
          <InfoIcon color="interactive.icon.gray.normal" size="medium" />
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
    expect(queryByRole('tooltip')).not.toBeInTheDocument();

    // should open after 300ms
    await act(async () => {
      jest.advanceTimersByTime(299);
    });
    expect(queryByRole('tooltip')).toBeInTheDocument();

    // close afrer 300ms
    fireEvent.mouseLeave(wrapper);
    await act(async () => {
      jest.advanceTimersByTime(299 + animationDuration);
    });
    expect(queryByRole('tooltip')).toBeInTheDocument();

    await act(async () => {
      jest.runAllTimers();
    });

    expect(queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('should open/close on focus/blur with non-interactive trigger element', async () => {
    const { getByTestId, queryByRole } = renderWithTheme(
      <Tooltip content="Hello world">
        <TooltipInteractiveWrapper>
          <InfoIcon color="interactive.icon.gray.normal" size="medium" />
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
    expect(queryByRole('tooltip')).toBeInTheDocument();

    // close
    fireEvent.blur(wrapper);
    await act(async () => {
      jest.advanceTimersByTime(animationDuration);
    });
    await act(async () => {
      jest.runAllTimers();
    });
    expect(queryByRole('tooltip')).not.toBeInTheDocument();
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
          <BaseBox
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
            data-testid={testId}
          >
            <Text>{children}</Text>
          </BaseBox>
        );
      },
    );

    const { getByTestId, queryByRole } = renderWithTheme(
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
    expect(queryByRole('tooltip')).not.toBeInTheDocument();

    // should open after 300ms
    await act(async () => {
      jest.advanceTimersByTime(299);
    });
    expect(queryByRole('tooltip')).toBeInTheDocument();

    // close
    fireEvent.blur(getByTestId(testId));
    await act(async () => {
      jest.advanceTimersByTime(animationDuration);
    });
    await act(async () => {
      jest.runAllTimers();
    });
    expect(queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('should pass a11y', async () => {
    jest.useRealTimers();

    const tooltipContent = 'Hello world';
    const buttonText = 'Hover me';
    const { getByRole, queryByRole } = renderWithTheme(
      <Tooltip content={tooltipContent}>
        <Button>{buttonText}</Button>
      </Tooltip>,
    );
    fireEvent.focus(getByRole('button', { name: buttonText }));
    expect(queryByRole('tooltip')).toBeInTheDocument();
    expect(getByRole('button', { name: buttonText })).toHaveAccessibleDescription(tooltipContent);
    await assertAccessible(getByRole('tooltip'));
  });

  it('should have proper meta attributes', async () => {
    jest.useFakeTimers();
    const tooltipContent = 'Hello world';
    const { getByTestId, queryByRole } = renderWithTheme(
      <Tooltip content={tooltipContent}>
        <TooltipInteractiveWrapper>
          <InfoIcon color="interactive.icon.gray.normal" size="medium" />
        </TooltipInteractiveWrapper>
      </Tooltip>,
    );
    const wrapper = getByTestId('tooltip-interactive-wrapper');
    expect(wrapper).toHaveAttribute(
      'data-blade-component',
      MetaConstants.TooltipInteractiveWrapper,
    );
    fireEvent.mouseEnter(wrapper);
    // should open after 300ms
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    expect(queryByRole('tooltip')).toHaveAttribute('data-blade-component', MetaConstants.Tooltip);
  });

  // https://github.com/razorpay/blade/issues/1386
  it("should not override trigger's aria-label attribute", () => {
    const tooltipContent = 'Hello world';
    const { container, getByLabelText } = renderWithTheme(
      <Tooltip content={tooltipContent}>
        <input aria-label="Email Address" type="email" placeholder="Enter email" />
      </Tooltip>,
    );

    expect(getByLabelText('Email Address')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('it should support passing data analytics attributes', async () => {
    jest.useRealTimers();
    const tooltipContent = 'Hello world';
    const buttonText = 'Hover me';
    const { getByRole, queryByRole } = renderWithTheme(
      <Tooltip content={tooltipContent} data-analytics-tooltip="tooltip">
        <Button>{buttonText}</Button>
      </Tooltip>,
    );
    fireEvent.focus(getByRole('button', { name: buttonText }));
    expect(queryByRole('tooltip')).toBeInTheDocument();
    expect(queryByRole('tooltip')).toHaveAttribute('data-analytics-tooltip', 'tooltip');
  });
});
