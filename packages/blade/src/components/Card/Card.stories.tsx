import type { ComponentStory, Meta } from '@storybook/react';
import type { CardProps } from './Card';
import {
  CardBody,
  Card,
  CardFooter,
  CardFooterLeading,
  CardFooterTrailing,
  CardHeader,
  CardHeaderLeading,
  CardHeaderTrailing,
  CardHeaderIcon,
  CardHeaderCounter,
  CardHeaderBadge,
  CardHeaderIconButton,
} from './Card';

import { Text } from '~components/Typography';
import { InfoIcon, TrashIcon } from '~components/Icons';

export default {
  title: 'Components/Card',
  component: Card,
  parameters: {},
  argTypes: {
    backgroundLevel: {
      defaultValue: 2,
    },
  },
} as Meta<CardProps>;

const CardTemplate: ComponentStory<typeof Card> = ({ ...args }) => {
  return (
    <Card {...args}>
      <CardHeader>
        <CardHeaderLeading
          title="Card Header"
          subtitle="Subtitle"
          prefix={<CardHeaderIcon icon={InfoIcon} />}
          suffix={<CardHeaderCounter value={12} />}
        />
        <CardHeaderTrailing visual={<CardHeaderBadge variant="positive">NEW</CardHeaderBadge>} />
      </CardHeader>
      <CardBody>
        <Text>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry's standard dummy text ever since the 1500s, when an unknown printer took
          a galley of type and scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting, remaining essentially
          unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
          Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
          PageMaker including versions of Lorem Ipsum.
        </Text>
      </CardBody>
      <CardFooter>
        <CardFooterLeading title="Card footer title" subtitle="Subtitle" />
        <CardFooterTrailing
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
      </CardFooter>
    </Card>
  );
};

export const CardExample = CardTemplate.bind({});
CardExample.args = {
  surfaceLevel: 2,
};

const CardHeaderTemplate: ComponentStory<typeof Card> = ({ ...args }) => {
  return (
    <Card {...args}>
      <CardHeader>
        <CardHeaderLeading
          title="Card Header"
          subtitle="Subtitle"
          prefix={<CardHeaderIcon icon={InfoIcon} />}
          suffix={<CardHeaderCounter value={12} />}
        />
        <CardHeaderTrailing
          visual={
            <CardHeaderIconButton
              icon={TrashIcon}
              accessibilityLabel="Delete Card"
              onClick={() => {
                console.log(1);
              }}
            />
          }
        />
      </CardHeader>
      <CardBody>
        <Text>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry's standard dummy text ever since the 1500s, when an unknown printer took
          a galley of type and scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting, remaining essentially
          unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
          Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
          PageMaker including versions of Lorem Ipsum.
        </Text>
      </CardBody>
      <CardFooter>
        <CardFooterLeading title="Card footer title" subtitle="Subtitle" />
        <CardFooterTrailing
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
      </CardFooter>
    </Card>
  );
};

export const CardWithHeader = CardHeaderTemplate.bind({});
