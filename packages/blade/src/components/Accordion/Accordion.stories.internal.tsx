import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';

import type { AccordionProps } from './Accordion';
import { Accordion as AccordionComponent } from './Accordion';
import { AccordionItem } from './AccordionItem';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

// TODO: udpate
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
const meta: Meta<AccordionProps> = {
  title: 'Components/Accordion (Internal)',
  component: AccordionComponent,
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

const AccordionTemplate: ComponentStory<typeof AccordionComponent> = ({ ...args }) => {
  return (
    <AccordionComponent {...args}>
      <AccordionItem title="Title" description="description" />
    </AccordionComponent>
  );
};

export const WithCollapsibleButton = AccordionTemplate.bind({});

export default meta;
