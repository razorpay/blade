/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { act, fireEvent } from '@testing-library/react-native';
import React from 'react';
import { Dimensions, View } from 'react-native';
import { SpotlightPopoverTour } from '../Tour';
import { SpotlightPopoverTourStep } from '../TourStep';
import type { SpotlightPopoverStepRenderProps, SpotlightPopoverTourSteps } from '../types';
import { SpotlightPopoverTourFooter } from '../TourFooter';
import {
  isRectVisibleInWindow,
  measureStepRect,
  scrollStepIntoView,
  useTourScrollLock,
} from '../tourNativeUtils';
import { Button } from '~components/Button';
import { bladeTheme } from '~tokens/theme';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';

const animationDuration = bladeTheme.motion.duration.gentle;
const nextButtonText = 'Next';
const prevButtonText = 'Prev';
const doneButtonText = 'Done';
const onStepChangeFn = jest.fn();
const onOpenChangeFn = jest.fn();
const onFinishFn = jest.fn();

beforeEach(() => {
  onStepChangeFn.mockReset();
  onOpenChangeFn.mockReset();
  onFinishFn.mockReset();
});

const CustomFooter = ({
  activeStep,
  totalSteps,
  goToNext,
  goToPrevious,
  stopTour,
}: SpotlightPopoverStepRenderProps) => {
  const isLast = activeStep === totalSteps - 1;
  const isFirst = activeStep === 0;
  return (
    <SpotlightPopoverTourFooter
      activeStep={activeStep}
      totalSteps={totalSteps}
      actions={{
        primary: isLast
          ? {
              text: doneButtonText,
              onClick: stopTour,
            }
          : {
              text: nextButtonText,
              onClick: goToNext,
            },
        secondary: isFirst
          ? undefined
          : {
              text: prevButtonText,
              onClick: goToPrevious,
            },
      }}
    />
  );
};

const openTourButtonText = 'Open Tour';
const steps: SpotlightPopoverTourSteps = [
  {
    name: 'step-1',
    content: () => <Text>Step 1</Text>,
    placement: 'bottom',
    footer: CustomFooter,
  },
  {
    name: 'step-2',
    content: () => <Text>Step 2</Text>,
    placement: 'bottom',
    footer: CustomFooter,
  },
];

const BasicTourExample = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Box>
      <Button
        marginBottom="spacing.9"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        {openTourButtonText}
      </Button>
      <SpotlightPopoverTour
        steps={steps}
        isOpen={isOpen}
        activeStep={activeStep}
        onFinish={() => {
          setActiveStep(0);
          setIsOpen(false);
          onFinishFn();
        }}
        onOpenChange={({ isOpen: open }) => {
          setIsOpen(open);
          onOpenChangeFn(open);
        }}
        onStepChange={(step) => {
          setActiveStep(step);
          onStepChangeFn(step);
        }}
      >
        <SpotlightPopoverTourStep name="step-1">
          <Box>
            <Text>Trigger 1</Text>
          </Box>
        </SpotlightPopoverTourStep>
        <SpotlightPopoverTourStep name="step-2">
          <Box>
            <Text>Trigger 2</Text>
          </Box>
        </SpotlightPopoverTourStep>
      </SpotlightPopoverTour>
    </Box>
  );
};

