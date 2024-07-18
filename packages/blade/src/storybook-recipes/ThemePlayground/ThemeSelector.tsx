import { useEffect } from 'react';
import styled from 'styled-components';
import debounce from '~utils/lodashButBetter/debounce';
import { Box } from '~components/Box';
import { IconButton } from '~components/Button/IconButton';
import { Card, CardBody } from '~components/Card';
import { CheckIcon, LockIcon, UnlockIcon } from '~components/Icons';
import { Radio, RadioGroup } from '~components/Radio';
import { Tooltip } from '~components/Tooltip';
import { Heading, Text } from '~components/Typography';
import type { ColorSchemeNames } from '~tokens/theme';
import { makeBorderSize } from '~utils';
import { SandboxHighlighter } from '~utils/storybook/Sandbox/SandpackEditor';
import { useTheme } from '~components/BladeProvider';

const ColorSelection = styled.button<{ color: string; isSelected?: boolean }>(
  ({ color, isSelected, theme }) => ({
    width: '24px',
    height: '24px',
    borderRadius: makeBorderSize(theme.border.radius.round),
    outline: `1px solid ${theme.colors.surface.background.gray.subtle}`,
    boxShadow: `0px 0px 4px 3px ${
      isSelected ? theme.colors.feedback.background.information : 'transparent'
    }`,
    border: 'none',
    backgroundColor: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    '&:focus-visible': {
      boxShadow: `0px 0px 6px 3px ${color}`,
    },
  }),
);

const ColorPickerTrigger = styled.label<{ isSelected?: boolean }>(({ isSelected, theme }) => ({
  width: '24px',
  height: '24px',
  borderRadius: makeBorderSize(theme.border.radius.round),
  border: 'none',
  cursor: 'pointer',
  position: 'relative',
  background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
  outline: `1px solid ${theme.colors.surface.background.gray.subtle}`,
  boxShadow: `0px 0px 4px 3px ${
    isSelected ? theme.colors.feedback.background.information : 'transparent'
  }`,
}));

const ColorPickerInput = styled.input({
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  appearance: 'none',
  position: 'absolute',
  top: '20px',
  left: '20px',
  opacity: 0,
  width: 0,
  height: 0,
});

const ColorSelector = ({
  color,
  isSelected,
  onClick,
}: {
  color: string;
  isSelected?: boolean;
  onClick?: () => void;
}): React.ReactElement => {
  return (
    <ColorSelection color={color} onClick={onClick} isSelected={isSelected}>
      {isSelected ? <CheckIcon size="large" color="interactive.icon.onPrimary.normal" /> : null}
    </ColorSelection>
  );
};

type ThemeSelectorProps = {
  selectedColor?: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<string | undefined>>;
  colorScheme: ColorSchemeNames;
  setColorScheme: React.Dispatch<React.SetStateAction<ColorSchemeNames>>;
  selectedPreBuiltTheme?: string;
  setSelectedPreBuiltTheme: React.Dispatch<React.SetStateAction<string | undefined>>;
  setBorderBase: React.Dispatch<React.SetStateAction<string>>;
  borderBase: string;
  setShowInternalDemoConfig: React.Dispatch<React.SetStateAction<boolean>>;
  showInternalDemoConfig: boolean;
};

