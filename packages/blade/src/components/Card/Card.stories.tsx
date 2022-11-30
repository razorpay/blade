import type { ComponentStory, Meta } from '@storybook/react';
import type { CardProps } from './Card';
import { Card as CardComponent } from './Card';
import { Text } from '~components/Typography';
import { InfoIcon } from '~components/Icons';
import { Counter } from '~components/Counter';
import { Badge } from '~components/Badge';

export default {
  title: 'Components/Card',
  component: CardComponent,
  parameters: {},
  argTypes: {
    backgroundLevel: {
      defaultValue: 2,
    },
  },
} as Meta<CardProps>;

const CardTemplate: ComponentStory<typeof CardComponent> = ({ ...args }) => {
  return (
    <CardComponent {...args}>
      <CardComponent.Body>
        <Text>Hello world</Text>
      </CardComponent.Body>
      <CardComponent.Footer
        title="Card footer title"
        subtitle="Subtitle"
        actions={{
          primary: {
            onClick: () => console.log(1),
            text: 'Accept',
          },
          secondary: {
            onClick: () => console.log(1),
            text: 'Cancel',
          },
        }}
      />
    </CardComponent>
  );
};

export const Card = CardTemplate.bind({});
Card.args = {
  backgroundLevel: 2,
};

const CardHeaderTemplate: ComponentStory<typeof CardComponent> = ({ ...args }) => {
  return (
    <CardComponent {...args}>
      <CardComponent.Header
        title="Card Header"
        subtitle="Subtitle"
        titlePrefix={<InfoIcon color="surface.text.normal.lowContrast" size="xlarge" />}
        titleSuffix={<Counter value={12} />}
        trailingVisual={<Badge variant="positive">NEW</Badge>}
      />
      <CardComponent.Body>
        <Text>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry's standard dummy text ever since the 1500s, when an unknown printer took
          a galley of type and scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting, remaining essentially
          unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
          Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
          PageMaker including versions of Lorem Ipsum.
        </Text>
      </CardComponent.Body>
      <CardComponent.Footer
        title="Card footer title"
        subtitle="Subtitle"
        actions={{
          primary: {
            onClick: () => console.log(1),
            text: 'Accept',
          },
          secondary: {
            onClick: () => console.log(1),
            text: 'Cancel',
          },
        }}
      />
    </CardComponent>
  );
};

export const CardWithHeader = CardHeaderTemplate.bind({});
