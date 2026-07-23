import { Story } from '@storybook/addon-docs/blocks';
import { Box } from '~components/Box';
import { SandboxHighlighter } from '~utils/storybook/Sandbox/SandpackEditor';
import { Default as FadeDefault } from '~components/Fade/Fade.stories';
import { Default as MoveDefault } from '~components/Move/Move.stories';
import { WithDifferentDirections as SlideWithDifferentDirections } from '~components/Slide/Slide.stories';
import { Default as ScaleDefault } from '~components/Scale/Scale.stories';
import { Default as ElevateDefault } from '~components/Elevate/Elevate.stories';
import { Default as MorphDefault } from '~components/Morph/Morph.stories';
import { Default as StaggerDefault } from '~components/Stagger/Stagger.stories';
import { AnimateChildOnCardHover } from '~components/AnimateInteractions/AnimateInteractions.stories';
import * as FadeMeta from '~components/Fade/Fade.stories';
import * as MoveMeta from '~components/Move/Move.stories';
import * as SlideMeta from '~components/Slide/Slide.stories';
import * as ScaleMeta from '~components/Scale/Scale.stories';
import * as ElevateMeta from '~components/Elevate/Elevate.stories';
import * as MorphMeta from '~components/Morph/Morph.stories';
import * as StaggerMeta from '~components/Stagger/Stagger.stories';
import * as AnimateInteractionsMeta from '~components/AnimateInteractions/AnimateInteractions.stories';

export const FadeIntro = (): React.ReactElement => {
  return (
    <Box display="flex" gap="spacing.10" alignItems="center" justifyContent="space-between">
      <Box flex="1" padding="spacing.4" elevation="lowRaised" borderRadius="medium" width="100%">
        <SandboxHighlighter>{`import { 
        Fade, 
        Card, 
        CardBody 
      } from '@razorpay/blade/components';


      <Fade>
        <Card>
          <CardBody>Card that animates</CardBody>
        </Card>
      </Fade>
      `}</SandboxHighlighter>
      </Box>
      <Box flex="1">
        <Story of={FadeDefault} meta={FadeMeta} />
      </Box>
    </Box>
  );
};

export const MoveIntro = (): React.ReactElement => {
  return (
    <Box display="flex" gap="spacing.10" alignItems="center" justifyContent="space-between">
      <Box flex="1" padding="spacing.4" elevation="lowRaised" borderRadius="medium" width="100%">
        <SandboxHighlighter>{`import { 
        Move, 
        Card, 
        CardBody 
      } from '@razorpay/blade/components';


      <Move>
        <Card>
          <CardBody>Card that animates</CardBody>
        </Card>
      </Move>
      `}</SandboxHighlighter>
      </Box>
      <Box flex="1">
        <Story of={MoveDefault} meta={MoveMeta} />
      </Box>
    </Box>
  );
};

export const SlideIntro = (): React.ReactElement => {
  return (
    <Box display="flex" gap="spacing.10" alignItems="center" justifyContent="space-between">
      <Box flex="1" padding="spacing.4" elevation="lowRaised" borderRadius="medium" width="100%">
        <SandboxHighlighter>{`import { 
        Slide, 
        Card, 
        CardBody 
      } from '@razorpay/blade/components';


      <Slide direction={{ enter: 'right', exit: 'bottom' }}>
        <Card>
          <CardBody>Card that animates</CardBody>
        </Card>
      </Slide>
      `}</SandboxHighlighter>
      </Box>
      <Box flex="1">
        <Story of={SlideWithDifferentDirections} meta={SlideMeta} />
      </Box>
    </Box>
  );
};

export const ScaleIntro = (): React.ReactElement => {
  return (
    <Box display="flex" gap="spacing.10" alignItems="center" justifyContent="space-between">
      <Box flex="1" padding="spacing.4" elevation="lowRaised" borderRadius="medium" width="100%">
        <SandboxHighlighter>{`import { 
        Scale, 
      } from '@razorpay/blade/components';


      <Scale motionTriggers={['hover']}>
        <img src="" alt="" />
      </Scale>
      `}</SandboxHighlighter>
      </Box>
      <Box flex="1">
        <Story of={ScaleDefault} meta={ScaleMeta} />
      </Box>
    </Box>
  );
};

export const ElevateIntro = (): React.ReactElement => {
  return (
    <Box display="flex" gap="spacing.10" alignItems="center" justifyContent="space-between">
      <Box flex="1" padding="spacing.4" elevation="lowRaised" borderRadius="medium" width="100%">
        <SandboxHighlighter>{`import { 
        Elevate, 
      } from '@razorpay/blade/components';


      <Elevate motionTriggers={['hover']}>
        <Card>
          <CardBody>Card that drops shadow on hover</CardBody>
        </Card>
      </Elevate>
      `}</SandboxHighlighter>
      </Box>
      <Box flex="1">
        <Story of={ElevateDefault} meta={ElevateMeta} />
      </Box>
    </Box>
  );
};

export const MorphIntro = (): React.ReactElement => {
  return (
    <Box display="flex" gap="spacing.10" alignItems="center" justifyContent="space-between">
      <Box flex="1" padding="spacing.4" elevation="lowRaised" borderRadius="medium" width="100%">
        <SandboxHighlighter>{`import { 
        Morph,
        Button,
        TextInput 
      } from '@razorpay/blade/components';
      import { AnimatePresence } from 'framer-motion';

      <AnimatePresence>
      {
          isButton
          ? (
            <Morph layoutId="input-button-morph">
              <Button>Click to Enter</Button>
            </Morph>
          )
          : (
            <Morph layoutId="input-button-morph">
              <TextInput />
            </Morph>
          )
      }
      </AnimatePresence>
      `}</SandboxHighlighter>
      </Box>
      <Box flex="1">
        <Story of={MorphDefault} meta={MorphMeta} />
      </Box>
    </Box>
  );
};

export const StaggerIntro = (): React.ReactElement => {
  return (
    <Box
      display="flex"
      gap="spacing.4"
      alignItems="center"
      flexDirection="column-reverse"
      justifyContent="space-between"
    >
      <Box padding="spacing.4" elevation="lowRaised" borderRadius="medium" width="100%">
        <SandboxHighlighter>{`import { 
        Stagger,
        Move, 
        Card, 
        CardBody 
      } from '@razorpay/blade/components';


      <Stagger>
        <Move><Card /></Move>
        <Move><Card /></Move>
        <Move><Card /></Move>
      </Stagger
      `}</SandboxHighlighter>
      </Box>
      <Box maxWidth="100%">
        <Story of={StaggerDefault} meta={StaggerMeta} />
      </Box>
    </Box>
  );
};

export const AnimateInteractionsIntro = (): React.ReactElement => {
  return (
    <Box display="flex" gap="spacing.10" alignItems="center" justifyContent="space-between">
      <Box flex="1" padding="spacing.4" elevation="lowRaised" borderRadius="medium" width="100%">
        <SandboxHighlighter>{`import { 
        AnimateInteractions,
        Move, 
        Card, 
        CardBody,
        Box,
        Button
      } from '@razorpay/blade/components';


      <AnimateInteractions motionTrigggers={['hover']}>
        <Card>
          <CardBody>
            <Text>Card text</Text>
            <Move motionTriggers={['on-animate-interactions']}>
              <Box>
                <Button>Submit</Button>
              </Box>
            </Move>
          </CardBody>
        </Card>
      </AnimateInteractions>
      `}</SandboxHighlighter>
      </Box>
      <Box flex="1">
        <Story of={AnimateChildOnCardHover} meta={AnimateInteractionsMeta} />
      </Box>
    </Box>
  );
};
