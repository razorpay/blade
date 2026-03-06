/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable consistent-return */
import type { StoryFn, Meta } from '@storybook/react';
import React, { useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import { m as motion } from 'framer-motion';
import type { RazorSenseProps } from '../RzpGlass/index';
import {
  RazorSense as RazorSenseComponent,
  RazorSenseGradient,
  preloadRazorSenseAssets,
} from '../';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Heading, Text } from '~components/Typography';
import { Button } from '~components/Button';
import { CheckIcon } from '~components/Icons';
import { List, ListItem, ListItemText } from '~components/List';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentName="RazorSense"
      componentDescription="This is the RazorSense component which can be used for showing a RazorSense effect on the screen"
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=80952-9051&t=ozxGdqCDqI9hRYY8-1&scaling=min-zoom&page-id=614%3A1&mode=design"
    />
  );
};

export default {
  title: 'Components/RazorSense',
  component: RazorSenseComponent,
  args: {},
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<RazorSenseProps>;

const RazorSenseTemplate: StoryFn<typeof RazorSenseComponent> = (args) => {
  return (
    <Box width="100%" height="100vh">
      <RazorSenseComponent width="100%" height="100%" preset={args.preset} {...args} />
    </Box>
  );
};

export const Default = RazorSenseTemplate.bind({});

export const DefaultPaused = RazorSenseTemplate.bind({});
DefaultPaused.args = {
  paused: true,
  startTime: 8,
  animateLightIndependently: true,
  lightStartFrame: 0,
};

export const Zoomed = RazorSenseTemplate.bind({});
Zoomed.args = {
  preset: 'zoomed',
};

const BottomWaveTemplate: StoryFn<typeof RazorSenseComponent> = () => {
  return (
    <Box width="calc(100% + 24px)" height="100vh" marginLeft="-12px" marginRight="-12px">
      <RazorSenseComponent width="100%" height="250px" preset="bottomWave" />
    </Box>
  );
};
export const BottomWave = BottomWaveTemplate.bind({});

const PropsExplanationTemplate: StoryFn<typeof RazorSenseComponent> = () => {
  return (
    <Box padding="spacing.8" maxWidth="800px">
      <Heading size="xlarge" marginBottom="spacing.6">
        RazorSense Props
      </Heading>

      <Box marginBottom="spacing.8">
        <Heading size="medium" marginBottom="spacing.4">
          Basic Props
        </Heading>
        <List>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">width</Text> - CSS width of the canvas (default:
              &quot;100%&quot;)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">height</Text> - CSS height of the canvas (default:
              &quot;100%&quot;)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">preset</Text> - Named preset: &quot;default&quot;,
              &quot;zoomed&quot;, &quot;bottomWave&quot;, &quot;rippleWave&quot;,
              &quot;circleSlideUp&quot;
            </ListItemText>
          </ListItem>
        </List>
      </Box>

      <Box marginBottom="spacing.8">
        <Heading size="medium" marginBottom="spacing.4">
          Playback Control
        </Heading>
        <List>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">paused</Text> - Whether video is paused (default: false)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">startTime</Text> - Video start time in seconds (default: 0)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">endTime</Text> - Video end time in seconds (default: 14)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">playbackRate</Text> - Video playback rate multiplier (default:
              1.0)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">animateLightIndependently</Text> - Animate light effect
              independently of video (default: true)
            </ListItemText>
          </ListItem>
        </List>
      </Box>

      <Box marginBottom="spacing.8">
        <Heading size="medium" marginBottom="spacing.4">
          Effect Toggles
        </Heading>
        <List>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">enableDisplacement</Text> - Enable displacement effect
              (default: true)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">enableColorama</Text> - Enable colorama color grading
              (default: true)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">enableBloom</Text> - Enable bloom post-processing (default:
              true)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">enableLightSweep</Text> - Enable light sweep effect (default:
              true)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">enableCenterElement</Text> - Toggle center element (default:
              true)
            </ListItemText>
          </ListItem>
        </List>
      </Box>

      <Box marginBottom="spacing.8">
        <Heading size="medium" marginBottom="spacing.4">
          Zoom & Pan
        </Heading>
        <List>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">zoom</Text> - Zoom level (1.0 = normal, 2.0 = 2x) (default:
              1.0)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">panX</Text> - Horizontal pan offset (-1 to 1) (default: 0.0)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">panY</Text> - Vertical pan offset (-1 to 1) (default: 0.0)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">edgeFeather</Text> - Per-side edge feathering [top, right,
              bottom, left] (0-1)
            </ListItemText>
          </ListItem>
        </List>
      </Box>

      <Box marginBottom="spacing.8">
        <Heading size="medium" marginBottom="spacing.4">
          Colorama Config
        </Heading>
        <List>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">gradientMapBlend</Text> - Cross-fade between gradient maps
              (0.0-1.0) (default: 0.0)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">cycleRepetitions</Text> - Stretch/compress gradient index
              (default: 1.0)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">cycleSpeed</Text> - Cycling animation speed (default: 0.0)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">modifyGamma</Text> - Gamma curve for color grading (default:
              1.05)
            </ListItemText>
          </ListItem>
        </List>
      </Box>

      <Box marginBottom="spacing.8">
        <Heading size="medium" marginBottom="spacing.4">
          Displacement Config
        </Heading>
        <List>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">numSegments</Text> - Number of glass slits (default: 45.0)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">slitAngle</Text> - Angle of slits in radians (default: 0.15)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">displacementX</Text> - X displacement in pixels (default:
              -12.0)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">displacementY</Text> - Y displacement in pixels (default:
              20.0)
            </ListItemText>
          </ListItem>
        </List>
      </Box>

      <Box marginBottom="spacing.8">
        <Heading size="medium" marginBottom="spacing.4">
          Asset Customization
        </Heading>
        <List>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">videoSrc</Text> - URL to video source (mutually exclusive with
              imageSrc)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">imageSrc</Text> - URL to static image (replaces video)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">gradientMapSrc</Text> - URL to gradient map for colorama
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">gradientMap2Src</Text> - URL to second gradient map for
              blending
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">centerGradientMapSrc</Text> - URL to center gradient map
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">gradientMapCanvas</Text> - Canvas element for runtime gradient
              hot-swap
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">assetsPath</Text> - Base CDN path for default assets
            </ListItemText>
          </ListItem>
        </List>
      </Box>

      <Box marginBottom="spacing.8">
        <Heading size="medium" marginBottom="spacing.4">
          Light & Color Correction
        </Heading>
        <List>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">lightIntensity</Text> - Strength of light sweep (default: 0.2)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">ccBlackPoint</Text> - Levels black point (default: 0.0)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">ccWhitePoint</Text> - Levels white point (default: 0.9)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">ccGamma</Text> - Output gamma (default: 1.2)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">backgroundColor</Text> - Background color RGB array [0-1, 0-1,
              0-1] to blend the effect with background color.
            </ListItemText>
          </ListItem>
        </List>
      </Box>

      <Box marginBottom="spacing.8">
        <Heading size="medium" marginBottom="spacing.4">
          Callbacks
        </Heading>
        <List>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">onLoad</Text> - Called when assets are loaded
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">onError</Text> - Called on error (receives Error object)
            </ListItemText>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export const PropsExplanation = PropsExplanationTemplate.bind({});

