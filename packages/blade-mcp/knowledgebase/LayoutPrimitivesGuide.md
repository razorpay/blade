# Layout Primitives

Layout Primitives from Blade. Use this for adding spacings, grids, and any of your layout needs.

## Examples

## Playground

This example demonstrates the basic usage of the `Box` component, including how to render it as a different HTML tag and apply different layout properties such as `display`, `flexDirection`, and `padding`.

To make this example:
- Use the `as` prop to render the `Box` as a `<section>` tag.
- Apply `display="flex"` to use flexbox.
- Use responsive props for `flexDirection` and `padding`.

```jsx
import { Box, Text } from '@razorpay/blade/components';

function App(): React.ReactElement {
  return (
    <Box 
      as="section" // renders as <section> tag instead of <div>
      display="flex"
      flexDirection={{ base: 'column', m: 'row' }}
      padding={{ base: ['spacing.1', '9px'], m: 'spacing.3' }}
    >
      <Box 
        backgroundColor="surface.background.cloud.intense" 
        flex="1" 
      >
        <Text margin="spacing.4" color="surface.text.onCloud.onIntense">Box1</Text>
      </Box>
      <Box 
        backgroundColor="surface.background.sea.intense" 
        flex="1" 
      >
        <Text margin="spacing.4" color="surface.text.onSea.onIntense">Box2</Text>
      </Box>
    </Box>
  );
}

export default App;
```

Check out our [Simple Dashboard Recipe](https://example.com) for a real-world example on Box usage.

## 📦 Box Usage

Box is a primitive Layout component which can be used for creating different responsive layouts in UI. You might have used `Box` in other component libraries as well such as [Chakra](https://chakra-ui.com/docs/components/box). Our Box is similar, except it's primarily focused on layout properties and works on all platforms.

The simplest Box usage would look something like this:

```jsx
<Box>Hello</Box>
// This will translate to:
// On Web          -> <div>Hello</div> 
// On React Native -> <View>Hello</View>
```

## ↔️ Adding Margin and Padding

To see how adding margin and padding works, uncomment the code within the example below.

```jsx
import { Box, Text } from '@razorpay/blade/components';

function App(): React.ReactElement {
  return (
    <>
      <Box 
        // Uncomment next lines to see padding and margin in action
        // padding="spacing.4"
        // marginTop="32px"
        backgroundColor="surface.background.gray.intense"
      >
        <Text>Some Text</Text>
      </Box>
      {/*
        <Box
          // Uncomment this block to see padding shorthands in action
          padding={["spacing.3", "35px"]} // We also support padding and margin shorthands similar to CSS
          marginX="spacing.5" // adds horizontal margin
          backgroundColor='surface.background.gray.moderate'
        >
          <Text>More Text</Text>
        </Box>
      */}
    </>
  );
}

export default App;
```

Blade supports multiple props like `padding`, `paddingX`, `paddingY`, `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft` and similar props with `margin`. These props can have values such as `spacing.3` (Our tokens), `132px` (absolute values), `auto`.

## Responsive Props 📱 🖥

Our responsive props allow you to define responsive layouts with ease. Check out how the code renders differently on screens when `{ base: 'column', m: 'row' }` is used.

To create this example:
- Use responsive props for `display` and `flexDirection`.

```jsx
import { Box, Text } from '@razorpay/blade/components';

function App(): React.ReactElement {
  return (
    <>
      <Box display={{ base: 'none', m: 'block' }}><Text>🖥 Desktop View</Text></Box>
      <Box display={{ base: 'block', m: 'none' }}><Text>📱 Mobile View</Text></Box>
      <Box 
        padding="spacing.4"
        marginTop="32px"
        display="flex"
        flexDirection={{ base: 'column', m: 'row' }}
      >
        <Box
          flex="1"
          backgroundColor="surface.background.cloud.intense"
          padding="spacing.4" 
        >
          <Text color="surface.text.onCloud.onIntense">Box1</Text>
        </Box>
        <Box 
          flex="1" 
          backgroundColor="surface.background.sea.intense" 
          padding="spacing.4" 
        >
          <Text color="surface.text.onSea.onIntense">Box2</Text>
        </Box>
      </Box>
    </>
  );
}

export default App;
```

All the props of Box component support responsive objects. For which breakpoint to use, you can check out [Breakpoints documentation](https://example.com).

## 💅🏼 Styled Props for Blade Components

Want to add spacing between 2 elements? Add layout props directly on the Blade components.

To create this example:
- Use layout props directly in favorite components, such as `Text`.

```jsx
import { Text } from '@razorpay/blade/components';

function App(): React.ReactElement {
  return (
    <>
      <Box>
        <Text>Text Node 1</Text>
      </Box>
      <Box marginTop="spacing.4">
        <Text>Text Node 2</Text>
      </Box>

      <Text>Text Node 1</Text>
      <Text marginTop="spacing.4">Text Node 2</Text>
    </>
  );
}

export default App;
```

Here's another example where we position Alert component at the bottom of the screen.

```jsx
import { Alert } from '@razorpay/blade/components';

function App() {
  return (
    <Alert 
      description="I am bottom positioned"
      isFullWidth
      position="fixed"
      bottom="spacing.10"
      left="spacing.0"
    />
  );
}

export default App;
```