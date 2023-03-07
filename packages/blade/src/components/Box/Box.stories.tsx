import type { Meta } from '@storybook/react';
import React from 'react';
import { getBoxArgTypes } from './BaseBox/storybookArgTypes';
import type { BoxProps } from '.';
import { Box } from '.';
import { Text, Title } from '~components/Typography';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import { Link } from '~components/Link';

if (window.top) {
  document.getElementById(window.top.location.hash)?.scrollIntoView();
}

const BoxStoryMeta = {
  title: 'Components/Layout Primitives (Box)/Box',
  component: Box,
  argTypes: getBoxArgTypes(),
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentName="Box"
          componentDescription="Box Component from Layout Primitives of Blade."
          propsDescription="All Box props support responsive objects. Props marked with 💅🏼 next to their names are the props that can also be used as styled-props on other blade components. Check out styled-props documentation for more details."
        >
          <Box paddingY="spacing.5" paddingBottom="spacing.8">
            <Title size="medium">Layout Primitives Documentation</Title>
            <Text marginTop="spacing.3">
              Check Out <Link>&quot;How to Create Layouts?&quot; Docs</Link> for more detailed
              documentation of Box
            </Text>
          </Box>
        </StoryPageWrapper>
      ),
    },
  },
} as Meta<BoxProps>;

export const Default = (args: BoxProps): JSX.Element => {
  return (
    <Box {...args}>
      <Text>Change controls to see the parameters change for the container</Text>
    </Box>
  );
};

Default.args = {
  padding: { base: 'spacing.2', m: 'spacing.10' },
  backgroundColor: 'surface.background.level1.lowContrast',
} as BoxProps;

export const Responsive = (args: BoxProps): JSX.Element => {
  return (
    <Box {...args}>
      <Box
        flex="1"
        backgroundColor="surface.background.level2.highContrast"
        minHeight="spacing.10"
        padding="spacing.2"
      >
        <Text contrast="high">flexDirection property of this layout will change in mobile</Text>
      </Box>
      <Box
        flex="1"
        backgroundColor="surface.background.level3.highContrast"
        minHeight="spacing.10"
      />
    </Box>
  );
};

Responsive.args = {
  display: 'flex',
  padding: 'spacing.10',
  flexDirection: { base: 'column', m: 'row' },
} as BoxProps;

export default BoxStoryMeta;
