import type { BoxProps } from '~components/Box';
import { Sandbox } from '~utils/storybook/Sandbox';

export const FadeSandbox = ({ padding }: { padding?: BoxProps['padding'] }): React.ReactElement => {
  return (
    <Sandbox padding={padding}>{`import React from 'react';
      import { 
        Fade,
        Badge, 
        InfoIcon, 
        Box,
        Button
      } from '@razorpay/blade/components';

      function App() {
        const [isVisible, setIsVisible] = React.useState(true);

        return (
          <Box>
            <Button marginBottom="spacing.3" onClick={() => setIsVisible(!isVisible)}>Toggle Fade</Button>

            <Box>
              <Fade isVisible={isVisible}>
                <Badge color="neutral" icon={InfoIcon}>
                  Boop
                </Badge>
              </Fade>
            </Box>
          </Box>
        )
      }

      export default App;
    `}</Sandbox>
  );
};

export const MoveSandbox = ({ padding }: { padding?: BoxProps['padding'] }): React.ReactElement => {
  return (
    <Sandbox padding={padding}>{`import React from 'react';
    import { 
      Move,
      Card, 
      CardBody,
      Text, 
      Box,
      Button
    } from '@razorpay/blade/components';

    function App() {
      const [isVisible, setIsVisible] = React.useState(true);

      return (
        <Box>
          <Button marginBottom="spacing.3" onClick={() => setIsVisible(!isVisible)}>Toggle Move</Button>
          <Move isVisible={isVisible}>
            <Card>
              <CardBody>
                <Text>Card that animates</Text>
              </CardBody>
            </Card>
          </Move>
        </Box>
      )
    }

    export default App;
    `}</Sandbox>
  );
};

export const SlideSandbox = ({
  padding,
}: {
  padding?: BoxProps['padding'];
}): React.ReactElement => {
  return (
    <Sandbox padding={padding}>{`import React from 'react';
    import { 
      Slide,
      Card, 
      CardBody,
      Text, 
      Box,
      Button
    } from '@razorpay/blade/components';

    function App() {
      const [isVisible, setIsVisible] = React.useState(true);

      return (
        <Box>
          <Button marginBottom="spacing.3" onClick={() => setIsVisible(!isVisible)}>Toggle Move</Button>
          <Slide isVisible={isVisible} direction="right" fromOffset="100%">
            <Card>
              <CardBody>
                <Text>Card that animates</Text>
              </CardBody>
            </Card>
          </Slide>
        </Box>
      )
    }

    export default App;
    `}</Sandbox>
  );
};

export const ScaleSandbox = ({
  padding,
}: {
  padding?: BoxProps['padding'];
}): React.ReactElement => {
  return (
    <Sandbox padding={padding}>{`import { 
      Scale,
      Card, 
      CardBody,
      Text, 
      Box,
    } from '@razorpay/blade/components';

    function App() {
      return (
        <Box>
          <Scale motionTriggers={['hover']}>
            <Card>
              <CardBody>
                <Text>Card that scales on hover</Text>
              </CardBody>
            </Card>
          </Scale>
        </Box>
      )
    }

    export default App;
    `}</Sandbox>
  );
};

export const MorphSandbox = ({
  padding,
}: {
  padding?: BoxProps['padding'];
}): React.ReactElement => {
  return (
    <Sandbox padding={padding}>
      {`
          import { Morph, Box, TextInput } from '@razorpay/blade/components';

          const App = () => {
            const [showNameButton, setShowNameButton] = React.useState(true);

            return (
              <AnimatePresence>
                {showNameButton ? (
                  <Morph layoutId="button-input-morph">
                    <Button onClick={() => setShowNameButton(false)}>Click to Enter Name</Button>
                  </Morph>
                ) : (
                  <Morph layoutId="button-input-morph">
                    <Box display="block" width="240px">
                      <TextInput
                        accessibilityLabel="Name"
                        placeholder="Enter your Name"
                        trailingButton={
                          <Link onClick={() => setShowNameButton(true)} variant="button">
                            Submit
                          </Link>
                        }
                      />
                    </Box>
                  </Morph>
                )}
              </AnimatePresence>
            )
          }

          export default App;
        `}
    </Sandbox>
  );
};

export const AnimateInteractionsSandbox = ({
  padding,
}: {
  padding?: BoxProps['padding'];
}): React.ReactElement => {
  return (
    <Sandbox padding={padding}>
      {`
      import { 
        AnimateInteractions,
        Move,
        Card, 
        CardBody,
        Box,
        Heading,
        Text,
        Button,
        ExternalLinkIcon,
      } from '@razorpay/blade/components';
  
      function App() {
        return (
          <AnimateInteractions motionTriggers={['hover']}>
            <Card width="400px" padding="spacing.0" backgroundColor="surface.background.gray.moderate">
              <CardBody>
                <Box overflow="auto">
                  <Box padding="spacing.6">
                    <Heading as="h2" weight="regular">
                      Payment Pages
                    </Heading>
                    <Heading marginY="spacing.4" size="large" as="h3">
                      Accept payments{' '}
                      <Heading size="large" as="span" color="surface.text.primary.normal">
                        without coding on a custom branded store
                      </Heading>
                    </Heading>
                    <Text>
                      Hover over this card to see how AnimateInteractions component helps in animating child
                      based on interactions on parent
                    </Text>
                  </Box>

                  <Move motionTriggers={['on-animate-interactions']}>
                    <Box
                      display="flex"
                      gap="spacing.4"
                      justifyContent="flex-end"
                      padding={['spacing.4', 'spacing.6']}
                      elevation="highRaised"
                    >
                      <Button variant="secondary" icon={ExternalLinkIcon} iconPosition="right">
                        Know More
                      </Button>
                      <Button>Sign Up</Button>
                    </Box>
                  </Move>
                </Box>
              </CardBody>
            </Card>
          </AnimateInteractions>
        )
      }

      export default App;
    `}
    </Sandbox>
  );
};

export const StaggerSandbox = ({
  padding,
}: {
  padding?: BoxProps['padding'];
}): React.ReactElement => {
  return (
    <Sandbox padding={padding}>
      {`
      import React from 'react';
      import { 
        Stagger,
        Move,
        ChipGroup,
        Chip,
        Box,
        Button
      } from '@razorpay/blade/components';
  
      function App() {
        const [isVisible, setIsVisible] = React.useState(true);
  
        return (
          <Box>
            <Button marginBottom="spacing.3" onClick={() => setIsVisible(!isVisible)}>Toggle Move</Button>
            <Stagger isVisible={isVisible}>
              <ChipGroup label="Account Information" selectionType="multiple">
                {[
                  'Business Type: Freelance',
                  'Account Status: Activated',
                  'Test Mode: Disabled',
                  'Primary Product: Banking',
                ].map((chipLabel) => {
                  return (
                    <Move>
                      <Chip value={chipLabel.toLowerCase().replace(/ /g, '-')}>{chipLabel}</Chip>
                    </Move>
                  );
                })}
              </ChipGroup>
          </Stagger>
          </Box>
        )
      }
  
      export default App;
      `}
    </Sandbox>
  );
};
