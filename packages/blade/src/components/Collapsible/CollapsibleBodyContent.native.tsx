import type { ReactElement } from 'react';
import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import type { CollapsibleBodyContentProps } from './types';
import { useCollapsible } from './CollapsibleContext';
import { Box } from '~components/Box';

type AnimatedStyledCollapsibleBodyContentProps = {
  isExpanded: boolean;
};

const AnimatedStyledCollapsibleBodyContent = styled(
  Animated.View,
)<AnimatedStyledCollapsibleBodyContentProps>((props) => {
  const { isExpanded } = props;
  return {
    height: isExpanded ? 'auto' : 0,
  };
});

const CollapsibleBodyContent = ({ children }: CollapsibleBodyContentProps): ReactElement => {
  const { isExpanded, defaultIsExpanded, direction } = useCollapsible();

  return (
    <AnimatedStyledCollapsibleBodyContent isExpanded={isExpanded}>
      <Box
        /**
         * Need a margin inside the outside wrapper so this is
         * included in height calculations and prevents jank
         */
        marginTop={direction === 'bottom' ? 'spacing.5' : 'spacing.0'}
        marginBottom={direction === 'top' ? 'spacing.5' : 'spacing.0'}
      >
        {children}
      </Box>
    </AnimatedStyledCollapsibleBodyContent>
  );
};

export { CollapsibleBodyContent };
