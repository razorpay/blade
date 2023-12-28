import type { Meta } from '@storybook/react';
import React from 'react';
import { getBoxArgTypes } from './BaseBox/storybookArgTypes';
import type { BoxRefType } from './BaseBox/types';
import type { BoxProps } from '.';
import { Box } from '.';
import { Text, Heading } from '~components/Typography';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { LinkToStorybook } from '~utils/storybook/LinkToStorybook';
import { castWebType, isReactNative } from '~utils';
import { Button } from '~components/Button';
import { Link } from '~components/Link';

// Storybook renders inside iframe so by default it doesn't support scrolling to the sections.
// So we manually read location.hash of parent window and scroll to that section on load
if (window.top) {
  document.getElementById(window.top.location.hash)?.scrollIntoView();
}

const BoxStoryMeta = {
  title: 'Components/Layout Primitives (Box)/Box',
  component: Box,
  tags: ['autodocs'],
  argTypes: getBoxArgTypes(),
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentName="Box"
          apiDecisionLink="https://github.com/razorpay/blade/blob/master/rfcs/2023-01-06-layout.md"
          componentDescription="Box Component from Layout Primitives of Blade."
          propsDescription="All Box props support responsive objects. Props marked with 💅🏼 next to their names are the props that can also be used as styled-props on other blade components. Check out styled-props documentation for more details."
        >
          <Box paddingY="spacing.5" paddingBottom="spacing.8">
            <Heading size="xlarge">Layout Primitives Documentation</Heading>
            <Text marginTop="spacing.3">
              Check Out{' '}
              <LinkToStorybook url="Components/Layout Primitives (Box)/How to Create Layouts?">
                &quot;How to Create Layouts?&quot; Docs
              </LinkToStorybook>{' '}
              for more detailed documentation of Box
            </Text>
          </Box>
        </StoryPageWrapper>
      ),
    },
  },
} as Meta<BoxProps>;

export const Default = (args: BoxProps): React.ReactElement => {
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

export const Responsive = (args: BoxProps): React.ReactElement => {
  return (
    <>
      <Text>Change screen size to see flexDirection switch between row and column</Text>
      <Box {...args}>
        <Box flex="1" backgroundColor="surface.background.primary.intense" padding="spacing.5">
          <Text color="surface.text.staticWhite.normal">Box1</Text>
        </Box>
        <Box flex="1" backgroundColor="surface.background.cloud.intense" padding="spacing.5">
          <Text color="surface.text.onCloud.onIntense">Box2</Text>
        </Box>
      </Box>
    </>
  );
};

Responsive.args = {
  display: 'flex',
  paddingY: 'spacing.6',
  flexDirection: { base: 'column', m: 'row' },
} as BoxProps;

export const Elevations = (args: BoxProps): React.ReactElement => {
  return (
    <Box
      backgroundColor="surface.background.gray.moderate"
      paddingY="spacing.11"
      paddingX={isReactNative() ? 'spacing.0' : 'spacing.4'}
      display="flex"
      flexDirection="row"
      gap="spacing.8"
    >
      <Box {...args} elevation="lowRaised">
        <Text>Low </Text>
      </Box>
      <Box {...args} elevation="midRaised">
        <Text>Mid</Text>
      </Box>
      <Box {...args} elevation="highRaised">
        <Text>High</Text>
      </Box>
    </Box>
  );
};

Elevations.args = {
  padding: 'spacing.8',
  backgroundColor: 'surface.background.level2.lowContrast',
  borderRadius: 'large',
} as BoxProps;

export const AsSection = (args: BoxProps): React.ReactElement => {
  if (isReactNative()) {
    return (
      <Box>
        <Text>as prop is not supported on React Native. Check the same story on web</Text>
      </Box>
    );
  }

  return (
    <Box {...args}>
      <Text>This box is rendered as {args.as} HTML tag</Text>
    </Box>
  );
};

AsSection.args = {
  as: 'section',
} as BoxProps;

export const WithRef = (args: BoxProps): React.ReactElement => {
  const ref = React.useRef<BoxRefType>(null);

  return (
    <Box height="300px" overflow="auto" backgroundColor="surface.background.gray.moderate">
      <Button
        onClick={() => {
          if (!isReactNative()) {
            castWebType(ref.current).scrollIntoView();
          }
        }}
      >
        Click to Scroll
      </Button>
      <Box ref={ref} {...args}>
        <Text>Hi from Box with ref</Text>
      </Box>
    </Box>
  );
};

WithRef.args = {
  marginTop: '800px',
} as BoxProps;

export const WithMouseEvents = (args: BoxProps): React.ReactElement => {
  return (
    <Box
      {...args}
      onMouseOver={(e) => console.log('onMouseOver', e)}
      onMouseEnter={(e) => console.log('onMouseEnter', e)}
      onMouseLeave={(e) => console.log('onMouseLeave', e)}
      onScroll={(e) => console.log('onScroll', e)}
    >
      <Text marginY="300px">Move mouse over this text and check console</Text>
    </Box>
  );
};

WithMouseEvents.args = {
  overflowY: 'auto',
  height: '300px',
} as BoxProps;

export const WithDragAndDropEvents = (args: BoxProps): React.ReactElement => {
  return (
    <Box>
      <Box
        draggable
        maxWidth="fit-content"
        onDragStart={(e) => {
          console.log('onDragStart', e);
        }}
        onDragEnd={(e) => {
          console.log('onDragEnd', e);
        }}
      >
        <Button> Drag me into the box below & check console</Button>
      </Box>
      <Box
        {...args}
        margin="spacing.5"
        backgroundColor="surface.background.gray.moderate"
        onDragEnter={(e) => {
          e.preventDefault();
          console.log('onDragEnter', e);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          console.log('onDragOver', e);
        }}
        onDragLeave={(e) => {
          console.log('onDragLeave', e);
        }}
        onDrop={(e) => {
          e.preventDefault();
          console.log('onDrop', e);
        }}
      />
    </Box>
  );
};

WithDragAndDropEvents.args = {
  overflowY: 'auto',
  height: '300px',
} as BoxProps;

export const WithId = (): React.ReactElement => {
  return (
    <Box>
      <Link href="#section-1">Scroll to section</Link>
      <Box height="100vh" />
      <Box height="100vh" as="section" id="section-1">
        <Text>
          Section of the page with id{' '}
          <Text as="span" weight="semibold">
            section-1
          </Text>{' '}
          that we want to scroll to.
        </Text>
      </Box>
    </Box>
  );
};

export const Polygon = (): React.ReactElement => {
  return (
    <Box
      backgroundColor="surface.background.primary.intense"
      padding="spacing.3"
      margin="spacing.3"
      height="300px"
      clipPath="ellipse(130px 140px at 10% 20%)"
      transformOrigin="top left"
      transform="rotate(10deg) translate(100px, 20%)"
    >
      <Text as="span" weight="semibold" color="surface.text.staticWhite.normal">
        Custom Polygon
      </Text>
    </Box>
  );
};

export default BoxStoryMeta;
