/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { Meta } from '@storybook/react';
import React from 'react';
import type { StepRenderProps, TourProps, TourSteps } from './types';
import { TourStep } from './TourStep';
import { Tour } from '.';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { Heading, Text } from '~components/Typography';
import { InfoIcon } from '~components/Icons';

export default {
  title: 'Components/Tour',
  component: Tour,
} as Meta<TourProps>;

const TourFooter = ({
  activeStep,
  goToNext,
  stopTour,
  goToPrevious,
  totalSteps,
}: StepRenderProps): React.ReactElement => {
  const isLast = activeStep === totalSteps - 1;
  const isFirst = activeStep === 0;
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" gap="spacing.7">
      <Text size="small" weight="bold">
        {activeStep + 1} / {totalSteps}
      </Text>
      <Box display="flex" gap="spacing.4">
        {!isFirst ? (
          <Button
            size="small"
            variant="secondary"
            onClick={() => {
              goToPrevious();
            }}
          >
            Prev
          </Button>
        ) : null}
        {isLast ? (
          <Button
            size="small"
            onClick={() => {
              // done
              stopTour();
            }}
          >
            Done
          </Button>
        ) : (
          <Button
            size="small"
            onClick={() => {
              goToNext();
            }}
          >
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

const steps: TourSteps = [
  {
    name: 'step-1',
    title: 'Overview of Payments',
    content: () => {
      return (
        <Text>
          This section shows an overview of your payments. You can click on the cards to view
          detailed graphs.
        </Text>
      );
    },
    placement: 'bottom',
    footer: TourFooter,
  },
  {
    name: 'step-2',
    title: 'Detailed Charts',
    content: () => {
      return <Text>You can also group the charts by Payment Methods or Platforms.</Text>;
    },
    placement: 'bottom',
    footer: TourFooter,
  },
  {
    name: 'step-3',
    title: 'Tour Complete!',
    content: () => {
      return <Text>This is the end of the tour</Text>;
    },
    placement: 'right',
    titleLeading: <InfoIcon color="surface.text.normal.lowContrast" size="medium" />,
    footer: TourFooter,
  },
];

const TourTemplate = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <Box>
      <Button
        marginBottom="spacing.9"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        Open
      </Button>
      <Tour
        steps={steps}
        isOpen={isOpen}
        activeStep={activeStep}
        onFinish={() => {
          console.log('finish');
          setIsOpen(false);
        }}
        onOpenChange={({ isOpen }) => {
          console.log('open change', isOpen);
          setIsOpen(isOpen);
        }}
        onStepChange={(step) => {
          console.log('step change', step);
          setActiveStep(step);
        }}
      >
        <Box display="flex" gap="spacing.4" flexWrap="wrap">
          <TourStep name="step-1">
            <Box>
              <Heading>This is some heading text</Heading>
              <Heading>This is some heading text</Heading>
            </Box>
          </TourStep>

          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget
            ultricies aliquam, augue nunc ultrices ipsum, sit amet tincidunt eros nunc vel tellus.
            Morbi eget nunc auctor, sagittis dolor quis, ultricies libero. Nullam imperdiet, velit
            non commodo ullamcorper, diam nisl faucibus nisi, eu ultrices libero quam a odio.
            Quisque eget quam ut nisl ultrices aliquam. Sed auctor efficitur diam, vel aliquam nisl.
            Nulla facilisi. Nulla facilisi. Nullam consectetur, enim vitae lacinia commodo, dolor
            risus ultricies nisl, sed ullamcorper lorem nunc nec enim. Nullam euismod, nisl eget
            ultricies aliquam, augue nunc ultrices ipsum, sit amet tincidunt eros nunc vel tellus.
            Morbi eget nunc auctor, sagittis dolor quis, ultricies libero. Nullam imperdiet, velit
            non commodo ullamcorper, diam nisl faucibus nisi, eu ultrices libero quam a odio.
            Quisque eget quam ut nisl ultrices aliquam. Sed auctor efficitur diam, vel aliquam nisl.
            Nulla facilisi. Nulla facilisi. Nullam consectetur, enim vitae
          </Text>

          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget
            ultricies aliquam, augue nunc ultrices ipsum, sit amet tincidunt eros nunc vel tellus.
            Morbi eget nunc auctor, sagittis dolor quis, ultricies libero. Nullam imperdiet, velit
            non commodo ullamcorper, diam nisl faucibus nisi, eu ultrices libero quam a odio.
            Quisque eget quam ut nisl ultrices aliquam. Sed auctor efficitur diam, vel aliquam nisl.
            Nulla facilisi. Nulla facilisi. Nullam consectetur, enim vitae lacinia commodo, dolor
            risus ultricies nisl, sed ullamcorper lorem nunc nec enim. Nullam euismod, nisl eget
            ultricies aliquam, augue nunc ultrices ipsum, sit amet tincidunt eros nunc vel tellus.
            Morbi eget nunc auctor, sagittis dolor quis, ultricies libero. Nullam imperdiet, velit
            non commodo ullamcorper, diam nisl faucibus nisi, eu ultrices libero quam a odio.
            Quisque eget quam ut nisl ultrices aliquam. Sed auctor efficitur diam, vel aliquam nisl.
            Nulla facilisi. Nulla facilisi. Nullam consectetur, enim vitae
          </Text>

          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget
            ultricies aliquam, augue nunc ultrices ipsum, sit amet tincidunt eros nunc vel tellus.
            Morbi eget nunc auctor, sagittis dolor quis, ultricies libero. Nullam imperdiet, velit
            non commodo ullamcorper, diam nisl faucibus nisi, eu ultrices libero quam a odio.
            Quisque eget quam ut nisl ultrices aliquam. Sed auctor efficitur diam, vel aliquam nisl.
            Nulla facilisi. Nulla facilisi. Nullam consectetur, enim vitae lacinia commodo, dolor
            risus ultricies nisl, sed ullamcorper lorem nunc nec enim. Nullam euismod, nisl eget
            ultricies aliquam, augue nunc ultrices ipsum, sit amet tincidunt eros nunc vel tellus.
            Morbi eget nunc auctor, sagittis dolor quis, ultricies libero. Nullam imperdiet, velit
            non commodo ullamcorper, diam nisl faucibus nisi, eu ultrices libero quam a odio.
            Quisque eget quam ut nisl ultrices aliquam. Sed auctor efficitur diam, vel aliquam nisl.
            Nulla facilisi. Nulla facilisi. Nullam consectetur, enim vitae
          </Text>

          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget
            ultricies aliquam, augue nunc ultrices ipsum, sit amet tincidunt eros nunc vel tellus.
            Morbi eget nunc auctor, sagittis dolor quis, ultricies libero. Nullam imperdiet, velit
            non commodo ullamcorper, diam nisl faucibus nisi, eu ultrices libero quam a odio.
            Quisque eget quam ut nisl ultrices aliquam. Sed auctor efficitur diam, vel aliquam nisl.
            Nulla facilisi. Nulla facilisi. Nullam consectetur, enim vitae lacinia commodo, dolor
            risus ultricies nisl, sed ullamcorper lorem nunc nec enim. Nullam euismod, nisl eget
            ultricies aliquam, augue nunc ultrices ipsum, sit amet tincidunt eros nunc vel tellus.
            Morbi eget nunc auctor, sagittis dolor quis, ultricies libero. Nullam imperdiet, velit
            non commodo ullamcorper, diam nisl faucibus nisi, eu ultrices libero quam a odio.
            Quisque eget quam ut nisl ultrices aliquam. Sed auctor efficitur diam, vel aliquam nisl.
            Nulla facilisi. Nulla facilisi. Nullam consectetur, enim vitae
          </Text>

          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget
            ultricies aliquam, augue nunc ultrices ipsum, sit amet tincidunt eros nunc vel tellus.
            Morbi eget nunc auctor, sagittis dolor quis, ultricies libero. Nullam imperdiet, velit
            non commodo ullamcorper, diam nisl faucibus nisi, eu ultrices libero quam a odio.
            Quisque eget quam ut nisl ultrices aliquam. Sed auctor efficitur diam, vel aliquam nisl.
            Nulla facilisi. Nulla facilisi. Nullam consectetur, enim vitae lacinia commodo, dolor
            risus ultricies nisl, sed ullamcorper lorem nunc nec enim. Nullam euismod, nisl eget
            ultricies aliquam, augue nunc ultrices ipsum, sit amet tincidunt eros nunc vel tellus.
            Morbi eget nunc auctor, sagittis dolor quis, ultricies libero. Nullam imperdiet, velit
            non commodo ullamcorper, diam nisl faucibus nisi, eu ultrices libero quam a odio.
            Quisque eget quam ut nisl ultrices aliquam. Sed auctor efficitur diam, vel aliquam nisl.
            Nulla facilisi. Nulla facilisi. Nullam consectetur, enim vitae
          </Text>

          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget
            ultricies aliquam, augue nunc ultrices ipsum, sit amet tincidunt eros nunc vel tellus.
            Morbi eget nunc auctor, sagittis dolor quis, ultricies libero. Nullam imperdiet, velit
            non commodo ullamcorper, diam nisl faucibus nisi, eu ultrices libero quam a odio.
            Quisque eget quam ut nisl ultrices aliquam. Sed auctor efficitur diam, vel aliquam nisl.
            Nulla facilisi. Nulla facilisi. Nullam consectetur, enim vitae lacinia commodo, dolor
            risus ultricies nisl, sed ullamcorper lorem nunc nec enim. Nullam euismod, nisl eget
            ultricies aliquam, augue nunc ultrices ipsum, sit amet tincidunt eros nunc vel tellus.
            Morbi eget nunc auctor, sagittis dolor quis, ultricies libero. Nullam imperdiet, velit
            non commodo ullamcorper, diam nisl faucibus nisi, eu ultrices libero quam a odio.
            Quisque eget quam ut nisl ultrices aliquam. Sed auctor efficitur diam, vel aliquam nisl.
            Nulla facilisi. Nulla facilisi. Nullam consectetur, enim vitae
          </Text>

          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget
            ultricies aliquam, augue nunc ultrices ipsum, sit amet tincidunt eros nunc vel tellus.
            Morbi eget nunc auctor, sagittis dolor quis, ultricies libero. Nullam imperdiet, velit
            non commodo ullamcorper, diam nisl faucibus nisi, eu ultrices libero quam a odio.
            Quisque eget quam ut nisl ultrices aliquam. Sed auctor efficitur diam, vel aliquam nisl.
            Nulla facilisi. Nulla facilisi. Nullam consectetur, enim vitae lacinia commodo, dolor
            risus ultricies nisl, sed ullamcorper lorem nunc nec enim. Nullam euismod, nisl eget
            ultricies aliquam, augue nunc ultrices ipsum, sit amet tincidunt eros nunc vel tellus.
            Morbi eget nunc auctor, sagittis dolor quis, ultricies libero. Nullam imperdiet, velit
            non commodo ullamcorper, diam nisl faucibus nisi, eu ultrices libero quam a odio.
            Quisque eget quam ut nisl ultrices aliquam. Sed auctor efficitur diam, vel aliquam nisl.
            Nulla facilisi. Nulla facilisi. Nullam consectetur, enim vitae
          </Text>

          <TourStep name="step-2">
            <Box
              height="fit-content"
              padding="spacing.2"
              backgroundColor="brand.gray.500.lowContrast"
            >
              World
            </Box>
          </TourStep>

          <TourStep name="step-3">
            <Button>Highlight me</Button>
          </TourStep>

          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget
            ultricies aliquam, augue nunc ultrices ipsum, sit amet tincidunt eros nunc vel tellus.
            Morbi eget nunc auctor, sagittis dolor quis, ultricies libero. Nullam imperdiet, velit
            non commodo ullamcorper, diam nisl faucibus nisi, eu ultrices libero quam a odio.
            Quisque eget quam ut nisl ultrices aliquam. Sed auctor efficitur diam, vel aliquam nisl.
            Nulla facilisi. Nulla facilisi. Nullam consectetur, enim vitae lacinia commodo, dolor
            risus ultricies nisl, sed ullamcorper lorem nunc nec enim. Nullam euismod, nisl eget
            ultricies aliquam, augue nunc ultrices ipsum, sit amet tincidunt eros nunc vel tellus.
            Morbi eget nunc auctor, sagittis dolor quis, ultricies libero. Nullam imperdiet, velit
            non commodo ullamcorper, diam nisl faucibus nisi, eu ultrices libero quam a odio.
            Quisque eget quam ut nisl ultrices aliquam. Sed auctor efficitur diam, vel aliquam nisl.
            Nulla facilisi. Nulla facilisi. Nullam consectetur, enim vitae
          </Text>
        </Box>
      </Tour>
    </Box>
  );
};

export const Default = TourTemplate.bind({});
Default.storyName = 'Default';
