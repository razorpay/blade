import { RazorSenseError } from './razorSenseMotionTypes';
import type {
  RazorSenseController,
  RazorSenseSequenceController,
  RazorSenseSequenceDefinition,
  RazorSenseState,
} from './razorSenseMotionTypes';

type UseRazorSenseControllerOptions = {
  initialState?: RazorSenseState;
};

const throwUnsupportedPlatform = (): never => {
  throw new RazorSenseError(
    'RazorSense motion controller hooks are not available on React Native. Use the compatibility renderer or a responsive-web surface.',
    {
      code: 'unsupported-platform',
      recoverable: false,
    },
  );
};

const useRazorSenseController = (
  _options: UseRazorSenseControllerOptions = {},
): RazorSenseController => throwUnsupportedPlatform();

const useRazorSenseSequenceController = <Cue extends string, ForegroundSlot extends string>(
  _sequence: RazorSenseSequenceDefinition<Cue, ForegroundSlot>,
): RazorSenseSequenceController => throwUnsupportedPlatform();

export { useRazorSenseController, useRazorSenseSequenceController };
export type { UseRazorSenseControllerOptions };
