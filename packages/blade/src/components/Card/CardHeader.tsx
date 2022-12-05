/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Divider } from './Divider';
import Box from '~components/Box';
import { Text } from '~components/Typography';
import type { IconComponent } from '~components/Icons';
import type { CounterProps } from '~components/Counter';
import { Counter } from '~components/Counter';

type CardHeaderProps = {
  children?: React.ReactNode;
};

type CardHeaderIconProps = {
  icon: IconComponent;
};

const CardHeaderIcon = ({ icon: Icon }: CardHeaderIconProps): React.ReactElement => {
  return <Icon color="surface.text.normal.lowContrast" size="xlarge" />;
};
CardHeaderIcon.componentId = 'CardHeaderIcon';

const CardHeaderCounter = ({ ...props }: CounterProps): React.ReactElement => {
  return <Counter {...props} />;
};
CardHeaderCounter.componentId = 'CardHeaderCounter';

const isOfComponentId = (comp: React.ReactNode, id: string): boolean => {
  if (!React.isValidElement(comp)) return false;
  return (comp.type as any)?.componentId === id;
};

const CardHeader = ({ children }: CardHeaderProps): React.ReactElement => {
  return (
    <Box marginBottom="spacing.7">
      <Box
        marginBottom="spacing.7"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        {children}
      </Box>
      <Divider />
    </Box>
  );
};

type CardHeaderLeadingProps = {
  title: string;
  subtitle?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
};
const CardHeaderLeading = ({
  title,
  subtitle,
  prefix,
  suffix,
}: CardHeaderLeadingProps): React.ReactElement => {
  if (!isOfComponentId(prefix, 'CardHeaderIcon')) {
    throw new Error(
      '[Blade CardHeaderLeading]: Only Card.Header.Icon component is accepted in prefix',
    );
  }

  if (!isOfComponentId(suffix, 'CardHeaderCounter')) {
    throw new Error(
      '[Blade CardHeaderLeading]: Only Card.Header.Counter component is accepted in suffix',
    );
  }

  return (
    <Box display="flex" flexDirection="row">
      <Box marginRight="spacing.3" alignSelf="center" display="flex">
        {prefix}
      </Box>
      <Box>
        <Text variant="body" size="medium" weight="bold">
          {title}
        </Text>
        <Text variant="body" size="small" weight="regular">
          {subtitle}
        </Text>
      </Box>
      <Box marginLeft="spacing.3">{suffix}</Box>
    </Box>
  );
};

type CardHeaderTrailingProps = {
  visual?: React.ReactNode;
};
const CardHeaderTrailing = ({ visual }: CardHeaderTrailingProps): React.ReactElement => {
  return <Box alignSelf="center">{visual}</Box>;
};

export { CardHeader, CardHeaderLeading, CardHeaderTrailing, CardHeaderIcon, CardHeaderCounter };
