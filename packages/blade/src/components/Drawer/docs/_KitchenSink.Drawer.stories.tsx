/* eslint-disable @typescript-eslint/no-explicit-any */
import { SimpleDrawer } from './Drawer.stories';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

export const Drawer = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      <Heading>Simple Drawer</Heading>
      {/* @ts-expect-error: This is story template of Drawer and not actual drawer so does not need all props as they are defined already */}
      <SimpleDrawer isOpen={true} />
    </Box>
  );
};

export default {
  title: 'Components/KitchenSink/Drawer',
  component: Drawer,
  parameters: {
    // enable Chromatic's snapshotting only for kitchensink
    chromatic: { disableSnapshot: false, delay: 700 },
    options: { showPanel: false },
  },
};
