import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import { Code as CodeComponent } from './Code';
import BaseBox from '~components/Box/BaseBox';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const jsonExample = `{
  "name": "John Doe",
  "age": 30,
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zip": "12345"
  },
  "tags": ["developer", "designer", "product"]
}`;

const protobufExample = `syntax = "proto3";

package example;

message Person {
  string name = 1;
  int32 age = 2;
  bool is_active = 3;
  
  enum PhoneType {
    MOBILE = 0;
    HOME = 1;
    WORK = 2;
  }
  
  message PhoneNumber {
    string number = 1;
    PhoneType type = 2;
  }
  
  repeated PhoneNumber phones = 4;
}

service PersonService {
  rpc GetPerson (GetPersonRequest) returns (Person);
}

message GetPersonRequest {
  string name = 1;
}`;

const Page = (): ReactElement => {
    return (
        <StoryPageWrapper
            componentDescription="Code component can be used for displaying code with syntax highlighting."
            componentName="Code"
            apiDecisionLink="https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Typography/_decisions/decisions.md"
        >
            <Title>Usage</Title>
            <Sandbox>
                {`
          import { Code } from '@razorpay/blade/components';

          function App() {
            // You can use either 'language' or 'lang' prop
            return (
              <Code language="json">
              {\`{
                "name": "John Doe",
                "age": 30,
                "isActive": true
              }\`}
              </Code>
            )
          }

          export default App;
        `}
            </Sandbox>

            <Title>Alternative Syntax</Title>
            <Sandbox>
                {`
          import { Code } from '@razorpay/blade/components';

          function App() {
            // Using 'lang' prop for better DX
            return (
              <Code lang="protobuf">
              {\`syntax = "proto3";
              
              message Person {
                string name = 1;
                int32 age = 2;
              }\`}
              </Code>
            )
          }

          export default App;
        `}
            </Sandbox>
        </StoryPageWrapper>
    );
};

const CodeStoryMeta: Meta = {
    title: 'Components/Code',
    component: CodeComponent,
    args: {
        size: 'small',
        weight: 'regular',
        children: jsonExample,
        language: 'json',
        isHighlighted: true,
        showLineNumbers: false,
        theme: 'default',
    },
    parameters: {
        docs: {
            page: () => <Page />,
        },
    },
    tags: ['autodocs'],
    argTypes: {
        ...getStyledPropsArgTypes(),
        language: {
            control: 'select',
            options: ['json', 'protobuf', 'text'],
        },
        lang: {
            control: 'select',
            options: ['json', 'protobuf', 'text'],
        },
        theme: {
            control: 'select',
            options: ['default', 'dark'],
        },
    },
};

const CodeTemplate: StoryFn<typeof CodeComponent> = (args) => (
    <BaseBox maxWidth="600px">
        <CodeComponent {...args} />
    </BaseBox>
);

export default CodeStoryMeta;
export const Code = CodeTemplate.bind({});

export const WithLineNumbers = CodeTemplate.bind({});
WithLineNumbers.args = {
    showLineNumbers: true,
};

export const JsonExample = CodeTemplate.bind({});
JsonExample.args = {
    language: 'json',
    children: jsonExample,
};

export const ProtobufExample = CodeTemplate.bind({});
ProtobufExample.args = {
    lang: 'protobuf',
    children: protobufExample,
};

export const SizeMedium = CodeTemplate.bind({});
SizeMedium.args = {
    size: 'medium',
};

export const NonHighlighted = CodeTemplate.bind({});
NonHighlighted.args = {
    isHighlighted: false,
};

export const CustomColor = CodeTemplate.bind({});
CustomColor.args = {
    isHighlighted: false,
    color: 'interactive.text.positive.subtle',
};

export const WithBoldText = CodeTemplate.bind({});
WithBoldText.args = {
    weight: 'bold',
}; 