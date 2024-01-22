import styled from 'styled-components';
import type { AmountProps } from './Amount';
import BaseBox from '~components/Box/BaseBox';
import getIn from '~utils/lodashButBetter/get';

const StyledAmountWrapper = styled(BaseBox)<{
  textDecorationLine: 'line-through' | 'none';
  color: AmountProps['color'];
}>((props) => {
  return {
    position: 'relative',

    ...(props.textDecorationLine === 'line-through' && {
      '&:before': {
        content: '""',
        width: '100%',
        height: '2px',
        position: 'absolute',
        top: '50%',
        // @ts-expect-error - intentionally setting the background color to the color prop for this hacky strikethrough
        backgroundColor: getIn(props.theme.colors, props.color),
      },
    }),
  };
});

export { StyledAmountWrapper };
