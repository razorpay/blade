import styled from 'styled-components';
import { Box } from '~components/Box';
import { Card, CardBody } from '~components/Card';
import { CheckIcon } from '~components/Icons';
import { Radio, RadioGroup } from '~components/Radio';
import { Code, Heading, Text } from '~components/Typography';
import type { ColorSchemeNamesInput } from '~tokens/theme';

const ColorSelection = styled.button<{ color: string }>(({ color }) => ({
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}));

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
    <ColorSelection color={color} onClick={onClick}>
      {isSelected ? <CheckIcon size="medium" color="action.icon.primary.default" /> : null}
    </ColorSelection>
  );
};

const ThemeSelector = ({
  selectedColor,
  setSelectedColor,
  colorScheme,
  setColorScheme,
}: {
  selectedColor?: string;
  colorScheme: ColorSchemeNamesInput;
  setSelectedColor: React.Dispatch<React.SetStateAction<string | undefined>>;
  setColorScheme: React.Dispatch<React.SetStateAction<ColorSchemeNamesInput>>;
}): React.ReactElement => {
  const colorOptions = [
    '#EE681A',
    '#83003D',
    '#15A5EB',
    '#107259',
    '#FFF10A',
    '#F32951',
    '#F86B15',
    '#CF2033',
    '#19BEA2',
    '#DF005D',
  ];

  return (
    <Card elevation="none">
      <CardBody>
        <Box minWidth="300px">
          <Heading>Customise theme</Heading>
          <Box marginTop="spacing.5" />
          <Box display="flex" flexDirection="row" gap="spacing.2" flexWrap="wrap">
            <Text type="subdued" weight="bold" marginRight="spacing.8">
              Brand Color:
            </Text>
            {colorOptions.map((color) => (
              <ColorSelector
                key={color}
                color={color}
                isSelected={selectedColor === color}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            gap="spacing.2"
            flexWrap="wrap"
            marginTop="spacing.5"
          >
            <RadioGroup
              value={colorScheme}
              labelPosition="left"
              label="Color Scheme:"
              onChange={({ value }) => setColorScheme(value as ColorSchemeNamesInput)}
            >
              <Radio value="light">Light</Radio>
              <Radio value="dark">Dark</Radio>
            </RadioGroup>
          </Box>
          <Box marginTop="spacing.5" />
          <Text type="subdued" weight="bold" marginRight="spacing.8">
            Usage:
          </Text>
          {selectedColor ? (
            <Code size="medium">{`const productTheme = createTheme({ brandColor: '${selectedColor}' })`}</Code>
          ) : null}
          <Box marginTop="spacing.3" />
          <Code size="medium">{`<BladeProvider themeTokens={${
            selectedColor ? `productTheme` : `paymentTheme`
          }} colorScheme='${colorScheme}'>{App}</BladeProvider>`}</Code>
        </Box>
      </CardBody>
    </Card>
  );
};

export { ThemeSelector };
