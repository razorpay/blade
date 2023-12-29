import styled from 'styled-components';
import type { HoverlayProps } from './types';
import { getHoverlayStyles } from './styles';
import BaseBox from '~components/Box/BaseBox';

const Hoverlay = styled(BaseBox)<HoverlayProps>((props) => {
  return getHoverlayStyles(props);
});

export { Hoverlay };
