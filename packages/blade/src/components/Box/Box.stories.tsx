import { BaseBox } from './NewBaseBox/BaseBox';

const BoxStoryMeta = {
  title: 'Components/BaseBox',
  component: BaseBox,
};

export const Render = (): JSX.Element => {
  return (
    <BaseBox
      backgroundColor={{
        base: 'red',
        xs: 'orange',
        s: 'green',
        m: 'yellow',
        l: 'blue',
        xl: 'purple',
      }}
    >
      hi
    </BaseBox>
  );
};

export default BoxStoryMeta;
