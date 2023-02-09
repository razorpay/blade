import { system } from 'styled-system';
import type { Config } from 'styled-system';
import styled from 'styled-components';

const config: Config = {
  backgroundColor: {
    property: 'backgroundColor',
    scale: 'colors',
  },
};
export const color = system(config);

const Box = styled.div`
  ${color}
`;

export { Box };
