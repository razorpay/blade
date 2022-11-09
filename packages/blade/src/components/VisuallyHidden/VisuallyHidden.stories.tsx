/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ComponentStory, Meta } from '@storybook/react';
import {
  Title as StorybookTitle,
  Subtitle,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from '@storybook/addon-docs';
import { Link } from '@storybook/design-system';
import type { ReactElement } from 'react';
import { VisuallyHidden as VisuallyHiddenComponent } from './VisuallyHidden';
import type { VisuallyHiddenProps } from './types';
import { Checkbox } from '~components/Checkbox';
import { Text } from '~components/Typography';
import Sandbox from '~src/_helpers/storybook/Sandbox';

const Page = (): ReactElement => {
  return (
    <>
      <StorybookTitle />
      <Subtitle>
        The VisuallyHidden component makes content hidden from sighted users but available for
        screen reader users.
      </Subtitle>
      <Link
        withArrow={true}
        href="https://github.com/razorpay/blade/blob/anu/a11y-rfc/rfcs/2022-04-09-accessibility.md#hidden-content"
        target="_blank"
        rel="noreferrer noopener"
      >
        See Hidden Content RFC
      </Link>
      <br />
      <br />
      <StorybookTitle>Usage</StorybookTitle>
      <Sandbox>
        {`
          import { VisuallyHidden, Checkbox, Text } from '@razorpay/blade/components';

          function App(): JSX.Element {
            return (
              <div>
                <Text>If you focus on checkbox below with voice over enabled, you will hear "Hidden Label" announcement</Text>
                <Checkbox><VisuallyHidden>Hidden Label</VisuallyHidden></Checkbox>
              </div>
            )
          }

          export default App;
        `}
      </Sandbox>
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
  args: { children: 'Toggle dark mode' },
  parameters: {
    docs: {
      page: () => <Page />,
    },
  },
};

const VisuallyHiddenTemplate: ComponentStory<typeof VisuallyHiddenComponent> = (args) => {
  return (
    <>
      <Text>
        Enable voiceover and focus on the checkbox to hear its invisible label. You should be able
        to hear "Toggle dark mode" when focused on the checkbox.
      </Text>
      <Checkbox>
        {/* @ts-expect-error checkbox label only accepts string, this is just for demo */}
        <VisuallyHiddenComponent>{args.children}</VisuallyHiddenComponent>
      </Checkbox>
    </>
  );
};

export default VisuallyHiddenStoryMeta;
export const VisuallyHidden = VisuallyHiddenTemplate.bind({});
