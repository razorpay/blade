import { Box } from './Box';

const BoxStoryMeta = {
  title: 'Components/Box',
  component: Box,
};

export const Render = (): JSX.Element => (
  <Box
    backgroundColor={{
      base: 'red',
      // xs: 'orange',
      // s: 'green',
      // m: 'yellow',
      // l: 'blue',
      xl: 'purple',
    }}
  >
    hi
  </Box>
);

export default BoxStoryMeta;
