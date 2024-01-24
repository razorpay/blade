import React from 'react';
import { BasicExample } from './examples';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Code, Heading, Text } from '~components/Typography';
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
import { SandboxHighlighter } from '~utils/storybook/Sandbox/SandpackEditor';
import { Sandbox } from '~utils/storybook/Sandbox/StackblitzEditor/Sandbox';
import { castWebType } from '~utils';

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
                      <Text as="span" color="interactive.text.negative.subtle">
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
      figmaURL="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=63871%3A13263&mode=dev"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox>{BasicExample}</Sandbox>
      <Heading size="large">iOS Safari Specific Setup</Heading>
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
      <Heading size="large">Examples</Heading>
      <Text marginY="spacing.5">
        To see examples properly, switch to the{' '}
        <Text as="span" weight="semibold">
          story view
        </Text>
      </Text>

      <Heading size="large">API</Heading>

      <Box
        backgroundColor="surface.background.gray.intense"
        overflow={castWebType('auto')}
        minHeight="400px"
        display="flex"
        flexDirection="column"
        gap="spacing.5"
      >
        <Box paddingBottom="spacing.4">
          <Text size="large">SpotlightPopoverTour props</Text>
        </Box>
        <BladeArgTable data={tourProps} />

        <Box paddingBottom="spacing.4" id="step-props">
          <Text size="large">Step type</Text>
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