const RzpGlassSuccessAnimationTemplate: StoryFn<typeof RazorSenseComponent> = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [assetsPreloaded, setAssetsPreloaded] = useState(false);

  useEffect(() => {
    preloadRazorSenseAssets('circleSlideUp')
      .then(() => {
        setAssetsPreloaded(true);
      })
      .catch((error) => {
        console.error('Failed to preload assets:', error);
      });
  }, []);

  if (!assetsPreloaded) {
    return <div>Loading...</div>;
  }

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      {/* Main area: shader display */}
      <Box
        flex="1"
        position="relative"
        backgroundColor="surface.background.gray.intense"
        overflow="hidden"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {/* Success UI Card */}
        <Box
          position="relative"
          zIndex={100}
          backgroundColor="surface.background.gray.intense"
          padding="spacing.10"
          borderRadius="large"
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap="spacing.6"
          maxWidth="500px"
          width="90%"
        >
          {/* Success Icon with RzpGlass animation */}
          <Box position="relative" width="80px" height="80px">
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: isLoaded ? 0 : 1,
              }}
              transition={{
                delay: isLoaded ? 0.5 : 0,
                duration: isLoaded ? 1.5 : 0.3,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -45%)',
              }}
            >
              <RazorSenseComponent
                width="500px"
                height="800px"
                preset="circleSlideUp"
                edgeFeather={[0, 0, 0.2, 0]}
                onLoad={() => setIsLoaded(true)}
              />
            </motion.div>

            {/* Success Icon */}
            <motion.div
              initial={{
                scale: 0,
                opacity: 0,
              }}
              animate={{
                scale: isLoaded ? 1 : 0,
                opacity: isLoaded ? 1 : 0,
              }}
              transition={{
                delay: 1,
                duration: 0.5,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              style={{
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Box
                backgroundColor="feedback.background.positive.subtle"
                borderRadius="max"
                width="80px"
                height="80px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <CheckIcon size="xlarge" color="feedback.icon.positive.intense" />
              </Box>
            </motion.div>
          </Box>

          <motion.div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              width: '100%',
            }}
            initial="hidden"
            animate={isLoaded ? 'visible' : 'hidden'}
            variants={{
              visible: {
                transition: {
                  delayChildren: 1.3,
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {/* Heading */}
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  y: 20,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                },
              }}
              transition={{
                duration: 0.5,
                ease: 'easeOut',
              }}
            >
              <Heading size="large" textAlign="center">
                You&apos;re officially in!
              </Heading>
            </motion.div>

            {/* Description Text */}
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  y: 20,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                },
              }}
              transition={{
                duration: 0.5,
                ease: 'easeOut',
              }}
            >
              <Text size="medium" textAlign="center" color="surface.text.gray.muted">
                Now relax while the formal checks happen. We&apos;re sending a little cheer your way
                in the meantime.
              </Text>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  y: 20,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                },
              }}
              transition={{
                duration: 0.5,
                ease: 'easeOut',
              }}
            >
              <Button variant="primary" size="large" isFullWidth>
                Lets! Get Started
              </Button>
            </motion.div>

            {/* Countdown Text */}
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  y: 20,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                },
              }}
              transition={{
                duration: 0.5,
                ease: 'easeOut',
              }}
            >
              <Text size="small" textAlign="center" color="surface.text.gray.muted">
                Redirecting to your Razorpay home in 15 seconds
              </Text>
            </motion.div>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export const RzpGlassSuccessAnimation = RzpGlassSuccessAnimationTemplate.bind({});

