import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';

import type { CollapsibleProps } from './Collapsible';
import { Collapsible as CollapsibleComponent } from './Collapsible';
import { CollapsibleButton } from './CollapsibleButton';
import { CollapsibleBody } from './CollapsibleBody';
import { CollapsibleLink } from './CollapsibleLink';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Text } from '~components/Typography';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Collapsible"
      componentDescription="Collapsible is used to allow users to toggle the visibility of hidden content within a container."
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/LSG77hEeVYDk7j7WV7OMJE/Blade-DSL---Components-Guideline?type=design&node-id=79-629874&t=sVxH3DOnx3L3F9rO-0',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?type=design&node-id=16868-832623&t=rK6ydo54uVejIH9p-0',
      }}
    >
      <Title>Usage</Title>
      <Sandbox editorHeight={500}>
        {`
        import { Collapsible, CollapsibleButton, CollapsibleBody, Text } from '@razorpay/blade/components';

        function App() {
          return (
            <Collapsible>
              <CollapsibleButton>Answer to life, universe and everything</CollapsibleButton>
              <CollapsibleBody>
                <Text>42</Text>
              </CollapsibleBody>
            </Collapsible>
          )
        }

        export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

// TODO: Change this story from internal when releasing
const meta: Meta<CollapsibleProps> = {
  title: 'Components/Collapsible (Internal)',
  component: CollapsibleComponent,
  args: {},
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
};

const CollapsibleButtonTemplate: ComponentStory<typeof CollapsibleComponent> = ({ ...args }) => {
  return (
    <CollapsibleComponent {...args}>
      <CollapsibleButton>Greatest song ever</CollapsibleButton>
      <CollapsibleBody>
        <Text>And as we wind on down the road</Text>
        <Text>Our shadows taller than our soul</Text>
        <Text>There walks a lady we all know</Text>
        <Text>Who shines white light and wants to show</Text>
        <Text>How everything still turns to gold</Text>
        <Text>And if you listen very hard</Text>
        <Text>The tune will come to you at last</Text>
        <Text>When all are one, and one is all</Text>
        <Text>To be a rock and not to roll</Text>
      </CollapsibleBody>
    </CollapsibleComponent>
  );
};

const CollapsibleLinkTemplate: ComponentStory<typeof CollapsibleComponent> = ({ ...args }) => {
  return (
    <CollapsibleComponent {...args}>
      <CollapsibleLink>Answer to life, universe and everything</CollapsibleLink>
      <CollapsibleBody>
        <Text>42</Text>
      </CollapsibleBody>
    </CollapsibleComponent>
  );
};

export const WithCollapsibleButton = CollapsibleButtonTemplate.bind({});

export const WithCollapsibleLink = CollapsibleLinkTemplate.bind({});

export default meta;
