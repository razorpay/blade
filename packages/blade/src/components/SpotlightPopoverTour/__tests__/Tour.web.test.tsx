/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { act, fireEvent } from '@testing-library/react';
import React from 'react';
import { SpotlightPopoverTour } from '../Tour.web';
import { SpotlightPopoverTourStep } from '../TourStep.web';
import type { SpotlightPopoverStepRenderProps, SpotlightPopoverTourSteps } from '../types';
import { SpotlightPopoverTourFooter } from '../TourFooter.web';
import { Button } from '~components/Button';
import { bladeTheme } from '~tokens/theme';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import assertAccessible from '~utils/testing/assertAccessible.web';

const animationDuration = bladeTheme.motion.duration.gentle;
const nextButtonText = 'Next';
const prevButtonText = 'Prev';
const doneButtonText = 'Done';
const onStepChangeFn = jest.fn();
const onOpenChangeFn = jest.fn();
const onFinishFn = jest.fn();

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});
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
    title: 'Step 1 Title',
    content: () => <Text>Step 1</Text>,
    placement: 'bottom',
    footer: CustomFooter,
  },
  {
    name: 'step-2',
    title: 'Step 2 Title',
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
        onOpenChange={({ isOpen }) => {
          setIsOpen(isOpen);
          onOpenChangeFn(isOpen);
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

describe('<Tour />', () => {
  jest.useFakeTimers();

  it('should render', async () => {
    const { baseElement, getByRole, queryByRole, queryByText } = renderWithTheme(
      <BasicTourExample />,
    );

    expect(queryByText('Step 1')).not.toBeInTheDocument();

    // snapshot while on opened
    fireEvent.click(getByRole('button', { name: openTourButtonText }));
    await act(async () => {
      jest.advanceTimersByTime(animationDuration);
    });

    expect(queryByRole('dialog')).toBeInTheDocument();
    expect(queryByText('Step 1')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('should go to next/prev step', async () => {
    const { getByRole, queryByRole, queryByText } = renderWithTheme(<BasicTourExample />);

    expect(queryByRole('dialog')).not.toBeInTheDocument();
    expect(queryByText('Step 1')).not.toBeInTheDocument();

    // snapshot while on opened
    fireEvent.click(getByRole('button', { name: openTourButtonText }));
    await act(async () => {
      jest.advanceTimersByTime(animationDuration);
    });

    expect(queryByRole('dialog')).toBeInTheDocument();
    expect(queryByText('Step 1')).toBeInTheDocument();
    expect(onStepChangeFn).not.toHaveBeenCalled();

    // go to next step
    fireEvent.click(getByRole('button', { name: nextButtonText }));

    await act(async () => {
      jest.advanceTimersByTime(animationDuration);
    });

    expect(queryByText('Step 1')).not.toBeInTheDocument();
    expect(queryByText('Step 2')).toBeInTheDocument();
    expect(onStepChangeFn).toHaveBeenCalledWith(1);

    // We are at the end of the tour step, expect done button to be visible
    expect(getByRole('button', { name: doneButtonText })).toBeInTheDocument();

    // got to previous step
    fireEvent.click(getByRole('button', { name: prevButtonText }));

    await act(async () => {
      jest.advanceTimersByTime(animationDuration);
    });

    expect(queryByText('Step 1')).toBeInTheDocument();
    expect(queryByText('Step 2')).not.toBeInTheDocument();
    expect(onStepChangeFn).toHaveBeenCalledWith(0);
  });

  it('should close on clicking the close button', async () => {
    const { getByRole, queryByRole, queryByText } = renderWithTheme(<BasicTourExample />);

    expect(queryByText('Step 1')).not.toBeInTheDocument();
    expect(onOpenChangeFn).not.toHaveBeenCalled();

    // click on open tour button
    fireEvent.click(getByRole('button', { name: openTourButtonText }));
    await act(async () => {
      jest.advanceTimersByTime(animationDuration);
    });

    expect(queryByRole('dialog')).toBeInTheDocument();
    expect(queryByText('Step 1')).toBeInTheDocument();
    expect(onOpenChangeFn).toHaveBeenCalledWith(true);

    // close the tour
    fireEvent.click(getByRole('button', { name: 'Close' }));

    await act(async () => {
      jest.advanceTimersByTime(animationDuration);
    });

    expect(queryByRole('dialog')).not.toBeInTheDocument();
    expect(queryByText('Step 1')).not.toBeInTheDocument();
    expect(onOpenChangeFn).toHaveBeenCalledWith(false);
  });

  it('should call onFinish when calling stopTour method', async () => {
    const { getByRole, queryByRole, queryByText } = renderWithTheme(<BasicTourExample />);

    expect(queryByText('Step 1')).not.toBeInTheDocument();
    expect(onOpenChangeFn).not.toHaveBeenCalled();
    expect(onFinishFn).not.toHaveBeenCalled();

    // click on open tour button
    fireEvent.click(getByRole('button', { name: openTourButtonText }));
    await act(async () => {
      jest.advanceTimersByTime(animationDuration);
    });

    expect(queryByRole('dialog')).toBeInTheDocument();
    expect(queryByText('Step 1')).toBeInTheDocument();
    expect(onOpenChangeFn).toHaveBeenCalledWith(true);
    expect(onFinishFn).not.toHaveBeenCalled();

    // Go to last step
    fireEvent.click(getByRole('button', { name: nextButtonText }));
    await act(async () => {
      jest.advanceTimersByTime(animationDuration);
    });

    expect(queryByText('Step 2')).toBeInTheDocument();
    expect(getByRole('button', { name: doneButtonText })).toBeInTheDocument();
    expect(onFinishFn).not.toHaveBeenCalled();

    // stop tour
    fireEvent.click(getByRole('button', { name: doneButtonText }));

    await act(async () => {
      jest.advanceTimersByTime(animationDuration);
    });

    expect(queryByText('Step 2')).not.toBeInTheDocument();
    expect(queryByRole('dialog')).not.toBeInTheDocument();
    expect(onFinishFn).toHaveBeenCalled();
  });

  it('should not have a11y violations', async () => {
    const { baseElement, getByRole } = renderWithTheme(<BasicTourExample />);

    // snapshot while on opened
    fireEvent.click(getByRole('button', { name: openTourButtonText }));
    await act(async () => {
      jest.advanceTimersByTime(animationDuration);
    });

    // axe uses real timers internally, so switch back temporarily
    jest.useRealTimers();
    // check for a11y violations
    await assertAccessible(baseElement);
    jest.useFakeTimers();
  });

  describe('scroll behavior', () => {
    const scrollSteps: SpotlightPopoverTourSteps = [
      {
        name: 'step-1',
        title: 'Tour Step',
        content: () => <Text>Step 1</Text>,
        placement: 'bottom',
        footer: CustomFooter,
      },
    ];

    const ScrollTourExample = ({
      stepScrollMode,
    }: {
      stepScrollMode?: 'auto' | 'center' | 'nearest' | 'none';
    }) => {
      const [activeStep, setActiveStep] = React.useState(0);
      const [isOpen, setIsOpen] = React.useState(false);
      const stepsWithMode = React.useMemo(
        () => scrollSteps.map((s) => ({ ...s, scrollMode: stepScrollMode })),
        [stepScrollMode],
      );

      return (
        <Box>
          <Button marginBottom="spacing.9" onClick={() => setIsOpen((prev) => !prev)}>
            {openTourButtonText}
          </Button>
          <SpotlightPopoverTour
            steps={stepsWithMode}
            isOpen={isOpen}
            activeStep={activeStep}
            onStepChange={(step) => {
              setActiveStep(step);
              onStepChangeFn(step);
            }}
            onOpenChange={({ isOpen }) => {
              setIsOpen(isOpen);
              onOpenChangeFn(isOpen);
            }}
            onFinish={() => {
              setActiveStep(0);
              setIsOpen(false);
              onFinishFn();
            }}
          >
            <SpotlightPopoverTourStep name="step-1">
              <Box>
                <Text>Trigger 1</Text>
              </Box>
            </SpotlightPopoverTourStep>
          </SpotlightPopoverTour>
        </Box>
      );
    };

    /**
     * Temporarily set window.innerHeight to simulate viewport constraints.
     * In jsdom, elements have height 0 by default. Setting innerHeight to -1
     * makes 0 > -1 true, simulating a "taller than viewport" element.
     */
    const mockViewportHeight = (viewportHeight: number) => {
      const originalInnerHeight = window.innerHeight;
      Object.defineProperty(window, 'innerHeight', {
        value: viewportHeight,
        writable: true,
      });
      return () => {
        Object.defineProperty(window, 'innerHeight', {
          value: originalInnerHeight,
          writable: true,
        });
      };
    };

    /**
     * Advance fake timers in increments so React act() can process
     * state updates and effects between ticks (single large advance
     * doesn't flush intermediate layout effects).
     */
    const advanceTimers = async (totalMs: number, step = 200) => {
      for (let elapsed = 0; elapsed < totalMs; elapsed += step) {
        await act(async () => {
          jest.advanceTimersByTime(step);
        });
      }
    };

    // scroll fires after transitionDelay (480ms) + scrollDelay (100ms) = ~580ms
    const scrollTimeout = animationDuration * 2;

    beforeEach(() => {
      (window.HTMLElement.prototype.scrollIntoView as jest.Mock).mockClear();
    });

    it('should use block:nearest when anchored element is taller than viewport (auto mode)', async () => {
      // innerHeight=-1 makes jsdom's default element height (0) > viewport, simulating tall element
      const restore = mockViewportHeight(-1);
      try {
        const { getByRole } = renderWithTheme(<ScrollTourExample stepScrollMode="auto" />);
        fireEvent.click(getByRole('button', { name: openTourButtonText }));
        await advanceTimers(scrollTimeout);

        expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith(
          expect.objectContaining({ block: 'nearest' }),
        );
      } finally {
        restore();
      }
    });

    it('should use block:center when anchored element fits in viewport (auto mode)', async () => {
      const { getByRole } = renderWithTheme(<ScrollTourExample stepScrollMode="auto" />);
      fireEvent.click(getByRole('button', { name: openTourButtonText }));
      await advanceTimers(scrollTimeout);

      expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith(
        expect.objectContaining({ block: 'center' }),
      );
    });

    it('should use block:center when scrollMode is center even for tall elements', async () => {
      const restore = mockViewportHeight(-1);
      try {
        const { getByRole } = renderWithTheme(<ScrollTourExample stepScrollMode="center" />);
        fireEvent.click(getByRole('button', { name: openTourButtonText }));
        await advanceTimers(scrollTimeout);

        expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith(
          expect.objectContaining({ block: 'center' }),
        );
      } finally {
        restore();
      }
    });

    it('should use block:nearest when scrollMode is nearest even for short elements', async () => {
      const { getByRole } = renderWithTheme(<ScrollTourExample stepScrollMode="nearest" />);
      fireEvent.click(getByRole('button', { name: openTourButtonText }));
      await advanceTimers(scrollTimeout);

      expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith(
        expect.objectContaining({ block: 'nearest' }),
      );
    });

    it('should not scroll when scrollMode is none', async () => {
      const { getByRole } = renderWithTheme(<ScrollTourExample stepScrollMode="none" />);
      fireEvent.click(getByRole('button', { name: openTourButtonText }));
      await advanceTimers(scrollTimeout);

      expect(window.HTMLElement.prototype.scrollIntoView).not.toHaveBeenCalled();
    });
  });
});
