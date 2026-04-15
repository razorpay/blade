/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable consistent-return */
import type { StoryFn, Meta } from '@storybook/react-vite';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { ReactElement } from 'react';
import { m as motion } from 'framer-motion';
import type { RazorSenseProps } from '../RzpGlass/index';
import {
  RazorSense as RazorSenseComponent,
  RazorSenseGradient,
  preloadRazorSenseAssets,
} from '../';
import { GradientEditor } from './GradientEditor';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Heading, Text } from '~components/Typography';
import { Button } from '~components/Button';
import { CheckIcon, RayIcon, RazorpayIcon } from '~components/Icons';
import { List, ListItem, ListItemText } from '~components/List';
import { ChatMessage } from '~components/ChatMessage';
import { ChatInput } from '~components/ChatInput';
import { Divider } from '~components/Divider';
import { TextInput } from '~components/Input/TextInput';
import { Link } from '~components/Link';

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
    layout: 'fullscreen',
    docs: {
      page: Page,
    },
  },
} as Meta<RazorSenseProps>;

const RazorSenseTemplate: StoryFn<typeof RazorSenseComponent> = (args) => {
  return (
    <Box width="100%" height="100vh">
      <RazorSenseComponent preset={args.preset} {...args} />
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

export const Zoomed: StoryFn<typeof RazorSenseComponent> = () => {
  return (
    <Box position="relative" display="flex" alignItems="center" height="400px" width="100%">
      <Box
        width="800px"
        height="250px"
        position="absolute"
        top="40px"
        left="0px"
        right="0px"
        bottom="0px"
        margin="auto"
        zIndex={0}
      >
        <RazorSenseComponent preset="zoomed" width="100%" height="100%" />
      </Box>
      <Box marginLeft="200px" position="relative" zIndex={1} maxWidth="500px">
        <ChatMessage
          senderType="other"
          leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
          isLoading={true}
          loadingText={['Thinking...', 'Processing your request...']}
        >
          <Text color="surface.text.gray.normal" size="medium">
            Your KYC has been verified successfully. All documents are in order and your identity
            has been confirmed.
          </Text>
        </ChatMessage>
      </Box>
    </Box>
  );
};

const BottomWaveTemplate: StoryFn<typeof RazorSenseComponent> = () => {
  return (
    <Box margin="-32px" position="relative" height="100vh">
      {/* RazorSense at the bottom */}
      <Box position="absolute" bottom="-40px" left="0px" right="0px">
        <RazorSenseComponent
          width="100%"
          height="250px"
          preset="bottomWave"
          backgroundColor={[1, 1, 1]}
        />
      </Box>
      {/* ChatInput in the middle, offset 8px from bottom */}
      <Box
        position="absolute"
        bottom="24px"
        left="0px"
        right="0px"
        display="flex"
        justifyContent="center"
        paddingX="spacing.4"
      >
        <Box width="100%" maxWidth="600px">
          <ChatInput placeholder="Ask anything..." />
        </Box>
      </Box>
    </Box>
  );
};
export const BottomWave = BottomWaveTemplate.bind({});

const RazorSensePropsTemplate: StoryFn<typeof RazorSenseComponent> = () => {
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
        <Text size="small" color="surface.text.gray.muted" marginTop="spacing.3">
          Note: The canvas automatically resizes when the container changes size (via
          ResizeObserver). It is always centered within the container, with overflow hidden.
        </Text>
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

export const RazorSensePropsExplanation = RazorSensePropsTemplate.bind({});
RazorSensePropsExplanation.storyName = 'RazorSense Props';

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
            top="-40px"
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

// ---------------------------------------------------------------------------
// Onboarding Playback Controls Story
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// usePhaseControl — generic hook for sequencing animation phases
// ---------------------------------------------------------------------------

type PhaseConfig = {
  zoom: number;
  panX: number;
  panY: number;
  paused: boolean;
  playbackRate: number;
  edgeFeather: [number, number, number, number];
  startTime: number;
  endTime: number;
  /** When set, the video plays from startTime and auto-pauses once it reaches this video time. */
  pauseAfterVideoTime?: number;
};

type PhaseDefinition<P extends string> = {
  key: P;
  label: string;
  description: string;
};

type UsePhaseControlOptions<P extends string> = {
  phases: PhaseDefinition<P>[];
  config: Record<P, PhaseConfig>;
  initialPhase: P;
  lerpSpeed?: number;
};

type UsePhaseControlReturn<P extends string> = {
  currentPhase: P;
  setCurrentPhase: (phase: P) => void;
  goToNextPhase: () => void;
  phaseConfig: PhaseConfig;
  effectivePaused: boolean;
  animValues: { zoom: number; panX: number; panY: number };
  phases: PhaseDefinition<P>[];
};

function usePhaseControl<P extends string>({
  phases,
  config,
  initialPhase,
  lerpSpeed = 0.05,
}: UsePhaseControlOptions<P>): UsePhaseControlReturn<P> {
  const [currentPhase, setCurrentPhase] = useState<P>(initialPhase);
  const [effectivePaused, setEffectivePaused] = useState(false);
  const [animValues, setAnimValues] = useState({ zoom: 1.0, panX: 0, panY: 0 });
  const animRef = useRef({ zoom: 1.0, panX: 0, panY: 0 });

  const phaseConfig = config[currentPhase];

  const goToNextPhase = (): void => {
    setCurrentPhase((prev) => {
      const idx = phases.findIndex((p) => p.key === prev);
      return phases[(idx + 1) % phases.length].key;
    });
  };

  // Handle pause logic — auto-pause when pauseAfterVideoTime is set
  useEffect(() => {
    const cfg = config[currentPhase];
    if (cfg.pauseAfterVideoTime !== undefined) {
      setEffectivePaused(false);
      const travelTime = cfg.pauseAfterVideoTime - cfg.startTime;
      const delay = (travelTime / cfg.playbackRate) * 1000;
      const timer = setTimeout(() => setEffectivePaused(true), delay);
      return () => clearTimeout(timer);
    }
    setEffectivePaused(cfg.paused);
    return undefined;
  }, [currentPhase, config]);

  // Smoothly interpolate zoom & pan via lerp on every phase change
  useEffect(() => {
    const target = config[currentPhase];
    let running = true;
    const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
    const isClose = (a: number, b: number): boolean => Math.abs(a - b) < 0.002;

    const tick = (): void => {
      if (!running) return;
      const cur = animRef.current;
      const next = {
        zoom: lerp(cur.zoom, target.zoom, lerpSpeed),
        panX: lerp(cur.panX, target.panX, lerpSpeed),
        panY: lerp(cur.panY, target.panY, lerpSpeed),
      };
      const converged =
        isClose(next.zoom, target.zoom) &&
        isClose(next.panX, target.panX) &&
        isClose(next.panY, target.panY);
      // eslint-disable-next-line prettier/prettier
      const result = converged ? { zoom: target.zoom, panX: target.panX, panY: target.panY } : next;

      animRef.current = result;
      setAnimValues(result);
      if (!converged) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    return () => {
      running = false;
    };
  }, [currentPhase, config, lerpSpeed]);

  return {
    currentPhase,
    setCurrentPhase,
    goToNextPhase,
    phaseConfig,
    effectivePaused,
    animValues,
    phases,
  };
}

// ---------------------------------------------------------------------------
// Onboarding Playback Controls Story
// ---------------------------------------------------------------------------

type OnboardingPhase = 'loading' | 'stop' | 'zoomIn' | 'zoomOut';

const ONBOARDING_PHASES: PhaseDefinition<OnboardingPhase>[] = [
  {
    key: 'loading',
    label: 'Phase 1: Loading Loop',
    description: 'Small initial animation loops continuously',
  },
  {
    key: 'stop',
    label: 'Phase 2: Resume & Stop',
    description: 'Animation plays forward until video time ~8s, then pauses',
  },
  {
    key: 'zoomIn',
    label: 'Phase 3: Zoom In',
    description: 'Camera zooms into the paused effect',
  },
  {
    key: 'zoomOut',
    label: 'Phase 4: Zoom Out',
    description: 'Camera pulls back out',
  },
];

const ONBOARDING_PHASE_CONFIG: Record<OnboardingPhase, PhaseConfig> = {
  loading: {
    zoom: 1.0,
    panX: 0,
    panY: 0,
    paused: false,
    playbackRate: 1.0,
    edgeFeather: [0, 0, 0, 0],
    startTime: 0,
    endTime: 3,
  },
  stop: {
    zoom: 1.0,
    panX: 0,
    panY: 0,
    paused: false,
    playbackRate: 1.5,
    edgeFeather: [0, 0, 0, 0],
    startTime: 2,
    endTime: 14,
    pauseAfterVideoTime: 8,
  },
  zoomIn: {
    zoom: 2.5,
    panX: 0,
    panY: -0.15,
    paused: true,
    playbackRate: 1.0,
    edgeFeather: [0.15, 0.15, 0.15, 0.15],
    startTime: 0,
    endTime: 14,
  },
  zoomOut: {
    zoom: 1.0,
    panX: 0,
    panY: 0,
    paused: true,
    playbackRate: 1.0,
    edgeFeather: [0, 0, 0, 0],
    startTime: 0,
    endTime: 14,
  },
};

const OnboardingPlaybackControlsTemplate: StoryFn<typeof RazorSenseComponent> = () => {
  const [assetsPreloaded, setAssetsPreloaded] = useState(false);
  const {
    currentPhase,
    setCurrentPhase,
    goToNextPhase,
    phaseConfig,
    effectivePaused,
    animValues,
    phases,
  } = usePhaseControl({
    phases: ONBOARDING_PHASES,
    config: ONBOARDING_PHASE_CONFIG,
    initialPhase: 'loading',
  });

  useEffect(() => {
    preloadRazorSenseAssets('default')
      .then(() => setAssetsPreloaded(true))
      .catch(console.error);
  }, []);

  if (!assetsPreloaded) {
    return <div>Loading assets...</div>;
  }

  return (
    <Box display="flex" flexDirection="column" height="100vh" margin="-40px">
      {/* Phase Controls */}
      <Box
        padding="spacing.5"
        display="flex"
        gap="spacing.4"
        alignItems="center"
        backgroundColor="surface.background.gray.moderate"
      >
        <Button variant="secondary" size="medium" onClick={goToNextPhase}>
          Go to next phase
        </Button>
        <Box display="flex" gap="spacing.3" alignItems="center">
          {phases.map(({ key, label }) => (
            <Button
              key={key}
              variant={currentPhase === key ? 'primary' : 'tertiary'}
              size="small"
              onClick={() => setCurrentPhase(key)}
            >
              {label}
            </Button>
          ))}
        </Box>
        <Text size="medium" color="surface.text.gray.muted" marginLeft="auto">
          {phases.find((p) => p.key === currentPhase)?.description}
        </Text>
      </Box>

      {/* RazorSense Display */}
      <Box
        flex="1"
        position="relative"
        overflow="hidden"
        backgroundColor="surface.background.gray.intense"
      >
        <RazorSenseComponent
          width="100%"
          height="100%"
          preset="default"
          paused={effectivePaused}
          playbackRate={phaseConfig.playbackRate}
          zoom={animValues.zoom}
          panX={animValues.panX}
          panY={animValues.panY}
          edgeFeather={phaseConfig.edgeFeather}
          startTime={phaseConfig.startTime}
          endTime={phaseConfig.endTime}
          lightStartFrame={currentPhase === 'stop' ? 0 : 140}
        />
      </Box>
    </Box>
  );
};

export const OnboardingPlaybackControls = OnboardingPlaybackControlsTemplate.bind({});

// ---------------------------------------------------------------------------
// RazorSenseGradient Examples
// ---------------------------------------------------------------------------

const RazorSenseGradientBasicTemplate: StoryFn<typeof RazorSenseComponent> = () => {
  const origins: Array<{ origin: [number, number]; label: string }> = [
    { origin: [0, 0], label: 'Top-Left [0,0]' },
    { origin: [0.5, 0], label: 'Top-Center [0.5,0]' },
    { origin: [1, 0], label: 'Top-Right [1,0]' },
    { origin: [0, 0.5], label: 'Middle-Left [0,0.5]' },
    { origin: [1, 0.5], label: 'Middle-Right [1,0.5]' },
  ];

  return (
    <Box padding="spacing.8">
      <Heading size="large" marginBottom="spacing.6">
        RazorSenseGradient - Basic Examples
      </Heading>
      <Text marginBottom="spacing.6" color="surface.text.gray.muted">
        RazorSenseGradient renders an animated WebGL gradient clipped to any SVG shape you pass as
        children. Use fill=&quot;white&quot; for the visible area.
      </Text>

      <Heading size="medium" marginBottom="spacing.4">
        Shapes
      </Heading>
      <Box
        display="flex"
        gap="spacing.8"
        flexWrap="wrap"
        alignItems="center"
        marginBottom="spacing.8"
      >
        {/* Rounded Rect */}
        <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.3">
          <RazorSenseGradient size={100} viewBox="0 0 24 24" origin={[0.5, 0.5]}>
            <rect x="2" y="2" width="20" height="20" rx="2" fill="white" />
          </RazorSenseGradient>
          <Text size="small" color="surface.text.gray.muted">
            Rounded Rect
          </Text>
        </Box>

        {/* Heart Shape */}
        <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.3">
          <RazorSenseGradient size={100} viewBox="0 0 24 24" origin={[0.5, 0.5]}>
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="white"
            />
          </RazorSenseGradient>
          <Text size="small" color="surface.text.gray.muted">
            Heart
          </Text>
        </Box>

        {/* Razorpay */}
        <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.3">
          <RazorSenseGradient size={100} viewBox="0 0 20 20" origin={[0.5, 0.2]}>
            <RazorpayIcon color="surface.icon.staticWhite.normal" size="large" />
          </RazorSenseGradient>
          <Text size="small" color="surface.text.gray.muted">
            Razorpay
          </Text>
        </Box>
      </Box>

      <Heading size="medium" marginBottom="spacing.4">
        Sizes
      </Heading>
      <Text marginBottom="spacing.4" color="surface.text.gray.muted">
        The size prop controls the side length of the square canvas in CSS pixels.
      </Text>
      <Box
        display="flex"
        gap="spacing.8"
        flexWrap="wrap"
        alignItems="flex-end"
        marginBottom="spacing.8"
      >
        {[40, 60, 80, 120].map((s) => (
          <Box key={s} display="flex" flexDirection="column" alignItems="center" gap="spacing.3">
            <RazorSenseGradient size={s} viewBox="0 0 24 24" origin={[0.5, 0.5]}>
              <path
                d="M3 3H7.5H9.74999L12 12L14.25 3H16.5H21V7.5V9.75L12 12L21 14.25V16.5V21H16.5H14.25L12 12L9.74999 21H7.5H3V16.5V14.25L12 12L3 9.75V7.5V3Z"
                fill="white"
              />
            </RazorSenseGradient>
            <Text size="small" color="surface.text.gray.muted">
              {s}px
            </Text>
          </Box>
        ))}
      </Box>

      <Heading size="medium" marginBottom="spacing.4">
        Gradient Origins
      </Heading>
      <Text marginBottom="spacing.4" color="surface.text.gray.muted">
        The origin prop controls where the radial gradient originates. [0,0] is top-left, [0.5,0.5]
        is center, [1,1] is bottom-right.
      </Text>
      <Box display="flex" gap="spacing.6" flexWrap="wrap">
        {origins.map(({ origin, label }) => (
          <Box
            key={label}
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap="spacing.3"
          >
            <RazorSenseGradient size={80} viewBox="0 0 24 24" origin={origin}>
              <rect x="2" y="2" width="20" height="20" rx="2" fill="white" />
            </RazorSenseGradient>
            <Text size="xsmall" color="surface.text.gray.muted">
              {label}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export const RazorSenseGradientBasic = RazorSenseGradientBasicTemplate.bind({});

const RazorSenseGradientPropsTemplate: StoryFn<typeof RazorSenseComponent> = () => {
  return (
    <Box padding="spacing.8" maxWidth="800px">
      <Heading size="xlarge" marginBottom="spacing.6">
        RazorSenseGradient Props
      </Heading>

      <Box marginBottom="spacing.8">
        <Heading size="medium" marginBottom="spacing.4">
          Component Props
        </Heading>
        <List>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">children</Text> - SVG elements that define the mask shape. Use
              fill=&quot;white&quot; for visible areas. Supports motion.* variants from
              framer-motion.
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">size</Text> - Side length of the square canvas in CSS pixels
              (default: 200)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">viewBox</Text> - SVG viewBox for the mask coordinate space.
              Match this to your path&apos;s native coordinate system (default: &quot;0 0 24
              24&quot;)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">origin</Text> - Origin of the radial gradient in UV space as
              [x, y] tuple. [0,0]=top-left, [0.5,0.5]=center, [1,1]=bottom-right (default: [0.5,
              0.0])
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">className</Text> - CSS class name for the container
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text weight="semibold">style</Text> - Inline styles for the container
            </ListItemText>
          </ListItem>
        </List>
      </Box>

      <Box marginBottom="spacing.8">
        <Heading size="medium" marginBottom="spacing.4">
          Usage Notes
        </Heading>
        <List>
          <ListItem>
            <ListItemText>
              Children must be valid SVG elements (path, circle, rect, g, text, etc.)
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              Use fill=&quot;white&quot; on shapes for them to be visible through the gradient
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              For animations, use framer-motion&apos;s SVG variants: motion.path, motion.g,
              motion.circle, etc.
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              The gradient uses WebGL canvas internally - ensure browser compatibility
            </ListItemText>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export const RazorSenseGradientProps = RazorSenseGradientPropsTemplate.bind({});

// ---------------------------------------------------------------------------
// Tweakpane Playground Story
// ---------------------------------------------------------------------------

type TweakpaneControls = {
  preset: 'default' | 'zoomed' | 'bottomWave' | 'rippleWave' | 'circleSlideUp';
  paused: boolean;
  startTime: number;
  endTime: number;
  playbackRate: number;
  animateLightIndependently: boolean;
  enableDisplacement: boolean;
  enableColorama: boolean;
  enableBloom: boolean;
  enableLightSweep: boolean;
  enableCenterElement: boolean;
  zoom: number;
  panX: number;
  panY: number;
  edgeFeatherTop: number;
  edgeFeatherRight: number;
  edgeFeatherBottom: number;
  edgeFeatherLeft: number;
  gradientMapBlend: number;
  cycleRepetitions: number;
  cycleSpeed: number;
  modifyGamma: number;
  inputMin: number;
  inputMax: number;
  phaseShift: number;
  posterizeLevels: number;
  blendWithOriginal: number;
  numSegments: number;
  slitAngle: number;
  displacementX: number;
  displacementY: number;
  lightIntensity: number;
  lightStartFrame: number;
  ccBlackPoint: number;
  ccWhitePoint: number;
  ccGamma: number;
  ccMidtoneGamma: number;
  ccContrast: number;
  centerAnimDuration: number;
  animateCycleReps: boolean;
  cycleRepetitionsStart: number;
  cycleRepetitionsEnd: number;
  cycleRepetitionsStartFrame: number;
  cycleRepetitionsDuration: number;
  aspectRatio: number;
  bgColorR: number;
  bgColorG: number;
  bgColorB: number;
};

const DEFAULT_CONTROLS: TweakpaneControls = {
  preset: 'default',
  paused: false,
  startTime: 0,
  endTime: 14,
  playbackRate: 1.0,
  animateLightIndependently: false,
  enableDisplacement: true,
  enableColorama: true,
  enableBloom: true,
  enableLightSweep: true,
  enableCenterElement: true,
  zoom: 1.0,
  panX: 0.0,
  panY: 0.0,
  edgeFeatherTop: 0,
  edgeFeatherRight: 0,
  edgeFeatherBottom: 0,
  edgeFeatherLeft: 0,
  gradientMapBlend: 0.0,
  cycleRepetitions: 1.0,
  cycleSpeed: 0.0,
  modifyGamma: 1.05,
  inputMin: 0.0,
  inputMax: 1.0,
  phaseShift: 0.0,
  posterizeLevels: 0.0,
  blendWithOriginal: 0.0,
  numSegments: 45.0,
  slitAngle: 0.15,
  displacementX: -12.0,
  displacementY: -20.0,
  lightIntensity: 0.2,
  lightStartFrame: 140,
  ccBlackPoint: 0.0,
  ccWhitePoint: 0.9,
  ccGamma: 1.2,
  ccMidtoneGamma: 1.2,
  ccContrast: 0.0,
  centerAnimDuration: 6.0,
  animateCycleReps: true,
  cycleRepetitionsStart: 1.0,
  cycleRepetitionsEnd: 1.15,
  cycleRepetitionsStartFrame: 0,
  cycleRepetitionsDuration: 140,
  aspectRatio: 1.5,
  bgColorR: -1,
  bgColorG: -1,
  bgColorB: -1,
};

const TweakpanePlaygroundTemplate: StoryFn<typeof RazorSenseComponent> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paneRef = useRef<any>(null);
  const controlsRef = useRef<TweakpaneControls>({ ...DEFAULT_CONTROLS });
  const [controls, setControls] = useState<TweakpaneControls>({ ...DEFAULT_CONTROLS });
  const [paneLoaded, setPaneLoaded] = useState(false);
  const [gradientCanvas, setGradientCanvas] = useState<HTMLCanvasElement | null>(null);

  const handleGradientChange = useCallback((canvas: HTMLCanvasElement) => {
    setGradientCanvas(canvas);
  }, []);

  useEffect(() => {
    const initPane = async (): Promise<void> => {
      const { Pane } = await import('tweakpane');

      if (!containerRef.current || paneRef.current) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pane: any = new Pane({
        container: containerRef.current,
        title: 'RazorSense Controls',
      });
      paneRef.current = pane;

      // Preset
      const presetFolder = pane.addFolder({ title: 'Preset', expanded: true });
      presetFolder.addBinding(controlsRef.current, 'preset', {
        options: {
          default: 'default',
          zoomed: 'zoomed',
          bottomWave: 'bottomWave',
          rippleWave: 'rippleWave',
          circleSlideUp: 'circleSlideUp',
        },
      });

      // Playback Controls
      const playbackFolder = pane.addFolder({ title: 'Playback', expanded: true });
      playbackFolder.addBinding(controlsRef.current, 'paused');
      playbackFolder.addBinding(controlsRef.current, 'startTime', { min: 0, max: 14, step: 0.1 });
      playbackFolder.addBinding(controlsRef.current, 'endTime', { min: 0, max: 14, step: 0.1 });
      playbackFolder.addBinding(controlsRef.current, 'playbackRate', {
        min: 0.1,
        max: 3,
        step: 0.1,
      });
      playbackFolder.addBinding(controlsRef.current, 'animateLightIndependently');

      // Effect Toggles
      const effectsFolder = pane.addFolder({ title: 'Effect Toggles', expanded: true });
      effectsFolder.addBinding(controlsRef.current, 'enableDisplacement');
      effectsFolder.addBinding(controlsRef.current, 'enableColorama');
      effectsFolder.addBinding(controlsRef.current, 'enableBloom');
      effectsFolder.addBinding(controlsRef.current, 'enableLightSweep');
      effectsFolder.addBinding(controlsRef.current, 'enableCenterElement');

      // Zoom & Pan
      const zoomFolder = pane.addFolder({ title: 'Zoom & Pan', expanded: false });
      zoomFolder.addBinding(controlsRef.current, 'zoom', { min: 0.5, max: 10, step: 0.1 });
      zoomFolder.addBinding(controlsRef.current, 'panX', { min: -1, max: 1, step: 0.01 });
      zoomFolder.addBinding(controlsRef.current, 'panY', { min: -1, max: 1, step: 0.01 });
      zoomFolder.addBinding(controlsRef.current, 'edgeFeatherTop', {
        min: 0,
        max: 5,
        step: 0.1,
        label: 'feather top',
      });
      zoomFolder.addBinding(controlsRef.current, 'edgeFeatherRight', {
        min: 0,
        max: 5,
        step: 0.1,
        label: 'feather right',
      });
      zoomFolder.addBinding(controlsRef.current, 'edgeFeatherBottom', {
        min: 0,
        max: 5,
        step: 0.1,
        label: 'feather bottom',
      });
      zoomFolder.addBinding(controlsRef.current, 'edgeFeatherLeft', {
        min: 0,
        max: 5,
        step: 0.1,
        label: 'feather left',
      });

      // Colorama
      const coloramaFolder = pane.addFolder({ title: 'Colorama', expanded: false });
      coloramaFolder.addBinding(controlsRef.current, 'gradientMapBlend', {
        min: 0,
        max: 1,
        step: 0.01,
      });
      coloramaFolder.addBinding(controlsRef.current, 'cycleRepetitions', {
        min: 0.1,
        max: 5,
        step: 0.01,
      });
      coloramaFolder.addBinding(controlsRef.current, 'cycleSpeed', { min: 0, max: 2, step: 0.01 });
      coloramaFolder.addBinding(controlsRef.current, 'modifyGamma', {
        min: 0.1,
        max: 3,
        step: 0.01,
      });
      coloramaFolder.addBinding(controlsRef.current, 'inputMin', { min: 0, max: 1, step: 0.01 });
      coloramaFolder.addBinding(controlsRef.current, 'inputMax', { min: 0, max: 1, step: 0.01 });
      coloramaFolder.addBinding(controlsRef.current, 'phaseShift', { min: 0, max: 1, step: 0.01 });
      coloramaFolder.addBinding(controlsRef.current, 'posterizeLevels', {
        min: 0,
        max: 32,
        step: 1,
      });
      coloramaFolder.addBinding(controlsRef.current, 'blendWithOriginal', {
        min: 0,
        max: 1,
        step: 0.01,
      });

      // Displacement
      const displacementFolder = pane.addFolder({ title: 'Displacement', expanded: false });
      displacementFolder.addBinding(controlsRef.current, 'numSegments', {
        min: 1,
        max: 100,
        step: 1,
      });
      displacementFolder.addBinding(controlsRef.current, 'slitAngle', {
        min: -Math.PI,
        max: Math.PI,
        step: 0.01,
      });
      displacementFolder.addBinding(controlsRef.current, 'displacementX', {
        min: -50,
        max: 50,
        step: 0.5,
      });
      displacementFolder.addBinding(controlsRef.current, 'displacementY', {
        min: -50,
        max: 50,
        step: 0.5,
      });

      // Light & Color Correction
      const lightFolder = pane.addFolder({ title: 'Light & Color Correction', expanded: false });
      lightFolder.addBinding(controlsRef.current, 'lightIntensity', { min: 0, max: 1, step: 0.01 });
      lightFolder.addBinding(controlsRef.current, 'lightStartFrame', { min: 0, max: 500, step: 1 });
      lightFolder.addBinding(controlsRef.current, 'ccBlackPoint', { min: 0, max: 1, step: 0.01 });
      lightFolder.addBinding(controlsRef.current, 'ccWhitePoint', { min: 0, max: 1, step: 0.01 });
      lightFolder.addBinding(controlsRef.current, 'ccGamma', { min: 0.1, max: 3, step: 0.01 });
      lightFolder.addBinding(controlsRef.current, 'ccMidtoneGamma', {
        min: 0.1,
        max: 3,
        step: 0.01,
      });
      lightFolder.addBinding(controlsRef.current, 'ccContrast', { min: -1, max: 1, step: 0.01 });

      // Center Element
      const centerFolder = pane.addFolder({ title: 'Center Element', expanded: false });
      centerFolder.addBinding(controlsRef.current, 'centerAnimDuration', {
        min: 1,
        max: 20,
        step: 0.1,
      });

      // Cycle Animation
      const cycleAnimFolder = pane.addFolder({ title: 'Cycle Animation', expanded: false });
      cycleAnimFolder.addBinding(controlsRef.current, 'animateCycleReps');
      cycleAnimFolder.addBinding(controlsRef.current, 'cycleRepetitionsStart', {
        min: 0.1,
        max: 5,
        step: 0.01,
      });
      cycleAnimFolder.addBinding(controlsRef.current, 'cycleRepetitionsEnd', {
        min: 0.1,
        max: 5,
        step: 0.01,
      });
      cycleAnimFolder.addBinding(controlsRef.current, 'cycleRepetitionsStartFrame', {
        min: 0,
        max: 500,
        step: 1,
      });
      cycleAnimFolder.addBinding(controlsRef.current, 'cycleRepetitionsDuration', {
        min: 1,
        max: 500,
        step: 1,
      });

      // Canvas
      const canvasFolder = pane.addFolder({ title: 'Canvas', expanded: false });
      canvasFolder.addBinding(controlsRef.current, 'aspectRatio', { min: 0.5, max: 3, step: 0.01 });

      // Background Color
      const bgFolder = pane.addFolder({ title: 'Background Color', expanded: false });
      bgFolder.addBinding(controlsRef.current, 'bgColorR', {
        min: -1,
        max: 1,
        step: 0.01,
        label: 'R (-1 = disabled)',
      });
      bgFolder.addBinding(controlsRef.current, 'bgColorG', {
        min: -1,
        max: 1,
        step: 0.01,
        label: 'G',
      });
      bgFolder.addBinding(controlsRef.current, 'bgColorB', {
        min: -1,
        max: 1,
        step: 0.01,
        label: 'B',
      });

      pane.on('change', () => {
        setControls({ ...controlsRef.current });
      });

      setPaneLoaded(true);
    };

    void initPane();

    return () => {
      if (paneRef.current) {
        paneRef.current.dispose();
        paneRef.current = null;
      }
    };
  }, []);

  const edgeFeather: [number, number, number, number] = [
    controls.edgeFeatherTop,
    controls.edgeFeatherRight,
    controls.edgeFeatherBottom,
    controls.edgeFeatherLeft,
  ];

  const backgroundColor: [number, number, number] | undefined =
    controls.bgColorR >= 0 ? [controls.bgColorR, controls.bgColorG, controls.bgColorB] : undefined;

  return (
    <Box display="flex" height="100vh" margin="-32px">
      {/* Gradient Editor Panel - Left */}
      <Box
        position="fixed"
        top="16px"
        left="16px"
        zIndex={1000}
        width="360px"
        maxHeight="calc(100vh - 32px)"
        overflow="auto"
      >
        <GradientEditor onChange={handleGradientChange} />
      </Box>

      {/* Tweakpane Panel - Right */}
      <Box
        ref={containerRef}
        position="fixed"
        top="16px"
        right="16px"
        zIndex={1000}
        width="300px"
      />

      {/* Loading State */}
      {!paneLoaded && (
        <Box
          position="fixed"
          top="16px"
          right="16px"
          zIndex={1000}
          padding="spacing.4"
          backgroundColor="surface.background.gray.moderate"
          borderRadius="medium"
        >
          <Text>Loading controls...</Text>
        </Box>
      )}

      {/* RazorSense Display */}
      <Box flex="1" position="relative" backgroundColor="surface.background.gray.intense">
        <RazorSenseComponent
          width="100%"
          height="100%"
          preset={controls.preset}
          gradientMapCanvas={gradientCanvas}
          paused={controls.paused}
          startTime={controls.startTime}
          endTime={controls.endTime}
          playbackRate={controls.playbackRate}
          animateLightIndependently={controls.animateLightIndependently}
          enableDisplacement={controls.enableDisplacement}
          enableColorama={controls.enableColorama}
          enableBloom={controls.enableBloom}
          enableLightSweep={controls.enableLightSweep}
          enableCenterElement={controls.enableCenterElement}
          zoom={controls.zoom}
          panX={controls.panX}
          panY={controls.panY}
          edgeFeather={edgeFeather}
          gradientMapBlend={controls.gradientMapBlend}
          cycleRepetitions={controls.cycleRepetitions}
          cycleSpeed={controls.cycleSpeed}
          modifyGamma={controls.modifyGamma}
          inputMin={controls.inputMin}
          inputMax={controls.inputMax}
          phaseShift={controls.phaseShift}
          posterizeLevels={controls.posterizeLevels}
          blendWithOriginal={controls.blendWithOriginal}
          numSegments={controls.numSegments}
          slitAngle={controls.slitAngle}
          displacementX={controls.displacementX}
          displacementY={controls.displacementY}
          lightIntensity={controls.lightIntensity}
          lightStartFrame={controls.lightStartFrame}
          ccBlackPoint={controls.ccBlackPoint}
          ccWhitePoint={controls.ccWhitePoint}
          ccGamma={controls.ccGamma}
          ccMidtoneGamma={controls.ccMidtoneGamma}
          ccContrast={controls.ccContrast}
          centerAnimDuration={controls.centerAnimDuration}
          animateCycleReps={controls.animateCycleReps}
          cycleRepetitionsStart={controls.cycleRepetitionsStart}
          cycleRepetitionsEnd={controls.cycleRepetitionsEnd}
          cycleRepetitionsStartFrame={controls.cycleRepetitionsStartFrame}
          cycleRepetitionsDuration={controls.cycleRepetitionsDuration}
          aspectRatio={controls.aspectRatio}
          backgroundColor={backgroundColor}
        />
      </Box>
    </Box>
  );
};

export const TweakpanePlayground = TweakpanePlaygroundTemplate.bind({});
TweakpanePlayground.storyName = 'Tweakpane Playground';

// ---------------------------------------------------------------------------
// Login Page Story
// ---------------------------------------------------------------------------

const LoginPageTemplate: StoryFn<typeof RazorSenseComponent> = () => {
  const [email, setEmail] = useState('');
  const [assetsPreloaded, setAssetsPreloaded] = useState(false);

  useEffect(() => {
    preloadRazorSenseAssets('default')
      .then(() => setAssetsPreloaded(true))
      .catch(console.error);
  }, []);

  if (!assetsPreloaded) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        backgroundColor="surface.background.gray.intense"
      >
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      height="100vh"
      margin="-32px"
      backgroundColor="surface.background.gray.intense"
    >
      {/* Left Panel - RazorSense Gradient */}
      <Box
        flex="1"
        position="relative"
        overflow="hidden"
        display={{ base: 'none', m: 'flex' }}
        flexDirection="column"
        justifyContent="flex-end"
        padding="spacing.10"
      >
        {/* RazorSense Background */}
        <Box position="absolute" top="0px" left="0px" right="0px" bottom="0px" zIndex={0}>
          <RazorSenseComponent
            slitAngle={20 * (Math.PI / 180)}
            numSegments={20}
            startTime={8}
            animateLightIndependently={true}
            lightStartFrame={0}
            paused={true}
            width="100%"
            height="100%"
            preset="default"
            zoom={3}
            panX={0.0}
            panY={0.0}
          />
        </Box>

        {/* Content overlay */}
        <Box position="relative" zIndex={1} maxWidth="500px" opacity={0.6}>
          <Heading size="xlarge" color="surface.text.gray.normal" marginBottom="spacing.4">
            Join 8 Million businesses that trust Razorpay to supercharge their business
          </Heading>
          <Box display="flex" gap="spacing.8" marginTop="spacing.6">
            <Box display="flex" alignItems="center" gap="spacing.2">
              <Text color="surface.text.gray.normal" size="small">
                ✦ 100+ Payment Methods
              </Text>
            </Box>
            <Box display="flex" alignItems="center" gap="spacing.2">
              <Text color="surface.text.gray.normal" size="small">
                ✦ Easy Integration
              </Text>
            </Box>
            <Box display="flex" alignItems="center" gap="spacing.2">
              <Text color="surface.text.gray.normal" size="small">
                ✦ Powerful Dashboard
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right Panel - Login Form */}
      <Box
        width={{ base: '100%', m: '480px' }}
        minWidth={{ m: '480px' }}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        padding="spacing.10"
        backgroundColor="surface.background.gray.intense"
      >
        <Box width="100%" maxWidth="360px">
          {/* Logo */}
          <Box marginBottom="spacing.8">
            <RazorpayIcon size="xlarge" color="interactive.icon.primary.normal" />
          </Box>

          {/* Heading */}
          <Heading size="large" marginBottom="spacing.3">
            Get started with your email or phone number
          </Heading>

          {/* Email/Phone Input */}
          <Box marginTop="spacing.8" marginBottom="spacing.6">
            <TextInput
              label=""
              placeholder="Enter email or mobile"
              value={email}
              onChange={({ value }) => setEmail(value ?? '')}
            />
          </Box>

          {/* Continue Button */}
          <Button variant="primary" size="large" isFullWidth>
            Continue
          </Button>

          {/* Divider */}
          <Box display="flex" alignItems="center" gap="spacing.4" marginY="spacing.6">
            <Divider />
            <Text size="small" color="surface.text.gray.muted">
              or continue with email
            </Text>
            <Divider />
          </Box>

          {/* Google Sign In */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding="spacing.4"
            borderRadius="medium"
            borderWidth="thin"
            borderColor="surface.border.gray.muted"
          >
            <Box display="flex" alignItems="center" gap="spacing.3">
              <Box
                width="24px"
                height="24px"
                borderRadius="max"
                backgroundColor="feedback.background.information.subtle"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text size="small" weight="semibold">
                  N
                </Text>
              </Box>
              <Box>
                <Text size="medium" weight="medium">
                  Continue as Niharika
                </Text>
                <Text size="small" color="surface.text.gray.muted">
                  niha.s@gmail.com
                </Text>
              </Box>
            </Box>
            <Text size="large" color="feedback.text.information.intense">
              G
            </Text>
          </Box>

          {/* Terms */}
          <Box marginTop="spacing.8">
            <Text size="small" color="surface.text.gray.muted" textAlign="center">
              By continuing you agree to our <Link href="#">privacy policy</Link> and{' '}
              <Link href="#">terms of use</Link>
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export const LoginPage = LoginPageTemplate.bind({});
LoginPage.storyName = 'Login Page';
