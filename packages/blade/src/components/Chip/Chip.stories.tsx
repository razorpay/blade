import type { StoryFn, Meta } from '@storybook/react-vite';
import React from 'react';
import { Code, Text } from '../Typography';
import type { ChipGroupProps } from './ChipGroup';
import { ChipGroup as ChipGroupComponent } from './ChipGroup';
import { Chip as ChipComponent } from './Chip';
import type { ChipProps } from './types';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import iconMap from '~components/Icons/iconMap';
import { Link } from '~components/Link';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="The Chip component is inherently tied to the ChipGroup and cannot be utilized outside its context."
      componentName="Chip"
      note={
        <Text>
          This story is only meant to demonstrate the props of the Chip component. For complete
          usage refer to the ChipGroup story{' '}
          <Link
            target="_blank"
            href="https://blade.razorpay.com/?path=/docs/components-chip-chipgroup"
          >
            here.
          </Link>
          <br />
          Use <Code size="medium">icon</Code> for Blade icons and <Code size="medium">leading</Code>{' '}
          for custom leading elements like flags or avatars. They are mutually exclusive and should
          not be used together.
        </Text>
      }
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=75272-53870&t=TGcKiXJiozSRKwOG-1&scaling=min-zoom&page-id=52377%3A23885&mode=design"
    />
  );
};

const propsCategory = { CHIP: 'Chip Props', CHIP_GROUP: 'ChipGroup Props' };

export default {
  title: 'Components/Chip/Chip',
  args: {
    isDisabled: false,
  },
  tags: ['autodocs'],
  argTypes: {
    // Chip props
    isDisabled: {
      description: 'Disables or enables `Chip`',
      control: {
        type: 'boolean',
      },
      table: {
        category: propsCategory.CHIP,
        type: {
          summary: 'boolean',
        },
      },
    },
    value: {
      description: 'The value to be used in the Chip input.',
      table: {
        category: propsCategory.CHIP,
        type: {
          summary: 'string',
        },
      },
    },
    icon: {
      name: 'icon',
      description:
        'Displays a Blade Icon component within the Chip. Mutually exclusive with `leading`.',
      type: 'select',
      options: Object.keys(iconMap),
      mapping: iconMap,
      table: {
        category: propsCategory.CHIP,
        type: {
          summary: 'IconComponent',
        },
      },
    },
    leading: {
      description:
        'Custom leading element rendered before the label, such as a flag, avatar, logo, or SVG asset. Mutually exclusive with `icon`.',
      control: false,
      table: {
        category: propsCategory.CHIP,
        type: {
          summary: 'React.ReactNode',
        },
      },
    },
    color: {
      description:
        'Sets the color of the Chip. This overwrites the color set by the parent `ChipGroup` component',
      table: {
        category: propsCategory.CHIP,
        type: {
          summary: '"primary" | "positive" | "negative"',
        },
      },
      options: ['primary', 'positive', 'negative'],
      control: {
        type: 'radio',
      },
    },

    // Styled Props
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<ChipGroupProps>;

const ChipTemplate: StoryFn<typeof ChipComponent> = ({ children, ...args }) => {
  return (
    <Box>
      <ChipGroupComponent
        selectionType="multiple"
        defaultValue={['Automated Payment Links']}
        accessibilityLabel="Select other capabilities you are looking for from the options below"
      >
        <ChipComponent value="Automated Payment Links" {...args}>
          Automated Payment Links
        </ChipComponent>
      </ChipGroupComponent>
    </Box>
  );
};

export const Default = ChipTemplate.bind({});
Default.storyName = 'Default';
Default.args = {
  color: 'primary',
};

const countryFlags = {
  IN: {
    label: 'India',
    alt: 'India',
    src: 'https://flagcdn.com/w40/in.png',
  },
  US: {
    label: 'United States',
    alt: 'US',
    src: 'https://flagcdn.com/w40/us.png',
  },
  GB: {
    label: 'United Kingdom',
    alt: 'UK',
    src: 'https://flagcdn.com/w40/gb.png',
  },
} as const;

type CountryCode = keyof typeof countryFlags;

type ChipWithLeadingStoryArgs = Omit<ChipProps, 'icon' | 'leading' | 'value'> & {
  size?: ChipGroupProps['size'];
  value?: CountryCode;
  leading?: React.ReactNode;
};

const getFlagLeading = (countryCode: CountryCode): React.ReactElement => {
  const flag = countryFlags[countryCode];

  return <img src={flag.src} width={16} height={12} alt={flag.alt} style={{ borderRadius: 2 }} />;
};

const ChipWithLeadingTemplate: StoryFn<ChipWithLeadingStoryArgs> = ({
  size,
  value = 'IN',
  leading,
  ...args
}) => {
  const [selectedValue, setSelectedValue] = React.useState<CountryCode>(value);

  React.useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <Box>
      <Text marginBottom="spacing.4">Chip with leading element (e.g., country flags):</Text>
      <ChipGroupComponent
        selectionType="single"
        accessibilityLabel="Select country"
        label="Country"
        size={size}
        value={selectedValue}
        onChange={({ values }) => setSelectedValue(values[0] as CountryCode)}
      >
        {Object.entries(countryFlags).map(([countryCode, country]) => (
          <ChipComponent
            {...args}
            key={countryCode}
            value={countryCode}
            leading={leading ?? getFlagLeading(countryCode as CountryCode)}
          >
            {country.label}
          </ChipComponent>
        ))}
      </ChipGroupComponent>
    </Box>
  );
};

export const WithLeading = ChipWithLeadingTemplate.bind({});
WithLeading.storyName = 'With Leading (Flags)';
WithLeading.args = {
  color: 'primary',
  size: 'small',
  value: 'IN',
};
WithLeading.argTypes = {
  icon: {
    table: {
      disable: true,
    },
  },
  size: {
    description: 'Specifies the size of the rendered Chips.',
    options: ['xsmall', 'small', 'medium', 'large'],
    control: {
      type: 'radio',
    },
    table: {
      category: propsCategory.CHIP_GROUP,
      type: {
        summary: '"xsmall" | "small" | "medium" | "large"',
      },
    },
  },
  value: {
    description: 'Selected country value for the ChipGroup.',
    options: Object.keys(countryFlags),
    control: {
      type: 'select',
    },
    table: {
      category: propsCategory.CHIP_GROUP,
      type: {
        summary: '"IN" | "US" | "GB"',
      },
    },
  },
  leading: {
    description:
      'Overrides the leading element for all chips. Select "Default flags" to render each country-specific flag.',
    options: ['Default flags', 'India flag', 'US flag', 'UK flag'],
    mapping: {
      'Default flags': undefined,
      'India flag': getFlagLeading('IN'),
      'US flag': getFlagLeading('US'),
      'UK flag': getFlagLeading('GB'),
    },
    control: {
      type: 'select',
    },
    table: {
      category: propsCategory.CHIP,
      type: {
        summary: 'React.ReactNode',
      },
    },
  },
};
