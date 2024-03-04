import styled from 'styled-components';
import type { StyledButtonGroupProps } from './types';
// import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';

const StyledButtonGroup = styled(BaseBox)<StyledButtonGroupProps>(({ theme, isDisabled }) => {
  return {
    display: 'flex',
    width: '100%',

    '& button[role="button"]': {
      borderRadius: 0,
      borderRightWidth: 'thin',
      borderRightColor: 'black',
      borderRightStyle: 'solid',
    },

    // '& button:not(:last-child)': {
    //   borderRight: 'none',
    // },

    '& button:first-child': {
      //borderTopLeftRadius: '5px',
      //borderBottomLeftRadius: 'medium',
    },
  };
});

export { StyledButtonGroup };
