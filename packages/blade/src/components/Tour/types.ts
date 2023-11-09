import type { UseFloatingOptions } from '@floating-ui/react';

type StepRenderProps = {
  /**
   * Go to a specific step
   */
  goToStep: (step: number) => void;
  /**
   * Go to the next step
   */
  goToNext: () => void;
  /**
   * Go to the previous step
   */
  goToPrevious: () => void;
  /**
   * Stop the tour
   *
   * This will call the `onFinish` callback
   */
  stopTour: () => void;
  /**
   * Current active step (zero based index)
   */
  activeStep: number;
  /**
   * Total number of steps
   */
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
  content: (props: StepRenderProps) => React.ReactElement;
  /**
   * Footer content
   */
  footer?: (props: StepRenderProps) => React.ReactNode;
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

// This will also be useful for consumers
type TourSteps = Step[];

type TourProps = {
  /**
   * Array of steps to be rendered
   *
   * The order of the steps will be the order in which they are rendered depending on the `activeStep` prop
   */
  steps: TourSteps;
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

type TourStepProps = {
  name: string;
  children: React.ReactNode;
};

type TourMaskRect = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export type { TourProps, Step, TourStepProps, TourMaskRect, StepRenderProps, TourSteps };
