<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Box from './Box.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import Button from '../Button/Button.svelte';
  import Link from '../Link/Link.svelte';

  const { Story } = defineMeta({
    title: 'Components/Layout Primitives (Box)/Box',
    component: Box,
    tags: ['autodocs'],
    argTypes: {
      as: {
        control: 'select',
        options: ['div', 'section', 'footer', 'header', 'main', 'aside', 'nav', 'span', 'label'],
        description: 'The HTML tag the Box is rendered as.',
        table: { defaultValue: { summary: 'div' } },
      },
      display: {
        control: 'select',
        options: ['none', 'block', 'flex', 'inline-flex', 'inline-block', 'grid', 'inline'],
        description: 'CSS display property.',
      },
      flexDirection: {
        control: 'select',
        options: ['row', 'row-reverse', 'column', 'column-reverse'],
        description: 'CSS flex-direction property.',
      },
      backgroundColor: {
        control: 'text',
        description: 'Background color token (surface.background.*, overlay.*, feedback.background.*, transparent).',
      },
      elevation: {
        control: 'select',
        options: [undefined, 'none', 'lowRaised', 'midRaised', 'highRaised'],
        description: 'Elevation (box-shadow) token.',
      },
      borderRadius: {
        control: 'select',
        options: [
          'none', '2xsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge', '2xlarge', 'max', 'round',
        ],
        description: 'Border radius token.',
      },
      overflow: {
        control: 'select',
        options: ['visible', 'hidden', 'scroll', 'auto'],
        description: 'CSS overflow property.',
      },
    },
  });
</script>

<script lang="ts">
  // WithRef story — element reference for scrollIntoView.
  let refElement = $state<HTMLElement | undefined>(undefined);

  // WithTransition story — hover-driven background/text toggle.
  let hovered = $state(false);
</script>

<!-- 1 -->
<Story
  name="Default"
  args={{
    padding: { base: 'spacing.2', m: 'spacing.10' },
    backgroundColor: 'surface.background.gray.intense',
  }}
>
  {#snippet template(args)}
    <Box {...args}>
      <Text>Change controls to see the parameters change for the container</Text>
    </Box>
  {/snippet}
</Story>

<!-- 2 -->
<Story
  name="Responsive"
  args={{
    display: 'flex',
    paddingY: 'spacing.6',
    flexDirection: { base: 'column', m: 'row' },
  }}
>
  {#snippet template(args)}
    <Text>Change screen size to see flexDirection switch between row and column</Text>
    <Box {...args}>
      <Box flex="1" backgroundColor="surface.background.primary.intense" padding="spacing.5">
        <Text color="surface.text.staticWhite.normal">Box1</Text>
      </Box>
      <Box flex="1" backgroundColor="surface.background.cloud.intense" padding="spacing.5">
        <Text color="surface.text.onCloud.onIntense">Box2</Text>
      </Box>
    </Box>
  {/snippet}
</Story>

<!-- 3 -->
<Story
  name="Elevations"
  args={{
    padding: 'spacing.8',
    backgroundColor: 'surface.background.gray.moderate',
    borderRadius: 'large',
  }}
>
  {#snippet template(args)}
    <Box
      backgroundColor="surface.background.gray.moderate"
      paddingY="spacing.11"
      paddingX="spacing.4"
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
  {/snippet}
</Story>

<!-- 4 -->
<Story name="As Section" args={{ as: 'section' }}>
  {#snippet template(args)}
    <Box {...args}>
      <Text>This box is rendered as {args.as} HTML tag</Text>
    </Box>
  {/snippet}
</Story>

<!-- 5 -->
<Story name="With Ref" args={{ marginTop: '800px' }}>
  {#snippet template(args)}
    <Box height="300px" overflow="auto" backgroundColor="surface.background.gray.moderate">
      <Button onClick={() => refElement?.scrollIntoView()}>Click to Scroll</Button>
      <Box bind:element={refElement} {...args}>
        <Text>Hi from Box with ref</Text>
      </Box>
    </Box>
  {/snippet}
</Story>

<!-- 6 -->
<Story name="With Mouse Events" args={{ overflowY: 'auto', height: '300px' }}>
  {#snippet template(args)}
    <Box
      {...args}
      onMouseOver={(e) => console.log('onMouseOver', e)}
      onMouseEnter={(e) => console.log('onMouseEnter', e)}
      onMouseLeave={(e) => console.log('onMouseLeave', e)}
      onScroll={(e) => console.log('onScroll', e)}
    >
      <Text marginY="300px">Move mouse over this text and check console</Text>
    </Box>
  {/snippet}
</Story>

<!-- 7 -->
<Story name="With Drag And Drop Events" args={{ overflowY: 'auto', height: '300px' }}>
  {#snippet template(args)}
    <Box>
      <Box
        draggable
        maxWidth="fit-content"
        onDragStart={(e) => console.log('onDragStart', e)}
        onDragEnd={(e) => console.log('onDragEnd', e)}
      >
        <Button>Drag me into the box below & check console</Button>
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
        onDragLeave={(e) => console.log('onDragLeave', e)}
        onDrop={(e) => {
          e.preventDefault();
          console.log('onDrop', e);
        }}
      />
    </Box>
  {/snippet}
</Story>

<!-- 8 -->
<Story name="With Id">
  {#snippet template()}
    <Box>
      <Link href="#section-1">Scroll to section</Link>
      <Box height="100vh" />
      <Box height="100vh" as="section" id="section-1">
        <Text>Section of the page with id section-1 that we want to scroll to.</Text>
      </Box>
    </Box>
  {/snippet}
</Story>

<!-- 9 -->
<Story name="Polygon">
  {#snippet template()}
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
  {/snippet}
</Story>

<!-- 10 -->
<Story name="With Transition">
  {#snippet template()}
    <Box
      backgroundColor={hovered
        ? 'surface.background.primary.intense'
        : 'surface.background.gray.intense'}
      backdropFilter="blur(32px)"
      padding="spacing.8"
      borderRadius="medium"
      transition="all 0.2s ease-in-out"
      onMouseEnter={() => (hovered = true)}
      onMouseLeave={() => (hovered = false)}
    >
      <Text color={hovered ? 'surface.text.staticWhite.normal' : 'surface.text.gray.normal'}>
        Hover me to see the transition effect!
      </Text>
    </Box>
  {/snippet}
</Story>
