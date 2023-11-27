import React from 'react';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Code, Heading, Text, Title } from '~components/Typography';
import { Sandbox, SandboxHighlighter } from '~utils/storybook/Sandbox/SandpackEditor';
import { Box } from '~components/Box';
import type { TableData } from '~components/Table';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
} from '~components/Table';
import { ScrollLink } from '~utils/storybook/ScrollLink';
import { InfoIcon } from '~components/Icons';
import { Popover, PopoverInteractiveWrapper } from '~components/Popover';

type Item = {
  id: string;
  prop: string;
  type: string;
  description: string;
  default?: string;
  required?: boolean;
  typeLink?: string;
  typeHint?: React.ReactElement;
};

const tourProps: TableData<Item> = {
  nodes: [
    {
      id: '1',
      prop: 'steps',
      type: 'Step[]',
      typeLink: '#step-props',
      description:
        'Array of steps to be rendered, The order of the steps will be the order in which they are rendered depending on the activeStep prop',
      required: true,
    },
    {
      id: '2',
      prop: 'isOpen',
      type: 'boolean',
      description: 'Whether the tour is open or not',
      required: true,
      default: 'false',
    },
    {
      id: '6',
      prop: 'activeStep',
      type: 'number',
      description: 'Active step to be rendered',
      required: true,
    },
    {
      id: '3',
      prop: 'onOpenChange',
      type: '({ isOpen: boolean }) => void',
      description: 'Callback when the tour is opened or closed',
    },
    {
      id: '4',
      prop: 'onFinish',
      type: '() => void',
      description: 'Callback which fires when the stopTour method is called from the steps array',
    },
    {
      id: '5',
      prop: 'onStepChange',
      type: '(step: number) => void',
      description: 'Callback which fires when the step changes',
    },
    {
      id: '7',
      prop: 'children',
      type: 'React.ReactElement',
      description: '',
    },
  ],
};

const SpotlightPopoverStepRenderPropsCode = (
  <SandboxHighlighter showLineNumbers={false} wrapContent={false}>
    {`
      type SpotlightPopoverStepRenderProps = {
        /**
         * Go to a specific step
         */
        goToStep: (step: number) => void;
        /**
         * Go to the next step
         */
        goToNext: () => void;
        /**
         * Go to the previous step
         */
        goToPrevious: () => void;
        /**
         * Stop the tour
         *
         * This will call the \`onFinish\` callback
         */
        stopTour: () => void;
        /**
         * Current active step (zero based index)
         */
        activeStep: number;
        /**
         * Total number of steps
         */
        totalSteps: number;
      };
    `}
  </SandboxHighlighter>
);

const tourStepProps: TableData<Item> = {
  nodes: [
    {
      id: '5',
      prop: 'name',
      type: 'string',
      description: 'Unique identifier for the tour step',
      required: true,
    },
    {
      id: '3',
      prop: 'content',
      type: '(props: SpotlightPopoverStepRenderProps) => React.ReactElement',
      typeHint: SpotlightPopoverStepRenderPropsCode,
      description: 'Content of the Popover',
      required: true,
    },
    {
      id: '1',
      prop: 'title',
      type: 'string',
      description: 'Popover Title',
    },
    {
      id: '2',
      prop: 'titleLeading',
      type: 'React.ReactNode',
      description: 'Leading content placed before the title',
    },
    {
      id: '4',
      prop: 'footer',
      type: '(props: SpotlightPopoverStepRenderProps) => React.ReactNode',
      typeHint: SpotlightPopoverStepRenderPropsCode,
      description: 'Footer content',
    },
    {
      id: '6',
      prop: 'placement',
      type:
        '"top" | "right" | "bottom" | "left" | "top-end" | "top-start" | "right-end" | "right-start" | "bottom-end" | "bottom-start" | "left-end" | "left-start"',
      description: 'Placement of Popover',
      default: '"top"',
    },
  ],
};

