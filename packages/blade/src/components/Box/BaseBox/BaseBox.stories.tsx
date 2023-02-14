// @TODO: test story. Remove later
import { BaseBox } from '.';

const BoxStoryMeta = {
  title: 'Components/BaseBox',
  component: BaseBox,
};

export const Render = (): JSX.Element => (
  <BaseBox
    display="flex"
    flexDirection={{ base: 'column', l: 'row' }}
    padding={{ base: ['spacing.10', 'spacing.3'], l: 'spacing.1' }}
  >
    <BaseBox flex="1" backgroundColor="yellow" minHeight="spacing.10" minWidth="spacing.10" />
    <BaseBox flex="1" backgroundColor="green" minHeight="50px" minWidth="50px" />
    <BaseBox flex="1" backgroundColor="purple" minHeight="50px" minWidth="50px" />
    <BaseBox flex="1" borderRadius="max" backgroundColor="red" minHeight="50px" minWidth="50px" />
  </BaseBox>
);

export default BoxStoryMeta;