const ThemeSelector = ({
  selectedColor,
  setSelectedColor,
  colorScheme,
  borderBase,
  setColorScheme,
  selectedPreBuiltTheme,
  setSelectedPreBuiltTheme,
  setBorderBase,
  setShowInternalDemoConfig,
  showInternalDemoConfig,
}: ThemeSelectorProps): React.ReactElement => {
  const colorOptions = [
    '#EE681A',
    '#83003D',
    '#15A5EB',
    '#107259',
    '#CF2033',
    '#19BEA2',
    '#5EDD55',
    '#AB1BEE',
  ];

  const handleDebouncedColorChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value);
    setSelectedPreBuiltTheme(undefined);
  }, 100);

  const { platform } = useTheme();
  const isDesktop = platform === 'onDesktop';

  useEffect(() => {
    if (!showInternalDemoConfig) {
      setBorderBase('2');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showInternalDemoConfig]);

  return (
    <Box
      position={isDesktop ? 'fixed' : 'relative'}
      right="spacing.4"
      top={isDesktop ? '0px' : undefined}
      zIndex={50}
      height="100%"
    >
      <Card elevation="highRaised" height="100%">
        <CardBody>
          <Box width={isDesktop ? '400px' : '100%'} marginTop="spacing.6">
            <Box display="flex" flexDirection="row" gap="spacing.4">
              <Heading>Customise theme</Heading>
              <Tooltip content="Toggle configuration meant only for internal demo purposes">
                <IconButton
                  accessibilityLabel="Unlock internal demo configurations"
                  icon={showInternalDemoConfig ? UnlockIcon : LockIcon}
                  onClick={() => setShowInternalDemoConfig(!showInternalDemoConfig)}
                />
              </Tooltip>
            </Box>
            <Box marginTop="spacing.8" />
            <Box display="flex" flexDirection="row" gap="spacing.2" flexWrap="wrap">
              <RadioGroup
                value={selectedPreBuiltTheme}
                labelPosition="top"
                label="Pre-built Theme:"
                onChange={({ value }) => {
                  setSelectedPreBuiltTheme(value);
                  setSelectedColor(undefined);
                }}
              >
                {/* TODO: remove the section that allows you to select theme */}
                <Radio value="bladeTheme">Blade Theme</Radio>
              </RadioGroup>
            </Box>
            <Box marginTop="spacing.8" />
            <Box display="flex" flexDirection="column" gap="spacing.2" flexWrap="wrap">
              <Text size="small" weight="semibold" marginRight="spacing.8" marginBottom="spacing.2">
                {'Theme with custom brand color:'}
              </Text>
              <Box display="flex" flexDirection="row" gap="spacing.3">
                {colorOptions.map((color) => (
                  <ColorSelector
                    key={color}
                    color={color}
                    isSelected={selectedColor === color}
                    onClick={() => {
                      setSelectedColor(color);
                      setSelectedPreBuiltTheme(undefined);
                    }}
                  />
                ))}
                <ColorPickerTrigger
                  isSelected={
                    !colorOptions.includes(selectedColor ?? '') &&
                    selectedPreBuiltTheme === undefined
                  }
                >
                  <ColorPickerInput
                    defaultValue={colorOptions[0]}
                    type="color"
                    onChange={handleDebouncedColorChange}
                    aria-label="Select a color"
                  />
                </ColorPickerTrigger>
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              gap="spacing.2"
              flexWrap="wrap"
              marginTop="spacing.8"
            >
              <RadioGroup
                value={colorScheme}
                labelPosition="top"
                label="Color Scheme:"
                onChange={({ value }) => setColorScheme(value as ColorSchemeNames)}
              >
                <Radio value="light">Light</Radio>
                <Radio value="dark">Dark</Radio>
              </RadioGroup>
            </Box>
            {showInternalDemoConfig ? (
              <>
                <Box marginTop="spacing.8" />
                <Box
                  display="flex"
                  flexDirection="row"
                  gap="spacing.2"
                  flexWrap="wrap"
                  marginTop="spacing.8"
                >
                  <RadioGroup
                    value={borderBase}
                    labelPosition="top"
                    label="Style:"
                    onChange={({ value }) => setBorderBase(value)}
                    helpText="For internal demo purpose only. Do not use in production."
                  >
                    <Radio value="0">Flat</Radio>
                    <Radio value="2">Normal</Radio>
                    <Radio value="12">Rounded</Radio>
                  </RadioGroup>
                </Box>
              </>
            ) : null}

            <Box marginTop="spacing.8" />
            <Text weight="semibold" marginRight="spacing.8" marginBottom="spacing.3">
              Code:
            </Text>
            <Box>
              {selectedColor ? (
                <SandboxHighlighter showLineNumbers={false} theme={colorScheme}>
                  {` 
              import { createTheme } from '@razorpay/blade/tokens';
              import App from './App';

              const Wrapper = () => {
              // create your custom theme here with any brand color
              const { theme: customTheme } = createTheme({ brandColor: '${selectedColor}' })
              
              return (
                  <BladeProvider 
                    themeTokens={customTheme} 
                    colorScheme='${colorScheme}'
                  >
                    {App}
                  </BladeProvider>
                );
              };
            `}
                </SandboxHighlighter>
              ) : (
                <SandboxHighlighter showLineNumbers={false} theme={colorScheme}>
                  {` 
              import { ${selectedPreBuiltTheme} } from '@razorpay/blade/tokens';
              import App from './App';
              
              const Wrapper = () => {
                return (
                  <BladeProvider 
                    themeTokens={${selectedPreBuiltTheme}} 
                    colorScheme='${colorScheme}'
                  >
                    {App}
                  </BladeProvider>
                  );
                };
                `}
                </SandboxHighlighter>
              )}
            </Box>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};

export { ThemeSelector };
