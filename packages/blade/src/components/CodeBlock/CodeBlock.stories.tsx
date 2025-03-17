import React from 'react';
import { Card, CardBody } from '~components/Card';
import { StoryFn, Meta } from '@storybook/react';
import { CodeBlock } from './CodeBlock';
import { Title } from '@storybook/addon-docs';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';

// Documentation page component
const Page = (): React.ReactElement => {
    return (
        <StoryPageWrapper
            componentName="CodeBlock"
            componentDescription="CodeBlock is a component used to display and highlight code snippets with proper syntax highlighting. It automatically adapts to the current theme (light or dark) using GitHub-like syntax highlighting colors."
            figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL"
        >
            <Title>Usage</Title>
            <Sandbox editorHeight={500}>
                {`
import React from 'react';
import { CodeBlock } from '@razorpay/blade/components';

function App() {
  // Sample JSON data
  const jsonExample = \`{
  "name": "John Doe",
  "age": 30,
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "Anytown"
  },
  "tags": ["developer", "designer"]
}\`;

  return (
    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3>JSON Example with Line Numbers (Default)</h3>
        <CodeBlock lang="json">
          {jsonExample}
        </CodeBlock>
      </div>
      
      <div>
        <h3>JSON Example without Line Numbers</h3>
        <CodeBlock lang="json" showLineNumbers={false}>
          {jsonExample}
        </CodeBlock>
      </div>
      
      <div>
        <h3>JSON Example without Background</h3>
        <CodeBlock lang="json" showBackground={false}>
          {jsonExample}
        </CodeBlock>
      </div>
    </div>
  );
}

export default App;
                `}
            </Sandbox>
        </StoryPageWrapper>
    );
};

export default {
    title: 'Components/CodeBlock',
    component: CodeBlock,
    parameters: {
        docs: {
            page: Page,
        },
    },
    tags: ['autodocs'],
} as Meta<typeof CodeBlock>;

export const JsonExample: StoryFn = () => {
    const jsonExample = `{
  "name": "John Doe",
  "age": 30,
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "zipCode": 12345
  },
  "tags": ["developer", "designer", "product"],
  "projects": null
}`;

    return (
        <CodeBlock lang="json">{jsonExample}</CodeBlock>
    );
};

JsonExample.storyName = 'JSON';

export const ProtobufExample: StoryFn = () => {
    const protobufExample = `syntax = "proto3";

package example;

// User profile information
message User {
  string name = 1;
  int32 age = 2;
  bool is_active = 3;
  
  enum Role {
    ADMIN = 0;
    MEMBER = 1;
    GUEST = 2;
  }
  
  Role role = 4;
  
  message Address {
    string street = 1;
    string city = 2;
    int32 zip_code = 3;
  }
  
  Address address = 5;
  repeated string tags = 6;
}

service UserService {
  rpc GetUser(GetUserRequest) returns (User);
  rpc ListUsers(ListUsersRequest) returns (stream User);
}`;

    return (
        <CodeBlock lang="protobuf">{protobufExample}</CodeBlock>
    );
};

ProtobufExample.storyName = 'Protobuf';

export const WithoutBackground: StoryFn = () => {
    const jsonExample = `{
  "name": "John Doe",
  "age": 30,
  "isActive": true
}`;

    return (
        <CodeBlock lang="json" showBackground={false}>{jsonExample}</CodeBlock>
    );
};

WithoutBackground.storyName = 'Without Background';

export const WithoutLineNumbers: StoryFn = () => {
    const jsonExample = `{
  "name": "John Doe",
  "age": 30,
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "zipCode": 12345
  }
}`;

    return (
        <CodeBlock lang="json" showLineNumbers={false}>{jsonExample}</CodeBlock>
    );
};

WithoutLineNumbers.storyName = 'Without Line Numbers'; 