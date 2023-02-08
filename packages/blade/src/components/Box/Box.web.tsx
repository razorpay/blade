import styled from 'styled-components';
import type { CSSObject } from 'styled-components';
import type { Spacing } from '~tokens/global';

type BoxProps = {
  display: CSSObject['display'];
  padding: 'spacing.0' /** val */ | 'spacing.1';
};

export const Box = styled.div<BoxProps>((props) => {
  return boxProps;
});

export const Render = () => <Box padding=""></div>;
