import type { RazorSenseRunId, RazorSenseSequenceDefinition } from './razorSenseMotionTypes';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

type RazorSenseSequenceProps<Cue extends string = never, ForegroundSlot extends string = never> = {
  sequence: RazorSenseSequenceDefinition<Cue, ForegroundSlot>;
  runId?: RazorSenseRunId;
};

/** Declarative RazorSense sequences are currently supported on responsive web. */
const RazorSenseSequence = <Cue extends string = never, ForegroundSlot extends string = never>(
  _props: RazorSenseSequenceProps<Cue, ForegroundSlot>,
): React.ReactElement => {
  throwBladeError({
    message: 'RazorSenseSequence is not yet implemented for React Native',
    moduleName: 'RazorSenseSequence',
  });

  return <Text>RazorSenseSequence is not available for Native mobile apps.</Text>;
};

export { RazorSenseSequence };
export type { RazorSenseSequenceProps };
