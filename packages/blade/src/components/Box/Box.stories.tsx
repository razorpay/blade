import type { Meta } from '@storybook/react';
import React from 'react';
import { getBoxArgTypes } from './BaseBox/storybookArgTypes';
import type { BoxRefType } from './BaseBox/types';
import type { BoxProps } from '.';
import { Box } from '.';
import { Text, Title } from '~components/Typography';
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
        <Box flex="1" backgroundColor="brand.primary.500" padding="spacing.5">
          <Text contrast="high">Box1</Text>
        </Box>
        <Box flex="1" backgroundColor="surface.background.level2.highContrast" padding="spacing.5">
          <Text contrast="high">Box2</Text>
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
    <Box height="300px" overflow="auto" backgroundColor="surface.background.level2.lowContrast">
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
        backgroundColor="surface.background.level2.lowContrast"
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
          <Text as="span" weight="bold">
            section-1
          </Text>{' '}
          that we want to scroll to.
        </Text>
      </Box>
    </Box>
  );
};

export default BoxStoryMeta;
