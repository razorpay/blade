import styled from 'styled-components';
import type { StyledBaseMenuItemContainerProps } from '../types';
import { getBaseMenuItemStyles } from './getBaseMenuItemStyles';
import { getItemPadding } from './tokens';
import { getMediaQuery, makeSize } from '~utils';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import BaseBox from '~components/Box/BaseBox';

const StyledMenuItemContainer = styled(BaseBox)<StyledBaseMenuItemContainerProps>((props) => {
  return {
    ...getBaseMenuItemStyles({ theme: props.theme }),
    padding: makeSize(getItemPadding(props.theme).itemPaddingMobile),
    display: props.isVisible ? 'flex' : 'none',
    [`@media ${getMediaQuery({ min: props.theme.breakpoints.m })}`]: {
      padding: makeSize(getItemPadding(props.theme).itemPaddingDesktop),
    },
    '&:hover:not([aria-disabled=true]), &[aria-expanded="true"]': {
      backgroundColor:
        props.color === 'negative'
          ? props.theme.colors.interactive.background.negative.faded
          : props.theme.colors.interactive.background.gray.default,
    },
    '&:focus-visible': getFocusRingStyles({ theme: props.theme }),
    '&.active-focus': props.isKeydownPressed
      ? getFocusRingStyles({ theme: props.theme })
      : undefined,
    '&[aria-selected=true]': {
      backgroundColor:
        props.selectionType === 'single'
          ? props.theme.colors.interactive.background.primary.faded
          : undefined,
    },
    '&[aria-selected=true]:hover': {
      backgroundColor: props.theme.colors.interactive.background.primary.fadedHighlighted,
    },
  };
});

export { StyledMenuItemContainer };
