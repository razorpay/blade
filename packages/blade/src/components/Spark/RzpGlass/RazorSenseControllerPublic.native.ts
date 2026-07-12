import { RazorSenseError } from './razorSenseMotionTypes';
import type {
  RazorSenseController,
  RazorSenseControllerOptions,
  RazorSenseSequenceController,
  RazorSenseSequenceDefinition,
} from './razorSenseMotionTypes';

const throwUnsupportedPlatform = (): never => {
  throw new RazorSenseError(
    'RazorSense motion controllers are not available on React Native. Use the compatibility renderer or a responsive-web surface.',
    {
      code: 'unsupported-platform',
      recoverable: false,
    },
  );
};

const createRazorSenseController = (
  _options: RazorSenseControllerOptions = {},
): RazorSenseController => throwUnsupportedPlatform();

const createRazorSenseSequenceController = <Cue extends string, ForegroundSlot extends string>(
  _sequence: RazorSenseSequenceDefinition<Cue, ForegroundSlot>,
): RazorSenseSequenceController => throwUnsupportedPlatform();

const disposeRazorSenseController = (
  _controller: RazorSenseController | RazorSenseSequenceController,
): void => undefined;

export {
  createRazorSenseController,
  createRazorSenseSequenceController,
  disposeRazorSenseController,
};