const BladeArgTable = ({ data }: { data: TableData<Item> }): React.ReactElement => {
  return (
    <Table rowDensity="comfortable" showStripedRows={true} data={data}>
      {(tableData) => (
        <>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>prop</TableHeaderCell>
              <TableHeaderCell>type</TableHeaderCell>
              <TableHeaderCell>description</TableHeaderCell>
              <TableHeaderCell>default</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {tableData.map((tableItem, index) => (
              <TableRow key={index} item={tableItem}>
                <TableCell>
                  <Text>
                    {tableItem.prop}{' '}
                    {tableItem.required && (
                      <Text
                        as="span"
                        color="feedback.negative.action.text.primary.default.lowContrast"
                      >
                        *
                      </Text>
                    )}
                  </Text>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap="spacing.2" alignItems="center">
                    {tableItem.typeHint ? (
                      <Popover content={tableItem.typeHint}>
                        <PopoverInteractiveWrapper>
                          <InfoIcon size="medium" />
                        </PopoverInteractiveWrapper>
                      </Popover>
                    ) : null}
                    {tableItem.typeLink ? (
                      <ScrollLink size="medium" href={tableItem.typeLink}>
                        {tableItem.type}
                      </ScrollLink>
                    ) : (
                      <Code size="medium">{tableItem.type}</Code>
                    )}
                  </Box>
                </TableCell>
                <TableCell>{tableItem.description || '-'}</TableCell>
                <TableCell>{tableItem.default || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </>
      )}
    </Table>
  );
};

const TourDocs = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      imports=""
      showDefaultExample={false}
      showArgsTable={false}
      componentName="SpotlightPopoverTour"
      componentDescription="The SpotlightPopoverTour component is used to provide context as well as enable users to take certain actions on it. These are used to highlight a new feature or provide a guided tour to a new user."
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=63871%3A13263&mode=dev',
        bankingTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=63871%3A13263&mode=dev',
      }}
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import React from 'react';
        import { 
          SpotlightPopoverTour,
          SpotlightPopoverTourStep,
          SpotlightPopoverTourFooter,
          Box,
          Text,
          Button
        } from '@razorpay/blade/components';
        
        function App(): React.ReactElement {
          const [activeStep, setActiveStep] = React.useState(0);
          const [isOpen, setIsOpen] = React.useState(false);
        
          return (
            <Box>
              <Button
                marginBottom="spacing.9"
                onClick={() => {
                  setIsOpen((prev) => !prev);
                }}
              >
                {isOpen ? 'Tour In Progress' : 'Start Tour'}
              </Button>
              <SpotlightPopoverTour
                steps={steps}
                isOpen={isOpen}
                activeStep={activeStep}
                onFinish={() => {
                  console.log('finished');
                  setActiveStep(0);
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
                <Box width="100%" display="flex" gap="spacing.4">
                  <SpotlightPopoverTourStep name="step-1">
                    <Box padding="spacing.4" backgroundColor="brand.gray.400.lowContrast">
                      <Text>Step 1 </Text>
                    </Box>
                  </SpotlightPopoverTourStep>
                  <SpotlightPopoverTourStep name="step-2">
                    <Box padding="spacing.4" backgroundColor="brand.gray.400.lowContrast">
                      <Text>Step 2 </Text>
                    </Box>
                  </SpotlightPopoverTourStep>
                </Box>
              </SpotlightPopoverTour>
            </Box>
          );
        }

        export default App;
      `}
      </Sandbox>
      <Title>iOS Safari Specific Setup</Title>
      <Text marginTop="spacing.5">
        When using BottomSheet or SpotlightPopoverTour, Make sure to set a width/height to the
        `body` otherwise when they open, the page will get clipped. This happens due to a bug in iOS
        safari where it won't compute the height of the body correctly.
      </Text>
      <SandboxHighlighter showLineNumbers={false} theme="light">
        {`
          body {
            width: 100%;
            height: 100%;
          }
        `}
      </SandboxHighlighter>
      <Title>Examples</Title>
      <Text marginY="spacing.5">
        To see examples properly, switch to the{' '}
        <Text as="span" weight="bold">
          story view
        </Text>
      </Text>

      <Title>API</Title>

      <Box
        backgroundColor="surface.background.level2.lowContrast"
        overflow="auto"
        minHeight="400px"
        display="flex"
        flexDirection="column"
        gap="spacing.5"
      >
        <Box paddingBottom="spacing.4">
          <Heading>SpotlightPopoverTour props</Heading>
        </Box>
        <BladeArgTable data={tourProps} />

        <Box paddingBottom="spacing.4" id="step-props">
          <Heading>Step type</Heading>
          <Text>
            Step type defines each step of the tour, and passed to the{' '}
            <Code size="medium">steps</Code> prop in the SpotlightPopoverTour component.
          </Text>
        </Box>
        <BladeArgTable data={tourStepProps} />
      </Box>
    </StoryPageWrapper>
  );
};

export { TourDocs };
