import React from 'react';
import { AnimateInteractions } from '~components/AnimateInteractions';
import type { BoxProps } from '~components/Box';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Fade } from '~components/Fade';
import { Link } from '~components/Link';
import { Morph } from '~components/Morph';
import { Move } from '~components/Move';
import { Scale } from '~components/Scale';
import { Slide } from '~components/Slide';
import { Stagger } from '~components/Stagger';
import { Heading, Text } from '~components/Typography';

const ShowcaseBox = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <Box
      borderWidth="thin"
      borderColor="surface.border.gray.normal"
      borderRadius="medium"
      height="200px"
      minWidth="200px"
      backgroundColor="surface.background.gray.intense"
      padding="spacing.8"
      overflow="hidden"
    >
      {children}
    </Box>
  );
};

const MotionExampleBox = React.forwardRef(
  ({ name, borderRadius }: { name?: string; borderRadius?: BoxProps['borderRadius'] }, ref) => {
    return (
      <Box
        ref={ref as never}
        backgroundColor="surface.background.gray.intense"
        elevation="midRaised"
        height="100%"
        width="100%"
        borderColor="surface.border.gray.muted"
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius={borderRadius}
      >
        {name && (
          <Text key="morph-text" weight="medium" size="large">
            {name}
          </Text>
        )}
      </Box>
    );
  },
);

const ShowcaseLinkBox = ({
  children,
  name,
}: {
  children: React.ReactElement;
  name: string;
}): React.ReactElement => {
  const linkHash = name.toLowerCase();
  return (
    <Box textAlign="center">
      {children}
      <Link
        href={`/?path=/docs/motion-introduction-to-motion--docs#${linkHash}`}
        onClick={() => {
          document.querySelector(`#${linkHash}`)?.scrollIntoView({ behavior: 'smooth' });
        }}
        marginTop="spacing.2"
        size="large"
      >
        {name}
      </Link>
    </Box>
  );
};

export const Showcase = (): React.ReactElement => {
  const [isVisible, setIsVisible] = React.useState(true);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const intervalRef: React.MutableRefObject<ReturnType<typeof setInterval> | null> = React.useRef(
    null,
  );

  const stopAnimations = (): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsAnimating(false);
  };

  const startAnimations = (): void => {
    setIsAnimating(true);
    intervalRef.current = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, 2000);
  };

  React.useEffect(() => {
    startAnimations();
    return () => {
      stopAnimations();
    };
  }, []);

  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      <Box>
        <Heading size="large" marginY="spacing.4">
          Entry / Exit Presets
        </Heading>
        <Box display="flex" gap="spacing.6">
          <ShowcaseLinkBox name="Fade">
            <ShowcaseBox>
              <Fade isVisible={isVisible}>
                <MotionExampleBox name="Fade" />
              </Fade>
            </ShowcaseBox>
          </ShowcaseLinkBox>
          <ShowcaseLinkBox name="Move">
            <ShowcaseBox>
              <Move isVisible={isVisible}>
                <MotionExampleBox name="Move" />
              </Move>
            </ShowcaseBox>
          </ShowcaseLinkBox>
          <ShowcaseLinkBox name="Slide">
            <ShowcaseBox>
              <Slide isVisible={isVisible} direction="right" fromOffset="100%">
                <MotionExampleBox name="Slide" />
              </Slide>
            </ShowcaseBox>
          </ShowcaseLinkBox>
        </Box>
      </Box>

      <Box>
        <Heading size="large" marginY="spacing.4">
          Highlight Presets
        </Heading>

        <Box display="flex" gap="spacing.6">
          <ShowcaseLinkBox name="Scale">
            <ShowcaseBox>
              <Scale isHighlighted={isVisible}>
                <MotionExampleBox name="Scale" />
              </Scale>
            </ShowcaseBox>
          </ShowcaseLinkBox>
          <ShowcaseLinkBox name="Morph">
            <ShowcaseBox>
              {isVisible ? (
                <Morph layoutId="morph-border-radius">
                  <MotionExampleBox name="Morph" />
                </Morph>
              ) : (
                <Morph layoutId="morph-border-radius">
                  <MotionExampleBox name="Morph" borderRadius="round" />
                </Morph>
              )}
            </ShowcaseBox>
          </ShowcaseLinkBox>
        </Box>
      </Box>

      <Box>
        <Heading size="large" marginY="spacing.4">
          Utility Presets
        </Heading>
        <Box display="flex" gap="spacing.6">
          <ShowcaseLinkBox name="Stagger">
            <ShowcaseBox>
              <Stagger isVisible={isVisible}>
                <Box display="flex" gap="spacing.4" flexDirection="column" flexWrap="wrap">
                  <Move>
                    <MotionExampleBox name="Stagger" />
                  </Move>
                  <Move>
                    <MotionExampleBox name="Stagger" />
                  </Move>
                  <Move>
                    <MotionExampleBox name="Stagger" />
                  </Move>
                </Box>
              </Stagger>
            </ShowcaseBox>
          </ShowcaseLinkBox>

          <ShowcaseLinkBox name="AnimateInteractions">
            <ShowcaseBox>
              <AnimateInteractions motionTriggers={['hover', 'focus']}>
                <Box
                  backgroundColor="surface.background.gray.intense"
                  elevation="midRaised"
                  height="100%"
                  width="100%"
                  borderColor="surface.border.gray.muted"
                  padding="spacing.4"
                  position="relative"
                  textAlign="center"
                >
                  <Text display="inline-block" weight="medium" size="large">
                    AnimateInteractions
                  </Text>
                  <Text variant="caption">(hover this box)</Text>
                  <Fade motionTriggers={['on-animate-interactions']}>
                    <Box
                      position="absolute"
                      bottom="spacing.0"
                      elevation="lowRaised"
                      backgroundColor="surface.background.cloud.subtle"
                      left="spacing.0"
                      width="100%"
                      padding={['spacing.2', 'spacing.6']}
                      borderTopColor="surface.border.primary.muted"
                    >
                      <Text color="surface.text.onCloud.onSubtle">
                        I appear when parent is hovered
                      </Text>
                    </Box>
                  </Fade>
                </Box>
              </AnimateInteractions>
            </ShowcaseBox>
          </ShowcaseLinkBox>
        </Box>
      </Box>

      <Box>
        <Button
          marginTop="spacing.4"
          variant="tertiary"
          onClick={() => {
            if (isAnimating) {
              stopAnimations();
            } else {
              startAnimations();
            }
          }}
        >
          {isAnimating ? 'Stop' : 'Start'} Animations
        </Button>
      </Box>
    </Box>
  );
};