const motionGStyle = {
  originX: '12px',
  originY: '12px',
} as React.CSSProperties;

const RayRotate = ({ isRunning = true }: { isRunning?: boolean }) => {
  return (
    <motion.g
      animate={isRunning ? 'start' : 'end'}
      variants={{
        start: {
          rotate: [0, 90],
          transition: {
            duration: 0.7,
            delay: 0.4,
            repeatDelay: 1.1,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          },
        },
        end: {
          rotate: 90,
          transition: { type: 'spring', stiffness: 300, damping: 40 },
        },
      }}
      initial="start"
      style={motionGStyle}
    >
      <path
        d="M3 3H7.5H9.74999L12 12L14.25 3H16.5H21V7.5V9.75L12 12L21 14.25V16.5V21H16.5H14.25L12 12L9.74999 21H7.5H3V16.5V14.25L12 12L3 9.75V7.5V3Z"
        fill="white"
      />
    </motion.g>
  );
};

const RippleWaveAnimationTemplate: StoryFn<typeof RazorSenseComponent> = () => {
  const [assetsPreloaded, setAssetsPreloaded] = useState(false);
  const [isRayAnimationRunning, setIsRayAnimationRunning] = useState(false);

  useEffect(() => {
    preloadRazorSenseAssets('rippleWave')
      .then(() => {
        setAssetsPreloaded(true);
        requestAnimationFrame(() => {
          setIsRayAnimationRunning(true);
        });
      })
      .catch((error) => {
        console.error('Failed to preload assets:', error);
      });
  }, []);

  if (!assetsPreloaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Button onClick={() => setIsRayAnimationRunning(!isRayAnimationRunning)}>
        {isRayAnimationRunning ? 'Stop Animation' : 'Start Animation'}
      </Button>
      <Box display="flex" flexDirection="column" height="100vh">
        {/* Main area: shader + floating gradient editor panel */}
        <Box
          flex="1"
          position="relative"
          backgroundColor="surface.background.gray.intense"
          overflow="hidden"
          width="100%"
          height="100%"
        >
          {/* Canvas — fills the entire main area */}
          <Box
            width="100%"
            height="100%"
            position="absolute"
            top="-30px"
            left="0px"
            right="0px"
            bottom="0px"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isRayAnimationRunning ? 1 : 0 }}
              transition={{
                duration: 0.5,
                ease: 'easeInOut',
              }}
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              <RazorSenseComponent width="100%" height="100%" preset="rippleWave" />
            </motion.div>
          </Box>
          <RazorSenseGradient
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            size={50}
            viewBox="0 0 24 24"
            origin={[0.5, 0.5]}
          >
            <RayRotate isRunning={isRayAnimationRunning} />
          </RazorSenseGradient>
        </Box>
      </Box>
    </>
  );
};

export const RippleWaveAnimation = RippleWaveAnimationTemplate.bind({});
