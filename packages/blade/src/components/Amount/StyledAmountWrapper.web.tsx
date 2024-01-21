import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import getIn from '~utils/lodashButBetter/get';

const StyledAmountWrapper = styled(BaseBox)((props) => ({
  display: 'inline-block',
  position: 'relative',

  ...(props.isStrikethrough && {
    '&:before': {
      content: '""',
      width: '100%',
      height: '2px',
      position: 'absolute',
      top: '50%',
      fontWeight: getIn(props.theme.typography.fonts.weight, props.fontWeight),
      lineHeight: getIn(props.theme.typography.fonts.lineHeight, props.lineHeight),
      backgroundColor: getIn(props.theme.colors, props.color),
    },
  }),
}));

export { StyledAmountWrapper };
