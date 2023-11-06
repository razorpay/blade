import type { UseFloatingOptions } from '@floating-ui/react';

type StepRenderProps = {
  gotToNext: () => void;
  goToPrevious: () => void;
  stopTour: () => void;
  activeStep: number;
  totalSteps: number;
};

type Step = {
  /**
   * Unique identifier for the tour step
   */
  name: string;
  /**
   * Content of the Popover
   */
  content: ({
    gotToNext,
    goToPrevious,
    stopTour,
    activeStep,
    totalSteps,
  }: StepRenderProps) => React.ReactNode;
  /**
   * Footer content
   */
  footer?: ({
    gotToNext,
    goToPrevious,
    stopTour,
    activeStep,
    totalSteps,
  }: StepRenderProps) => React.ReactNode;
  /**
   * Popover title
   */
  title?: string;
  /**
   * Leading content placed before the title
   *
   * Can be any blade icon or asset.
   */
  titleLeading?: React.ReactNode;
  /**
   * Placement of Popover
   * @default "top"
   */
  placement?: UseFloatingOptions['placement'];
};

type TourProps = {
  /**
   * Array of steps to be rendered
   *
   * The order of the steps will be the order in which they are rendered depending on the `activeStep` prop
   */
  steps: Step[];
  /**
   * Whether the tour is visible or not
   */
  isOpen: boolean;
  /**
   * Callback when the tour is opened or closed
   */
  onOpenChange: ({ isOpen }: { isOpen: boolean }) => void;
  /**
   * Callback which fires when the tour has reached the last step.
   */
  onFinish: () => void;
  /**
   * Callback when the active step changes
   */
  onStepChange?: (step: number) => void;
  /**
   * Active step to be rendered
   */
  activeStep: number;
  children: React.ReactNode;
};

export type { TourProps, Step };
