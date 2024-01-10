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
