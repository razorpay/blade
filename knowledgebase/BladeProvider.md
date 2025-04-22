## Component Name
BladeProvider

## Description
BladeProvider is the essential wrapper component for all Blade applications, responsible for providing theme context and styling infrastructure. It manages theme tokens, color schemes, and breakpoints while setting up necessary context providers for components like Drawers and BottomSheets. This component must be placed at the root of your application to ensure proper styling and functionality of all Blade components.

## TypeScript Types
The following types represent the props that the BladeProvider component accepts. These types allow you to properly configure the component according to your needs.

```typescript
/**
 * Props for the BladeProvider component
 */
type BladeProviderProps = {
  /**
   * Theme tokens to be used throughout the application
   */
  themeTokens: ThemeTokens;
  
  /**
   * Initial color scheme to be used
   * @default 'light'
   */
  colorScheme?: ColorSchemeNamesInput;
  
  /**
   * Child components that will be wrapped by BladeProvider
   */
  children: React.ReactNode;
};

/**
 * Theme context value containing theme, color scheme, and platform information
 */
type ThemeContext = UseColorScheme & {
  theme: Theme;
  platform: TypographyPlatforms;
};

/**
 * Theme type representing the complete theme object with colors, typography, etc.
 */
type Theme = {
  colors: Record<string, string>;
  elevation: ElevationTokens;
  typography: TypographyTokens;
  breakpoints: Breakpoints;
  spacing: SpacingTokens;
  borderRadius: BorderRadiusTokens;
  borderWidth: BorderWidthTokens;
  // Other theme properties
};

/**
 * Color scheme names for the theme
 */
type ColorSchemeNames = 'light' | 'dark';

/**
 * Color scheme names input, including system detection
 */
type ColorSchemeNamesInput = ColorSchemeNames | 'system';

/**
 * Typography platforms for responsive design
 */
type TypographyPlatforms = 'onMobile' | 'onTablet' | 'onDesktop';

/**
 * Used for color scheme modes in theme tokens
 */
type ColorSchemeModes = 'onLight' | 'onDark';

/**
 * Color scheme hook return type
 */
type UseColorScheme = {
  colorScheme: ColorSchemeNames;
  setColorScheme: (colorScheme: ColorSchemeNamesInput) => void;
};
```

## Example
This example demonstrates how to set up the BladeProvider at the root of your application using the predefined Blade theme.

```tsx
import React from 'react';
import { 
  BladeProvider, 
  Box,
  Text,
  Dropdown,
  useTheme,
  Heading
} from '@razorpay/blade/components';
import { bladeTheme } from '@razorpay/blade/tokens';

// Theme switcher component
const ThemeSwitcher = () => {
  const { colorScheme, setColorScheme } = useTheme();
  
  return (
    <Box padding="spacing.5">
      <Text variant="bodyMedium" marginBottom="spacing.3">
        Current theme: {colorScheme}
      </Text>
      
      <Dropdown
        label="Select Theme"
        value={colorScheme}
        onChange={(value) => setColorScheme(value)}
      >
        <Dropdown.Button>
          {colorScheme === 'light' ? 'Light Theme' : 
           colorScheme === 'dark' ? 'Dark Theme' : 'System Theme'}
        </Dropdown.Button>
        <Dropdown.Overlay>
          <Dropdown.Item value="light" onClick={() => setColorScheme('light')}>
            Light
          </Dropdown.Item>
          <Dropdown.Item value="dark" onClick={() => setColorScheme('dark')}>
            Dark
          </Dropdown.Item>
          <Dropdown.Item value="system" onClick={() => setColorScheme('system')}>
            System
          </Dropdown.Item>
        </Dropdown.Overlay>
      </Dropdown>
    </Box>
  );
};

// Main application with BladeProvider
const App = () => {
  return (
    <BladeProvider 
      themeTokens={bladeTheme}
    >
      <Box 
        padding="spacing.5" 
        display="flex" 
        flexDirection="column" 
        gap="spacing.5"
      >
        <Heading size="large">Blade Application</Heading>
        
        {/* Theme switcher using the theme context */}
        <ThemeSwitcher />
        
        {/* Your application content goes here */}
        <Box 
          padding="spacing.4" 
          backgroundColor="surface.background.gray.subtle"
          borderRadius="medium"
        >
          <Text variant="body" size="medium">Your application content wrapped with BladeProvider</Text>
        </Box>
      </Box>
    </BladeProvider>
  );
};

export default App;
```

## Custom Theme Example
This example demonstrates how to create and use a custom theme with BladeProvider by providing a brand color.

```tsx
import React from 'react';
import { 
  BladeProvider, 
  Box,
  Text,
  Heading,
  Button,
  Input,
  Link
} from '@razorpay/blade/components';
import { createTheme } from '@razorpay/blade/tokens';

// Create a custom theme with a teal brand color
const { theme: customTheme } = createTheme({
  brandColor: '#0891B2' // Teal brand color
});

// Simple app component with custom theme
const CustomThemeExample = () => {
  return (
    <BladeProvider themeTokens={customTheme}>
      <Box 
        padding="spacing.5" 
        backgroundColor="surface.background.gray.subtle" 
        borderRadius="medium"
      >
        <Heading size="large" color="interactive.text.primary.normal" marginBottom="spacing.4">
          Custom Themed Form
        </Heading>
        
        <Box display="flex" flexDirection="column" gap="spacing.4">
          {/* Text input examples */}
          <Input
            label="Email Address"
            placeholder="Enter your email"
            helperText="We'll never share your email with anyone else."
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
          />
          
          {/* Button examples showing primary, secondary and tertiary variants */}
          <Box display="flex" gap="spacing.3" marginTop="spacing.2">
            <Button variant="primary">
              Submit
            </Button>
            
            <Button variant="secondary">
              Cancel
            </Button>
            
            <Button variant="tertiary">
              Reset
            </Button>
          </Box>
          
          {/* Link example */}
          <Box marginTop="spacing.3">
            <Text variant="body" size="small">
              By signing up, you agree to our{' '}
              <Link href="#" target="_blank">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="#" target="_blank">
                Privacy Policy
              </Link>
            </Text>
          </Box>
        </Box>
      </Box>
    </BladeProvider>
  );
};

export default CustomThemeExample; 