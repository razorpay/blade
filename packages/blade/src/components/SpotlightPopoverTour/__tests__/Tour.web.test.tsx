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

  describe('spotlight border radius', () => {
    // jsdom reports a zero-sized rect for every element, and the mask skips the cut-out
    // entirely when the measured size is zero — so give the spotlit element a real box.
    let getBoundingClientRectSpy: jest.SpyInstance;
    beforeEach(() => {
      getBoundingClientRectSpy = jest
        .spyOn(window.Element.prototype, 'getBoundingClientRect')
        .mockReturnValue({ x: 0, y: 0, width: 100, height: 40 } as DOMRect);
    });
    afterEach(() => {
      getBoundingClientRectSpy.mockRestore();
    });

    const getMaskHoleRadius = (baseElement: Element): string | null | undefined => {
      // the last rect inside the mask is the spotlight cut-out
      const rects = baseElement.querySelectorAll('mask#tour-mask rect');
      return rects[rects.length - 1]?.getAttribute('rx');
    };

    // NOTE: jsdom does not expand the `border-radius` shorthand into longhands, so these
    // tests set `borderTopLeftRadius` directly. Real browsers always report the longhand
    // from `getComputedStyle`, which is what the implementation reads.
    const RadiusTourExample = ({ stepStyle }: { stepStyle?: React.CSSProperties }) => (
      <SpotlightPopoverTour steps={[steps[0]]} isOpen={true} activeStep={0}>
        <SpotlightPopoverTourStep name="step-1">
          <div style={{ width: 100, height: 40, ...stepStyle }}>Trigger 1</div>
        </SpotlightPopoverTourStep>
      </SpotlightPopoverTour>
    );

    it('should take the corner radius of the component it highlights', async () => {
      const { baseElement } = renderWithTheme(
        <RadiusTourExample stepStyle={{ borderTopLeftRadius: '8px' }} />,
      );
      await act(async () => {
        jest.advanceTimersByTime(animationDuration);
      });

      expect(getMaskHoleRadius(baseElement)).toBe('8');
    });

    it('should read past a layout wrapper that draws no corner of its own', async () => {
      // SpotlightPopoverTourStep clones its child to attach a ref, so consumers commonly wrap
      // their UI in a layout element. The spotlight should still match the component inside.
      const { baseElement } = renderWithTheme(
        <SpotlightPopoverTour steps={[steps[0]]} isOpen={true} activeStep={0}>
          <SpotlightPopoverTourStep name="step-1">
            <div>
              <div style={{ borderTopLeftRadius: '12px' }}>Trigger 1</div>
            </div>
          </SpotlightPopoverTourStep>
        </SpotlightPopoverTour>,
      );
      await act(async () => {
        jest.advanceTimersByTime(animationDuration);
      });

      expect(getMaskHoleRadius(baseElement)).toBe('12');
    });

    it('should fall back to the popover radius when nothing draws a corner', async () => {
      const { baseElement } = renderWithTheme(<RadiusTourExample />);
      await act(async () => {
        jest.advanceTimersByTime(animationDuration);
      });

      expect(getMaskHoleRadius(baseElement)).toBe(String(bladeTheme.border.radius.large));
    });
  });

  describe('spotlight geometry', () => {
    // Per-element rects, so a layout wrapper can be taller than the component inside it.
    let getBoundingClientRectSpy: jest.SpyInstance;
    beforeEach(() => {
      getBoundingClientRectSpy = jest
        .spyOn(window.Element.prototype, 'getBoundingClientRect')
        .mockImplementation(function getRect(this: Element) {
          const el = this as HTMLElement;
          return {
            x: 0,
            y: 0,
            width: Number(el.dataset?.testWidth ?? 100),
            height: Number(el.dataset?.testHeight ?? 40),
          } as DOMRect;
        });
    });
    afterEach(() => {
      getBoundingClientRectSpy.mockRestore();
    });

    const getMaskHole = (baseElement: Element): Record<string, string | null> | null => {
      const rects = baseElement.querySelectorAll('mask#tour-mask rect');
      const hole = rects[rects.length - 1];
      return hole
        ? { width: hole.getAttribute('width'), height: hole.getAttribute('height') }
        : null;
    };

    it('should trace the component, not a layout wrapper stretched taller than it', async () => {
      // Mirrors a flex row with alignItems="stretch": the step's wrapper is stretched to a
      // taller sibling, so measuring it would leave the spotlight's padding uneven at the
      // bottom. The spotlight should hug the 40px-tall card instead of the 60px wrapper.
      const { baseElement } = renderWithTheme(
        <SpotlightPopoverTour steps={[steps[0]]} isOpen={true} activeStep={0}>
          <SpotlightPopoverTourStep name="step-1">
            <div data-test-height="60">
              <div data-test-height="40" style={{ borderTopLeftRadius: '12px' }}>
                Trigger 1
              </div>
            </div>
          </SpotlightPopoverTourStep>
        </SpotlightPopoverTour>,
      );
      await act(async () => {
        jest.advanceTimersByTime(animationDuration);
      });

      // padding is theme.spacing[4] (12), split evenly, so the hole is the target + 12
      expect(getMaskHole(baseElement)).toEqual({ width: '112', height: '52' });
    });

    it('should keep measuring the wrapper when its child does not fill it', async () => {
      // Guards against shrinking onto an inner element that merely happens to be first.
      const { baseElement } = renderWithTheme(
        <SpotlightPopoverTour steps={[steps[0]]} isOpen={true} activeStep={0}>
          <SpotlightPopoverTourStep name="step-1">
            <div data-test-height="60">
              <span data-test-height="10" data-test-width="30">
                icon
              </span>
            </div>
          </SpotlightPopoverTourStep>
        </SpotlightPopoverTour>,
      );
      await act(async () => {
        jest.advanceTimersByTime(animationDuration);
      });

      expect(getMaskHole(baseElement)).toEqual({ width: '112', height: '72' });
    });
  });
  it('should not have a11y violations', async () => {
    const { baseElement, getByRole } = renderWithTheme(<BasicTourExample />);

    // snapshot while on opened
    fireEvent.click(getByRole('button', { name: openTourButtonText }));
    await act(async () => {
      jest.advanceTimersByTime(animationDuration);
    });

    // check for a11y violations
    assertAccessible(baseElement);
  });
});
