import type { StoryFn, Meta } from '@storybook/react-vite';
import { Title, Subtitle, Primary, Controls, Stories } from '@storybook/addon-docs/blocks';
import type { ReactElement } from 'react';
import { DotLoader as DotLoaderComponent } from './DotLoader';
import type { DotLoaderProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';

const Page = (): ReactElement => {
  return (
    <>
      <Title />
      <Subtitle>
        This is the DotLoader internal component. It is the shared indefinite loading indicator —
        three dots that lift and settle in a staggered wave. It is not exported publicly; use it
        from other Blade components via `~components/DotLoader`.
      </Subtitle>
      <a
        href="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=125319-2211"
        target="_blank"
        rel="noreferrer noopener"
      >
        View in Figma
      </a>
      <br />
      <br />
      <Title>Example</Title>
      <Subtitle>
        By default the loader is hidden from assistive tech, on the assumption that the surrounding
        component announces its own loading state. Pass `accessibilityLabel` when it is the only
        thing communicating that something is loading.
      </Subtitle>
      <Primary />
      <Title>Properties</Title>
      <Controls />
      <Stories />
    </>
  );
};

export default {
  title: 'Components/DotLoader (Internal)',
  component: DotLoaderComponent,
  parameters: {
    docs: {
      page: Page,
    },
  },
  tags: ['autodocs'],
} as Meta<DotLoaderProps>;

const DotLoaderTemplate: StoryFn<typeof DotLoaderComponent> = ({ ...args }) => {
  return <DotLoaderComponent {...args} />;
};

export const DotLoader = DotLoaderTemplate.bind({});
DotLoader.storyName = 'Default';

const colors: DotLoaderProps['color'][] = [
  'interactive.icon.gray.muted',
  'interactive.icon.primary.subtle',
  'interactive.icon.positive.subtle',
  'interactive.icon.negative.subtle',
  'interactive.icon.notice.subtle',
  'interactive.icon.information.subtle',
];

const ColorsTemplate: StoryFn<typeof DotLoaderComponent> = () => {
  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.4">
      {colors.map((color) => (
        <BaseBox key={color} display="flex" flexDirection="row" alignItems="center" gap="spacing.4">
          <BaseBox width="220px">
            <Text size="small" color="surface.text.gray.muted">
              {color}
            </Text>
          </BaseBox>
          <DotLoaderComponent color={color} />
        </BaseBox>
      ))}
    </BaseBox>
  );
};

export const Colors = ColorsTemplate.bind({});
Colors.storyName = 'Colors';

const sizes: DotLoaderProps['size'][] = ['medium', 'large'];

const SizesTemplate: StoryFn<typeof DotLoaderComponent> = () => {
  return (
    <BaseBox display="flex" flexDirection="row" alignItems="center" gap="spacing.7">
      {sizes.map((size) => (
        <BaseBox
          key={size}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap="spacing.3"
        >
          <DotLoaderComponent size={size} />
          <Text size="small" color="surface.text.gray.muted">
            {size}
          </Text>
        </BaseBox>
      ))}
    </BaseBox>
  );
};

export const Sizes = SizesTemplate.bind({});
Sizes.storyName = 'Sizes';
Sizes.parameters = {
  docs: {
    description: {
      story:
        '`large` is `medium` scaled 1.5x. `Button` picks it automatically for `size="large"`, whose 48px height makes the default loader read as undersized; every shorter button size keeps `medium`.',
    },
  },
};

const AnnouncedTemplate: StoryFn<typeof DotLoaderComponent> = () => {
  return <DotLoaderComponent accessibilityLabel="Loading results" />;
};

export const Announced = AnnouncedTemplate.bind({});
Announced.storyName = 'With accessibility label';
Announced.parameters = {
  docs: {
    description: {
      story:
        'When `accessibilityLabel` is passed the loader is exposed as a `status` region. Leave it unset inside components that already announce loading, like `Button`, to avoid duplicate screen reader output.',
    },
  },
};
