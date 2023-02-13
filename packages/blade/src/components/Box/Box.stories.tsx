import { BaseBox } from './NewBaseBox/BaseBox';

const BoxStoryMeta = {
  title: 'Components/BaseBox',
  component: BaseBox,
};

export const Render = (): JSX.Element => {
  return <BaseBox padding="spacing.1">hi</BaseBox>;
};

export default BoxStoryMeta;
