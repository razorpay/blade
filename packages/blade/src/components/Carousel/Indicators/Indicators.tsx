import { IndicatorButton } from './IndicatorButton';
import type { IndicatorsProps } from './types';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';

const Indicators = (props: IndicatorsProps): React.ReactElement => {
  return (
    <Box display="flex" flexDirection="row">
      {new Array(props.totalItems).fill(0).map((_, idx) => {
        return (
          <BaseBox key={idx} display="flex" flexDirection="row">
            {/* can't use gap on RN */}
            {idx !== 0 ? <Box marginLeft="spacing.2" /> : null}
            <IndicatorButton
              isActive={idx === props.activeIndex}
              onClick={() => props?.onIndicatorButtonClick?.(idx)}
              variant={props.variant}
            />
          </BaseBox>
        );
      })}
    </Box>
  );
};

export { Indicators };
