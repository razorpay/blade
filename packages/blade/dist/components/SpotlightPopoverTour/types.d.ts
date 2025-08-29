import { UseFloatingOptions } from '@floating-ui/react';
type SpotlightPopoverStepRenderProps = {
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
    content: (props: SpotlightPopoverStepRenderProps) => React.ReactElement;
    /**
     * Footer content
     */
    footer?: (props: SpotlightPopoverStepRenderProps) => React.ReactNode;
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
type SpotlightPopoverTourSteps = Step[];
type SpotlightPopoverTourProps = {
    /**
     * Array of steps to be rendered
     *
     * The order of the steps will be the order in which they are rendered depending on the `activeStep` prop
     */
    steps: SpotlightPopoverTourSteps;
    /**
     * Whether the tour is visible or not
     */
    isOpen: boolean;
    /**
     * Callback when the tour is opened or closed
     */
    onOpenChange?: ({ isOpen }: {
        isOpen: boolean;
    }) => void;
    /**
     * Callback which fires when the `stopTour` method is called from the `steps` array
     */
    onFinish?: () => void;
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
type SpotlightPopoverTourStepProps = {
    name: string;
    children: React.ReactNode;
};
type SpotlightPopoverTourMaskRect = {
    width: number;
    height: number;
    x: number;
    y: number;
};
export type { SpotlightPopoverTourProps, Step, SpotlightPopoverTourStepProps, SpotlightPopoverTourMaskRect, SpotlightPopoverStepRenderProps, SpotlightPopoverTourSteps, };
