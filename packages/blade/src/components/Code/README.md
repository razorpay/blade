# Code Component

The Code component is used to display code snippets with syntax highlighting. It supports various programming languages, including JSON and Protobuf.

## Features

- Syntax highlighting for different programming languages
- Line numbers option
- Customizable size and font weight
- Background highlighting toggle
- Custom color options when highlighting is disabled

## Installation

```bash
# If you're using the Blade component library
import { Code } from '@razorpay/blade/components';
```

## Usage

### Basic Usage

```jsx
import { Code } from '@razorpay/blade/components';

function App() {
  return (
    <Code language="json">
      {`{
        "name": "John Doe",
        "age": 30,
        "isActive": true
      }`}
    </Code>
  );
}
```

### With Line Numbers

```jsx
<Code 
  language="json" 
  showLineNumbers={true}
>
  {`{
    "name": "John Doe",
    "age": 30,
    "isActive": true
  }`}
</Code>
```

### Protobuf Example

```jsx
<Code language="protobuf">
  {`syntax = "proto3";

package example;

message Person {
  string name = 1;
  int32 age = 2;
  bool is_active = 3;
}`}
</Code>
```

### Without Background Highlighting

```jsx
<Code 
  language="json" 
  isHighlighted={false}
  color="interactive.text.positive.subtle"
>
  {`{ "success": true, "message": "Operation completed successfully" }`}
</Code>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | string | - | The code to be highlighted |
| `language` | string | 'text' | The programming language of the code |
| `showLineNumbers` | boolean | false | Whether to show line numbers |
| `size` | 'small' \| 'medium' | 'small' | The size of the code block |
| `weight` | 'regular' \| 'bold' | 'regular' | Font weight for the code |
| `isHighlighted` | boolean | true | Whether to highlight the entire code block with a background |
| `theme` | 'default' \| 'dark' \| string | 'default' | Custom theme for syntax highlighting |
| `color` | string | - | Color of the text when isHighlighted is false |

## Examples

### JSON Example with Line Numbers

```
┌─────────────────────────────────────────────────────────┐
│ 1│ {                                                    │
│ 2│   "name": "John Doe",                               │
│ 3│   "age": 30,                                        │
│ 4│   "isActive": true,                                 │
│ 5│   "address": {                                      │
│ 6│     "street": "123 Main St",                        │
│ 7│     "city": "Anytown",                              │
│ 8│     "state": "CA",                                  │
│ 9│     "zip": "12345"                                  │
│10│   },                                                │
│11│   "tags": ["developer", "designer", "product"]      │
│12│ }                                                   │
└─────────────────────────────────────────────────────────┘
```

### Protobuf Example

```
┌─────────────────────────────────────────────────────────┐
│ syntax = "proto3";                                      │
│                                                         │
│ package example;                                        │
│                                                         │
│ message Person {                                        │
│   string name = 1;                                      │
│   int32 age = 2;                                        │
│   bool is_active = 3;                                   │
│                                                         │
│   enum PhoneType {                                      │
│     MOBILE = 0;                                         │
│     HOME = 1;                                           │
│     WORK = 2;                                           │
│   }                                                     │
│                                                         │
│   message PhoneNumber {                                 │
│     string number = 1;                                  │
│     PhoneType type = 2;                                 │
│   }                                                     │
│                                                         │
│   repeated PhoneNumber phones = 4;                      │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
```

### Non-Highlighted Example with Custom Color

```
┌─────────────────────────────────────────────────────────┐
│ { "success": true, "message": "Operation completed successfully" } │
└─────────────────────────────────────────────────────────┘
```

## Color Legend

In the actual rendered component, different parts of the code would be colored differently:

- **Property names**: Blue (e.g., "name", "age")
- **Strings**: Green (e.g., "John Doe")
- **Numbers and Booleans**: Purple (e.g., 30, true)
- **Punctuation**: Gray (e.g., {, }, :, ,)
- **Keywords**: Blue (e.g., syntax, package, message)
- **Class names**: Red (e.g., Person, PhoneType) 