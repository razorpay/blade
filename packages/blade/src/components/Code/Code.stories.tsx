import type { StoryFn, Meta } from '@storybook/react';
import { Title, Description, Heading } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import { Code as CodeComponent } from './Code';
import { Box } from '../Box';
import { Text } from '../Typography';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';

// Simple JSON example
const jsonExample = `{
  "name": "John Doe",
  "age": 30,
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zip": "12345"
  }
}`;

// Simple Protobuf example
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
}`;

// JavaScript example
const javascriptExample = `function calculateTotal(items) {
  return items
    .filter(item => item.price > 0)
    .map(item => item.price * item.quantity)
    .reduce((total, price) => total + price, 0);
}

// Example usage
const cart = [
  { id: 1, name: 'Product 1', price: 10, quantity: 2 },
  { id: 2, name: 'Product 2', price: 15, quantity: 1 },
  { id: 3, name: 'Product 3', price: 20, quantity: 3 }
];

const total = calculateTotal(cart);
console.log(\`Total: \${total}\`); // Output: Total: 95`;

// TypeScript example
const typescriptExample = `interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

class UserService {
  private users: User[] = [];
  
  constructor() {}
  
  public addUser(user: User): void {
    this.users.push(user);
  }
  
  public getActiveUsers(): User[] {
    return this.users.filter(user => user.isActive);
  }
}

// Example usage
const service = new UserService();
service.addUser({ id: 1, name: 'John', email: 'john@example.com', isActive: true });
service.addUser({ id: 2, name: 'Jane', email: 'jane@example.com', isActive: false });
const activeUsers = service.getActiveUsers();`;

export default {
  title: 'Components/Code',
  component: CodeComponent,
  parameters: {
    docs: {
      description: {
        component: `
## Code Component

A component for displaying code snippets with syntax highlighting.

### Features
- Syntax highlighting for various languages including JSON, JavaScript, TypeScript, Protobuf, and more
- Line numbers option
- Different size options
- Custom styling options
- Preserves whitespace and formatting
        `
      }
    }
  },
  argTypes: {
    language: {
      control: 'select',
      options: ['json', 'javascript', 'typescript', 'protobuf', 'text'],
      description: 'The language for syntax highlighting'
    },
    lang: {
      control: 'select',
      options: ['json', 'javascript', 'typescript', 'protobuf', 'text'],
      description: 'Alternative prop for language'
    },
    showLineNumbers: {
      control: 'boolean',
      description: 'Whether to show line numbers'
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Size of the code text'
    },
    weight: {
      control: 'select',
      options: ['regular', 'medium', 'semibold', 'bold'],
      description: 'Font weight of the code text'
    },
    isHighlighted: {
      control: 'boolean',
      description: 'Whether to apply syntax highlighting'
    },
    color: {
      control: 'text',
      description: 'Custom text color (only applies when isHighlighted is false)'
    }
  }
} as Meta<typeof CodeComponent>;

// Documentation page
const DocsPage = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="The Code component is used to display code snippets with syntax highlighting."
      componentName="Code"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { Code } from '@razorpay/blade/components';
        
        function App() {
          return (
            <Code 
              language="json" 
              showLineNumbers={true}
            >
              {${JSON.stringify(jsonExample)}}
            </Code>
          );
        }

        export default App;
      `}
      </Sandbox>

      <Heading>Language Support</Heading>
      <Description>
        The Code component supports various languages for syntax highlighting, including JSON, JavaScript, TypeScript, Protobuf, and more.
      </Description>

      <Box marginTop="spacing.4">
        <Text size="medium" weight="semibold" marginBottom="spacing.2">JSON Example</Text>
        <CodeComponent language="json" showLineNumbers={true}>
          {jsonExample}
        </CodeComponent>
      </Box>

      <Box marginTop="spacing.4">
        <Text size="medium" weight="semibold" marginBottom="spacing.2">Protobuf Example</Text>
        <CodeComponent language="protobuf" showLineNumbers={true} size="medium">
          {protobufExample}
        </CodeComponent>
      </Box>

      <Heading>Customization Options</Heading>
      <Description>
        The Code component offers various customization options, including size, line numbers, and custom styling.
      </Description>

      <Box marginTop="spacing.4">
        <Text size="medium" weight="semibold" marginBottom="spacing.2">Custom Styling</Text>
        <CodeComponent
          language="json"
          isHighlighted={false}
          color="interactive.text.positive.subtle"
          weight="bold"
        >
          {`{ "success": true, "message": "Operation completed successfully" }`}
        </CodeComponent>
      </Box>
    </StoryPageWrapper>
  );
};

export const Docs = DocsPage;

export const WithLineNumbers = () => (
  <CodeComponent language="json" showLineNumbers={true}>
    {jsonExample}
  </CodeComponent>
);

export const WithSyntaxHighlighting = () => (
  <CodeComponent language="protobuf" showLineNumbers={true}>
    {protobufExample}
  </CodeComponent>
);

export const MediumSize = () => (
  <CodeComponent language="javascript" showLineNumbers={true} size="medium">
    {javascriptExample}
  </CodeComponent>
);

export const WithoutPadding = () => (
  <Box backgroundColor="surface.background.gray.subtle" borderRadius="medium" padding="spacing.0">
    <CodeComponent language="json" showLineNumbers={true}>
      {jsonExample}
    </CodeComponent>
  </Box>
);

export const CustomStyling = () => (
  <CodeComponent
    language="json"
    isHighlighted={false}
    color="interactive.text.positive.subtle"
    weight="bold"
  >
    {`{ "success": true, "message": "Operation completed successfully" }`}
  </CodeComponent>
); 