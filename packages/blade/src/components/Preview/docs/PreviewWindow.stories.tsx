import type { StoryFn, Meta } from '@storybook/react';
import React, { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Document, Page as ReactPdfPage, pdfjs } from 'react-pdf';
import { PreviewBody, PreviewHeader, Preview, PreviewFooter } from '../Preview';
import type { PreviewProps } from '../types';
import { Heading, Text } from '~components/Typography';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Card, CardBody, CardHeader, CardHeaderLeading } from '~components/Card';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { ArrowLeftIcon, ArrowRightIcon } from '~components/Icons';

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Preview"
      componentDescription="A Preview is a component that is used to preivew a file"
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=105023-179625&m=dev"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
        import { PreviewBody, PreviewHeader, Preview, PreviewFooter } from '@razorpay/blade/components';
        
        function App() {
          return (
             <Preview>
             <PreviewHeader title="Preview " />
              <PreviewBody>
                <img width="100%" height="100%" src="https://picsum.photos/1920/1080" alt="randomImage" />
              </PreviewBody>
            <PreviewFooter showZoomPercentage={true} />
            </Preview>
          )
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Preview',
  component: Preview,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<PreviewProps>;

const PreviewTemplate: StoryFn<typeof Preview> = () => {
  return (
    <Preview>
      <PreviewHeader title="Preview " />
      <PreviewBody>
        <Box
          display="flex"
          flexDirection="column"
          gap="spacing.4"
          width={{ s: '100%', m: '800px' }}
        >
          <Card elevation="highRaised" padding="spacing.0">
            <CardBody>
              <Box display="flex" flexDirection="row">
                <img
                  width="300"
                  height="auto"
                  src="https://d6xcmfyh68wv8.cloudfront.net/assets/case-studies/common-card/pg_breathingroom.png"
                  alt="Breathing Room"
                  style={{ borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' }}
                />
                <Box padding="spacing.7" display="flex" flexDirection="column">
                  <Heading size="large">Lorem ipsum dolor sit amet</Heading>
                  <Text marginTop="spacing.5">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </Text>
                </Box>
              </Box>
            </CardBody>
          </Card>
          <Box
            display="flex"
            flexDirection="row"
            gap="spacing.4"
            justifyContent="space-between"
            width={{ s: '100%', m: '800px' }}
          >
            <Card shouldScaleOnHover width={{ s: '100%', m: '500px' }}>
              <CardHeader>
                <CardHeaderLeading
                  title="Lorem ipsum dolor sit amet"
                  subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                />
              </CardHeader>
              <CardBody>
                <Box display="flex" flexDirection="column" gap="spacing.4">
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                    incididunt ut labore et dolore.
                  </Text>
                  <Box display="flex" flexDirection="row" justifyContent="space-between">
                    <Button
                      href="https://razorpay.com/payment-links/"
                      variant="primary"
                      target="_blank"
                    >
                      Get Started
                    </Button>
                  </Box>
                </Box>
              </CardBody>
            </Card>
            <Card shouldScaleOnHover>
              <CardBody>
                <img
                  width="300"
                  height="auto"
                  src="https://d6xcmfyh68wv8.cloudfront.net/newsroom-content/uploads/2021/07/New-Project-18-1024x576.jpg"
                  alt="Breathing Room"
                  style={{ borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' }}
                />
              </CardBody>
            </Card>
          </Box>
          <Box display="flex" flexDirection="row" gap="spacing.4">
            <Card elevation="highRaised" padding="spacing.0">
              <CardBody>
                <Box display="flex" flexDirection="row">
                  <Box padding="spacing.7" display="flex" flexDirection="column">
                    <Heading size="large">Lorem ipsum dolor sit amet</Heading>
                    <Text marginTop="spacing.5">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                      nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </Text>
                  </Box>
                  <img
                    width="300"
                    height="auto"
                    src="https://d6xcmfyh68wv8.cloudfront.net/newsroom-content/uploads/2023/05/Newsroom.png"
                    alt="Breathing Room"
                    style={{ borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' }}
                  />
                </Box>
              </CardBody>
            </Card>
          </Box>
        </Box>
      </PreviewBody>
      <PreviewFooter showZoomPercentage={true} />
    </Preview>
  );
};

export const Default = PreviewTemplate.bind({});
Default.storyName = 'Default';
Default.args = {};

const ImagePreviewTemplate: StoryFn<typeof Preview> = () => {
  return (
    <Preview>
      <PreviewHeader title="Preview " />
      <PreviewBody>
        <img width="100%" height="100%" src="https://picsum.photos/1920/1080" alt="randomImage" />
      </PreviewBody>
      <PreviewFooter showZoomPercentage={true} />
    </Preview>
  );
};

export const ImagePreview = ImagePreviewTemplate.bind({});
ImagePreview.storyName = 'Image Preview';
ImagePreview.args = {};

const FixedHeightWidthExampleTemplate: StoryFn<typeof Preview> = () => {
  return (
    <Box height="300px" width="300px">
      <Heading size="large">Fixed Height Width Example</Heading>
      <Preview>
        <PreviewHeader title="Preview " />
        <PreviewBody>
          <Box height="100%" width="100%">
            <img
              width="100%"
              height="100%"
              src="https://picsum.photos/1920/1080"
              alt="randomImage"
            />
          </Box>
        </PreviewBody>
        <PreviewFooter showZoomPercentage={true} />
      </Preview>
    </Box>
  );
};

export const FixedHeightWidthExample = FixedHeightWidthExampleTemplate.bind({});
FixedHeightWidthExample.storyName = 'Fixed Height Width';
FixedHeightWidthExample.args = {};

const WithoutHeaderTitleEampleTemplate: StoryFn<typeof Preview> = () => {
  return (
    <Preview>
      <PreviewHeader />
      <PreviewBody>
        <img width="100%" height="100%" src="https://picsum.photos/1920/1080" alt="randomImage" />
      </PreviewBody>
      <PreviewFooter showZoomPercentage={true} />
    </Preview>
  );
};

export const WithoutHeaderTitleExample = WithoutHeaderTitleEampleTemplate.bind({});
WithoutHeaderTitleExample.storyName = 'Without Header Title';
WithoutHeaderTitleExample.args = {};

const isDragAndZoomDisabledExampleTemplate: StoryFn<typeof Preview> = () => {
  return (
    <Preview isDragAndZoomDisabled={true}>
      <PreviewBody>
        <img width="100%" height="100%" src="https://picsum.photos/1920/1080" alt="randomImage" />
      </PreviewBody>
    </Preview>
  );
};

export const IsDragAndZoomDisabledExample = isDragAndZoomDisabledExampleTemplate.bind({});
IsDragAndZoomDisabledExample.storyName = ' Drag and Zoom Disabled ';
IsDragAndZoomDisabledExample.args = {};

const WithHeaderAndFooterTrailingExampleTemplate: StoryFn<typeof Preview> = () => {
  return (
    <Preview>
      <PreviewHeader title="Preview " trailing={<Button>Trailing</Button>} />
      <PreviewBody>
        <img width="100%" height="100%" src="https://picsum.photos/1920/1080" alt="randomImage" />
      </PreviewBody>
      <PreviewFooter showZoomPercentage={true} trailing={<Button>Trailing</Button>} />
    </Preview>
  );
};

export const WithHeaderAndFooterTrailingExample = WithHeaderAndFooterTrailingExampleTemplate.bind(
  {},
);
WithHeaderAndFooterTrailingExample.storyName = 'With Header and Footer Trailing ';
WithHeaderAndFooterTrailingExample.args = {};

const WithInitialZoomExampleTemplate: StoryFn<typeof Preview> = () => {
  return (
    <Preview defaultZoom={2}>
      <PreviewHeader title="Preview " />
      <PreviewBody>
        <img width="100%" height="100%" src="https://picsum.photos/1920/1080" alt="randomImage" />
      </PreviewBody>
      <PreviewFooter showZoomPercentage={true} />
    </Preview>
  );
};
export const WithInitialZoomExample = WithInitialZoomExampleTemplate.bind({});
WithInitialZoomExample.storyName = 'With Initial Zoom';
WithInitialZoomExample.args = {};

const PDFRenderer: StoryFn<typeof Preview> = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  return (
    <Preview
      onZoomChange={(zoom) => {
        console.log('zoom-> onZoomChange', zoom);
      }}
    >
      <PreviewHeader title="Preview " />
      <PreviewBody>
        <Document
          file="https://cdn.razorpay.com/traditional-banks-vs-razorpayx.pdf"
          className="pdf-page"
        >
          <ReactPdfPage key={currentPage} pageNumber={currentPage} width={800} height={700} />
        </Document>
      </PreviewBody>
      <PreviewFooter
        trailing={
          <Box
            display="flex"
            alignItems="center"
            gap="spacing.4"
            borderColor="surface.border.gray.muted"
            borderWidth="thin"
            padding="spacing.2"
            backgroundColor="surface.background.gray.intense"
            borderRadius="medium"
          >
            <Button
              icon={ArrowLeftIcon}
              onClick={() => setCurrentPage(currentPage - 1)}
              variant="tertiary"
              aria-label="Zoom in"
              isDisabled={currentPage <= 1}
            />
            <Text size="medium" margin="spacing.2">
              {currentPage} / 8
            </Text>
            <Button
              icon={ArrowRightIcon}
              onClick={() => setCurrentPage(currentPage + 1)}
              variant="tertiary"
              aria-label="Zoom out"
              isDisabled={currentPage >= 8}
            />
          </Box>
        }
      />
    </Preview>
  );
};
export const PDFTemplate = PDFRenderer.bind({});
PDFTemplate.storyName = 'With React PDF';
