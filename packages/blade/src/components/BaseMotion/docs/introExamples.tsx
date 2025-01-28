import { Story } from '@storybook/addon-docs';
import { Box } from '~components/Box';
import { SandboxHighlighter } from '~utils/storybook/Sandbox/SandpackEditor';

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
        <Story id="motion-fade--default" />
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
        <Story id="motion-move--default" />
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
        <Story id="motion-slide--with-different-directions" />
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
        <Story id="motion-scale--default" />
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
        <Story id="motion-morph--default" />
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
        <Story id="motion-stagger--default" />
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
        <Story id="motion-animateinteractions--animate-child-on-card-hover" />
      </Box>
    </Box>
  );
};