describe('<SpotlightPopoverTour /> (native)', () => {
  jest.useFakeTimers();

  /** Open / step-change: transition → scrollDelay → settle measure → forceReveal */
  const flushTourSettle = async () => {
    // Drain transitionDelay first so settle effect can schedule its 100ms timer
    await act(async () => {
      jest.advanceTimersByTime(animationDuration);
    });
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
  };

  it('should render when open', async () => {
    const { toJSON, getByText, queryByText } = renderWithTheme(<BasicTourExample />);

    expect(queryByText('Step 1')).toBeNull();

    fireEvent.press(getByText(openTourButtonText));
    await flushTourSettle();

    expect(queryByText('Step 1')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should go to next/prev step', async () => {
    const { getByText, queryByText } = renderWithTheme(<BasicTourExample />);

    expect(queryByText('Step 1')).toBeNull();

    fireEvent.press(getByText(openTourButtonText));
    await flushTourSettle();

    expect(queryByText('Step 1')).toBeTruthy();
    expect(onStepChangeFn).not.toHaveBeenCalled();

    fireEvent.press(getByText(nextButtonText));
    await flushTourSettle();

    expect(queryByText('Step 1')).toBeNull();
    expect(queryByText('Step 2')).toBeTruthy();
    expect(onStepChangeFn).toHaveBeenCalledWith(1);

    expect(getByText(doneButtonText)).toBeTruthy();

    fireEvent.press(getByText(prevButtonText));
    await flushTourSettle();

    expect(queryByText('Step 1')).toBeTruthy();
    expect(queryByText('Step 2')).toBeNull();
    expect(onStepChangeFn).toHaveBeenCalledWith(0);
  });

  it('should close on clicking the close button', async () => {
    const { getByText, getByLabelText, queryByText } = renderWithTheme(<BasicTourExample />);

    expect(queryByText('Step 1')).toBeNull();
    expect(onOpenChangeFn).not.toHaveBeenCalled();

    fireEvent.press(getByText(openTourButtonText));
    await flushTourSettle();

    expect(queryByText('Step 1')).toBeTruthy();
    expect(onOpenChangeFn).toHaveBeenCalledWith(true);

    fireEvent.press(getByLabelText('Close'));
    await act(async () => {
      jest.advanceTimersByTime(animationDuration);
    });

    expect(queryByText('Step 1')).toBeNull();
    expect(onOpenChangeFn).toHaveBeenCalledWith(false);
  });

  it('should call onFinish when calling stopTour method', async () => {
    const { getByText, queryByText } = renderWithTheme(<BasicTourExample />);

    expect(queryByText('Step 1')).toBeNull();
    expect(onFinishFn).not.toHaveBeenCalled();

    fireEvent.press(getByText(openTourButtonText));
    await flushTourSettle();

    expect(queryByText('Step 1')).toBeTruthy();
    expect(onOpenChangeFn).toHaveBeenCalledWith(true);

    fireEvent.press(getByText(nextButtonText));
    await flushTourSettle();

    expect(queryByText('Step 2')).toBeTruthy();
    expect(getByText(doneButtonText)).toBeTruthy();
    expect(onFinishFn).not.toHaveBeenCalled();

    fireEvent.press(getByText(doneButtonText));
    await act(async () => {
      jest.advanceTimersByTime(animationDuration);
    });

    expect(queryByText('Step 2')).toBeNull();
    expect(onFinishFn).toHaveBeenCalled();
  });

  it('should expose close control when open', async () => {
    const { getByText, getByLabelText } = renderWithTheme(<BasicTourExample />);

    fireEvent.press(getByText(openTourButtonText));
    await flushTourSettle();

    // RN has no mapped `dialog` role; Close control matches web a11y close path
    expect(getByLabelText('Close')).toBeTruthy();
  });
});

describe('utils.native visibility + scroll helpers', () => {
  const windowSpy = jest.spyOn(Dimensions, 'get');

  beforeEach(() => {
    jest.useRealTimers();
    windowSpy.mockReturnValue({ width: 400, height: 800, scale: 2, fontScale: 1 });
  });

  afterAll(() => {
    windowSpy.mockRestore();
  });

  it('isRectVisibleInWindow returns true when ≥50% overlaps the window', () => {
    expect(isRectVisibleInWindow({ x: 0, y: 0, width: 100, height: 100 }, 0.5)).toBe(true);

    // Fully off-screen
    expect(isRectVisibleInWindow({ x: 0, y: 900, width: 100, height: 100 }, 0.5)).toBe(false);

    // Only 40% visible vertically
    expect(isRectVisibleInWindow({ x: 0, y: 760, width: 100, height: 100 }, 0.5)).toBe(false);

    // Exactly 50% visible
    expect(isRectVisibleInWindow({ x: 0, y: 750, width: 100, height: 100 }, 0.5)).toBe(true);
  });

  it('measureStepRect resolves measureInWindow results', async () => {
    const ref = {
      current: {
        measureInWindow: (cb: (x: number, y: number, w: number, h: number) => void) => {
          cb(10, 20, 30, 40);
        },
      },
    };

    await expect(measureStepRect(ref as never)).resolves.toEqual({
      x: 10,
      y: 20,
      width: 30,
      height: 40,
    });
  });

  it('scrollStepIntoView calls scrollTo when the step is off-screen', async () => {
    const scrollTo = jest.fn();
    const scrollable = { scrollTo, setNativeProps: jest.fn() };

    const stepRef = {
      current: {
        measureInWindow: (cb: (x: number, y: number, w: number, h: number) => void) => {
          // Far below the fold
          cb(0, 1200, 100, 50);
        },
      },
    };

    await scrollStepIntoView(stepRef as never, scrollable);

    expect(scrollTo).toHaveBeenCalled();
    expect(scrollTo.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        animated: true,
      }),
    );
  });

  it('scrollStepIntoView does not scroll when already visible with room', async () => {
    const scrollTo = jest.fn();
    const scrollable = { scrollTo };

    const stepRef = {
      current: {
        measureInWindow: (cb: (x: number, y: number, w: number, h: number) => void) => {
          // Near top with room below for bottom placement
          cb(10, 10, 100, 50);
        },
      },
    };

    await scrollStepIntoView(stepRef as never, scrollable, {
      placement: 'bottom',
      ensurePlacementRoom: true,
    });
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('scrollStepIntoView scrolls when visible but preferred side lacks room', async () => {
    const scrollTo = jest.fn();
    const scrollable = {
      scrollTo,
      setNativeProps: jest.fn(),
      measureInWindow: (cb: (x: number, y: number, w: number, h: number) => void) => {
        cb(0, 0, 400, 800);
      },
    };

    const stepRef = {
      current: {
        measureInWindow: (cb: (x: number, y: number, w: number, h: number) => void) => {
          // Visible but near bottom — no room for bottom placement
          cb(10, 700, 100, 50);
        },
      },
    };

    await scrollStepIntoView(stepRef as never, scrollable, {
      placement: 'bottom',
      ensurePlacementRoom: true,
    });
    expect(scrollTo).toHaveBeenCalled();
  });
});

describe('useTourScrollLock', () => {
  const LockProbe = ({
    isOpen,
    scrollable,
  }: {
    isOpen: boolean;
    scrollable: { setNativeProps: jest.Mock; scrollEnabled?: boolean };
  }) => {
    const ref = React.useRef(scrollable);
    ref.current = scrollable;
    useTourScrollLock(isOpen, ref);
    return <View testID="lock-probe" />;
  };

  it('disables then restores scrollEnabled while open', () => {
    const scrollable = {
      setNativeProps: jest.fn(),
      scrollEnabled: true,
    };

    const { rerender } = renderWithTheme(<LockProbe isOpen={false} scrollable={scrollable} />);
    expect(scrollable.setNativeProps).not.toHaveBeenCalled();

    rerender(<LockProbe isOpen scrollable={scrollable} />);
    expect(scrollable.setNativeProps).toHaveBeenCalledWith({ scrollEnabled: false });
    expect(scrollable.scrollEnabled).toBe(false);

    rerender(<LockProbe isOpen={false} scrollable={scrollable} />);
    expect(scrollable.setNativeProps).toHaveBeenCalledWith({ scrollEnabled: true });
    expect(scrollable.scrollEnabled).toBe(true);
  });
});
