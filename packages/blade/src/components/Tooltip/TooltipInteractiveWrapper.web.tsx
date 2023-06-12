import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { makeBorderSize } from '~utils';

const TooltipInteractiveWrapper = styled(BaseBox).attrs(() => {
  return { tabIndex: -1 };
})((props) => {
  return {
    display: 'inline-block',
    '&:focus': {
      borderRadius: makeBorderSize(props.theme.border.radius.medium),
      // TODO: Replace with focus outline token
      outline: `1px solid ${props.theme.colors.surface.background.level1.lowContrast}`,
      boxShadow: `0px 0px 0px 4px ${props.theme.colors.brand.primary[400]}`,
    },
  };
});

export { TooltipInteractiveWrapper };
