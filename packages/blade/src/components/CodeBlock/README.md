# CodeBlock

CodeBlock is a component used to display and highlight code snippets with proper syntax highlighting.

## Usage

```tsx
import { CodeBlock } from '@razorpay/blade';

// JSON Example
<CodeBlock lang="json">
{`
{
  "name": "John Doe",
  "age": 30,
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "Anytown"
  }
}
`}
</CodeBlock>

// Protobuf Example
<CodeBlock lang="protobuf">
{`
syntax = "proto3";

package example;

// User profile information
message User {
  string name = 1;
  int32 age = 2;
  bool is_active = 3;
}
`}
</CodeBlock>

// Without Background
<CodeBlock lang="json" showBackground={false}>
{`{"name": "John Doe"}`}
</CodeBlock>
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| children | string | - | The code content to display and highlight |
| lang | 'json' \| 'protobuf' | 'json' | The language for syntax highlighting |
| showBackground | boolean | true | Whether to show a background color |
| testID | string | - | Test ID for testing frameworks |

## Theme Support

CodeBlock automatically adapts to the current theme (light or dark) using the Blade design system's theme variables. The syntax highlighting colors are derived from the theme's color palette to ensure consistency across the application.

- In light theme: Syntax highlighting provides clear distinction between different code elements with appropriate contrast
- In dark theme: Colors are adjusted automatically to maintain readability while reducing eye strain

## Accessibility

CodeBlock uses semantic HTML elements and appropriate styling to ensure good contrast for code syntax highlighting in both light and dark themes. The component maintains WCAG compliance for text contrast ratios.

## Guidelines

- Use CodeBlock when you need to present code snippets to users
- Always provide meaningful and properly formatted code for better readability
- Consider using the `showBackground` prop to visually separate the code from surrounding content
- Ensure the code is syntactically correct for the selected language
- For long code snippets, consider using CodeBlock within a scrollable container

## Examples

### JSON Example

A simple JSON object with syntax highlighting:

```tsx
<Card>
  <CardBody>
    <CodeBlock lang="json">
    {`
    {
      "name": "John Doe",
      "age": 30,
      "isActive": true,
      "hobbies": ["Reading", "Hiking", "Coding"],
      "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "zipCode": 12345
      }
    }
    `}
    </CodeBlock>
  </CardBody>
</Card>
```

### Protobuf Example

A Protobuf definition with syntax highlighting:

```tsx
<Card>
  <CardBody>
    <CodeBlock lang="protobuf">
    {`
    syntax = "proto3";

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
    }

    service UserService {
      rpc GetUser(GetUserRequest) returns (User);
    }
    `}
    </CodeBlock>
  </CardBody>
</Card>
```

### Without Background

Code without background styling:

```tsx
<Card>
  <CardBody>
    <CodeBlock lang="json" showBackground={false}>
    {`
    {
      "name": "John Doe",
      "age": 30,
      "isActive": true
    }
    `}
    </CodeBlock>
  </CardBody>
</Card>
```

### Server-Side Rendering

CodeBlock works seamlessly with server-side rendering (SSR). Here's an example of using CodeBlock in a server-rendered Next.js application:

```tsx
// pages/api-docs.tsx
import { CodeBlock } from '@razorpay/blade';
import { GetServerSideProps } from 'next';

// Example API response
const apiResponseExample = {
  status: "success",
  data: {
    user: {
      id: "usr_123456",
      name: "John Doe",
      email: "john@example.com",
      created_at: "2023-01-15T08:30:00Z"
    }
  }
};

export default function ApiDocsPage() {
  return (
    <div className="container">
      <h1>API Documentation</h1>
      
      <h2>Example Response</h2>
      <CodeBlock lang="json">
        {JSON.stringify(apiResponseExample, null, 2)}
      </CodeBlock>
      
      <h2>Example Protobuf Definition</h2>
      <CodeBlock lang="protobuf">
      {`syntax = "proto3";

package api;

message User {
  string id = 1;
  string name = 2;
  string email = 3;
  string created_at = 4;
}

message ApiResponse {
  string status = 1;
  User user = 2;
}`}
      </CodeBlock>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // You can fetch data here if needed
  return {
    props: {}
  };
}; 