import React from 'react';
import type { DOMAttributes } from 'react';
import type { Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { TagProps } from './Tag';
import { Tag } from './Tag';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { TextInput } from '~components/Input/TextInput';
import { isReactNative } from '~utils';
import { PlusIcon } from '~components/Icons';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=28435%3A581488',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=15234%3A480939',
      }}
      componentName="Tags"
      componentDescription="These are set of interactive keywords that help organise & categorise objects. Tags can be added or removed from an object by the users."
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { Tag } from '@razorpay/blade/components';
        
        function App(): JSX.Element {
          return (
            <Tag onDismiss={({ value }) => console.log('Tag dismissed', value)}>
              Unpaid
            </Tag>
          )
        }

        export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Tag',
  component: Tag,
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<TagProps>;

export const Default = (props: TagProps): React.ReactElement => <Tag {...props} />;

Default.args = {
  children: 'Unpaid',
  onDismiss: ({ value }) => console.log('dismiss tag', value),
} as TagProps;

const CrossPlatformForm = ({
  children,
  onSubmit,
}: {
  children: React.ReactElement[];
  onSubmit: DOMAttributes<HTMLFormElement>['onSubmit'];
}): React.ReactElement => {
  if (isReactNative()) {
    return <Box>{children}</Box>;
  }

  return <form onSubmit={onSubmit}>{children}</form>;
};

export const ControlledTags = (props: TagProps): React.ReactElement => {
  const [inputValue, setInputValue] = React.useState('');
  const [tags, setTags] = React.useState<string[]>([]);

  const addTag = (): void => {
    // Add input value to tags and clear the input value
    setTags([...tags, inputValue]);
    setInputValue('');
  };

  const removeTag = (tagName: TagProps['children']): void => {
    setTags(tags.filter((tagNameValue) => tagNameValue !== tagName));
  };

  return (
    <Box>
      <Box paddingY="spacing.4">
        {tags.map((tagName) => (
          <Tag
            key={tagName}
            {...props}
            marginLeft="spacing.2"
            onDismiss={({ value }) => removeTag(value)}
          >
            {tagName}
          </Tag>
        ))}
      </Box>
      <Box>
        <CrossPlatformForm
          onSubmit={(e) => {
            e.preventDefault();
            addTag();
          }}
        >
          <TextInput
            label="Tag Label"
            value={inputValue}
            onChange={({ value }) => setInputValue(value ?? '')}
            {...{ onSubmit: isReactNative() ? () => addTag() : undefined }}
          />
          <Button
            icon={PlusIcon}
            iconPosition="right"
            variant="secondary"
            marginTop="spacing.2"
            type="submit"
          >
            Create Tag
          </Button>
        </CrossPlatformForm>
      </Box>
    </Box>
  );
};
