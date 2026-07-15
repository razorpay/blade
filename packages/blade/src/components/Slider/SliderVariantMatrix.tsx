import React from 'react';
import { Slider } from './Slider';
import { Badge } from '~components/Badge';
import { Box } from '~components/Box';
import { Divider } from '~components/Divider';
import { Heading, Text } from '~components/Typography';

type MatrixSectionProps = {
  children: React.ReactNode;
  description: string;
  title: string;
};

const MatrixSection = ({
  children,
  description,
  title,
}: MatrixSectionProps): React.ReactElement => (
  <Box display="flex" flexDirection="column" gap="spacing.5" paddingY="spacing.6">
    <Box display="flex" flexDirection="column" gap="spacing.2">
      <Heading size="medium">{title}</Heading>
      <Text size="small" color="surface.text.gray.muted">
        {description}
      </Text>
    </Box>
    {children}
  </Box>
);

const TwoColumnLayout = ({ children }: { children: React.ReactNode }): React.ReactElement => (
  <Box display="flex" flexDirection={{ base: 'column', m: 'row' }} gap="spacing.7">
    {React.Children.map(children, (child) => (
      <Box width="100%" minWidth="0px" flexGrow={1} flexShrink={1}>
        {child}
      </Box>
    ))}
  </Box>
);

const SliderVariantMatrix = (): React.ReactElement => (
  <Box display="flex" flexDirection="column" maxWidth="960px" width="100%">
    <Box display="flex" flexDirection="column" gap="spacing.3" paddingBottom="spacing.6">
      <Heading size="large">Slider variant matrix</Heading>
      <Text color="surface.text.gray.muted">
        Each supported property axis is shown once in a purposeful product pattern.
      </Text>
      <Box display="flex" gap="spacing.2" flexWrap="wrap">
        <Badge color="information">2 value models</Badge>
        <Badge color="neutral">3 sizes</Badge>
        <Badge color="positive">5 semantic colors</Badge>
        <Badge color="notice">All field states</Badge>
      </Box>
    </Box>
    <Divider />
    <MatrixSection
      title="Value models"
      description="Single selection and bounded range use the same label, value, and endpoint system."
    >
      <TwoColumnLayout>
        <Slider label="Transaction limit" defaultValue={45} showMinMax />
        <Slider
          label="Settlement window"
          variant="range"
          defaultValue={[20, 80]}
          showThumbValue
          showMinMax
          valueFormatter={(value) => `${value} days`}
        />
      </TwoColumnLayout>
    </MatrixSection>
    <Divider />
    <MatrixSection
      title="Size and label layout"
      description="Track and thumb scale independently while the field label follows Blade's top and left positions."
    >
      <Box display="flex" flexDirection="column" gap="spacing.6">
        <Slider label="Small" size="small" defaultValue={30} />
        <Slider label="Medium" size="medium" defaultValue={50} />
        <Slider label="Large with left label" labelPosition="left" size="large" defaultValue={70} />
      </Box>
    </MatrixSection>
    <Divider />
    <MatrixSection
      title="Value visibility and guidance"
      description="Header values, thumb values, labelled marks, endpoints, helper text, and accessible-only labels can be combined independently."
    >
      <Box display="flex" flexDirection="column" gap="spacing.7">
        <TwoColumnLayout>
          <Slider
            label="Discount"
            defaultValue={40}
            showThumbValue
            showMinMax
            valueFormatter={(value) => `${value}%`}
          />
          <Slider
            label="Risk profile"
            defaultValue={50}
            step={10}
            showMarks
            marks={[
              { value: 0, label: 'Low' },
              { value: 50, label: 'Balanced' },
              { value: 100, label: 'High' },
            ]}
          />
        </TwoColumnLayout>
        <TwoColumnLayout>
          <Slider
            label="Custom value text"
            defaultValue={65}
            valueText="Recommended"
            helpText="A product label can replace the numeric header value"
          />
          <Slider accessibilityLabel="Volume" defaultValue={70} showValue={false} />
        </TwoColumnLayout>
      </Box>
    </MatrixSection>
    <Divider />
    <MatrixSection
      title="Field states"
      description="Validation, necessity indicators, and disabled behavior reuse Blade's FormLabel and FormHint primitives."
    >
      <Box display="flex" flexDirection="column" gap="spacing.7">
        <TwoColumnLayout>
          <Slider label="Required" defaultValue={50} isRequired />
          <Slider label="Disabled" defaultValue={50} isDisabled />
        </TwoColumnLayout>
        <TwoColumnLayout>
          <Slider
            label="Error"
            defaultValue={20}
            validationState="error"
            errorText="Choose a value of at least 30"
          />
          <Slider
            label="Success"
            defaultValue={70}
            validationState="success"
            successText="Value is within the target range"
          />
        </TwoColumnLayout>
      </Box>
    </MatrixSection>
    <Divider />
    <MatrixSection
      title="Semantic colors"
      description="Feedback colors come directly from the Blade theme and preserve the same interaction states."
    >
      <Box display="flex" flexDirection="column" gap="spacing.5">
        {(['information', 'positive', 'negative', 'notice', 'neutral'] as const).map((color) => (
          <Slider key={color} label={color} color={color} defaultValue={60} size="small" />
        ))}
      </Box>
    </MatrixSection>
  </Box>
);

export { SliderVariantMatrix };
