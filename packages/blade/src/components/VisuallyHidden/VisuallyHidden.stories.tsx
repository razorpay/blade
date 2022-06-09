import type { ComponentStory, Meta } from '@storybook/react';
import {
  Title as StorybookTitle,
  Subtitle,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from '@storybook/addon-docs';
import { Highlight } from '@storybook/design-system';
import type { ReactElement } from 'react';
import type { VisuallyHiddenProps } from './VisuallyHidden';
import VisuallyHiddenComponent from './VisuallyHidden';

const Page = (): ReactElement => {
  return (
    <>
      <StorybookTitle />
      <Subtitle>
        The VisuallyHidden component makes content hidden from sighted users but available for
        screen reader users
      </Subtitle>
      <br />
      <br />
      <StorybookTitle>Usage</StorybookTitle>
      <Highlight language="tsx">{`import { VisuallyHidden } from '@razorpay/blade/components' \nimport type { VisuallyHiddenProps } from '@razorpay/blade/components'`}</Highlight>
      <StorybookTitle>Example</StorybookTitle>
      <Primary />
      <StorybookTitle>Properties</StorybookTitle>
      <ArgsTable story={PRIMARY_STORY} />
      <Stories />
    </>
  );
};

const VisuallyHiddenStoryMeta: Meta<VisuallyHiddenProps> = {
  title: 'Components/Accessibility/VisuallyHidden',
  component: VisuallyHiddenComponent,
  args: { children: 'Visually hidden content' },
  parameters: {
    docs: {
      page: () => <Page />,
    },
  },
};

const VisuallyHiddenTemplate: ComponentStory<typeof VisuallyHiddenComponent> = () => {
  return (
    <>
      <VisuallyHiddenComponent>
        <label htmlFor="darkmode">Toggle dark mode</label>
      </VisuallyHiddenComponent>
      <input id="darkmode" type="checkbox" />
    </>
  );
};

export default VisuallyHiddenStoryMeta;
export const VisuallyHidden = VisuallyHiddenTemplate.bind({});
