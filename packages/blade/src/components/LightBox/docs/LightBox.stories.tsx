import React, { useState } from 'react';
import type { StoryFn, Meta } from '@storybook/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Document, Page as ReactPdfPage, pdfjs } from 'react-pdf';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { LightBox } from '../LightBox';
import { LightBoxBody } from '../LightBoxBody';
import { LightBoxItem } from '../LightBoxItem';
import type { LightBoxProps } from '../types';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { Heading, Text } from '~components/Typography';
import { Preview, PreviewBody, PreviewFooter } from '~components/Preview';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { ArrowLeftIcon, ArrowRightIcon } from '~components/Icons';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const IMAGES = [
  {
    src: 'https://picsum.photos/seed/lightbox1/1200/800',
    alt: 'Document 1',
  },
  {
    src: 'https://picsum.photos/seed/lightbox2/1200/800',
    alt: 'Document 2',
  },
  {
    src: 'https://picsum.photos/seed/lightbox3/1200/800',
    alt: 'Document 3',
  },
];

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="LightBox"
      componentDescription="LightBox is a full-screen overlay component for viewing media items — images, videos, documents, or any custom content — in an immersive gallery experience. It provides prev/next navigation and a thumbnail strip for quick item access."
      apiDecisionLink={null}
      figmaURL=""
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
import { useState } from 'react';
import { LightBox, LightBoxBody, LightBoxItem, Button, Box } from '@razorpay/blade/components';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const documents = [
    { src: 'https://picsum.photos/seed/doc1/1200/800', alt: 'Document 1' },
    { src: 'https://picsum.photos/seed/doc2/1200/800', alt: 'Document 2' },
    { src: 'https://picsum.photos/seed/doc3/1200/800', alt: 'Document 3' },
  ];

  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Gallery</Button>
      <LightBox
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        activeIndex={activeIndex}
        onIndexChange={setActiveIndex}
      >
        <LightBoxBody>
          {documents.map((doc) => (
            <LightBoxItem key={doc.src} src={doc.src} alt={doc.alt} />
          ))}
        </LightBoxBody>
      </LightBox>
    </Box>
  );
}

export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/LightBox',
  component: LightBox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<LightBoxProps>;

const BasicTemplate: StoryFn<typeof LightBox> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Box>
      <Box display="flex" gap="spacing.3" flexWrap="wrap">
        {IMAGES.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => {
              setActiveIndex(i);
              setIsOpen(true);
            }}
            style={{ cursor: 'pointer', border: 'none', padding: 0, background: 'none' }}
          >
            <img
              src={img.src}
              alt={img.alt}
              style={{ width: '120px', height: '80px', objectFit: 'cover', display: 'block' }}
            />
          </button>
        ))}
      </Box>
      <Box marginTop="spacing.5">
        <Button onClick={() => setIsOpen(true)}>Open Gallery</Button>
      </Box>
      <LightBox
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        activeIndex={activeIndex}
        onIndexChange={setActiveIndex}
      >
        <LightBoxBody>
          {IMAGES.map((img) => (
            <LightBoxItem key={img.src} src={img.src} alt={img.alt} />
          ))}
        </LightBoxBody>
      </LightBox>
    </Box>
  );
};

export const Basic = BasicTemplate.bind({});
Basic.storyName = 'Basic Image Gallery';

const UncontrolledTemplate: StoryFn<typeof LightBox> = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Gallery (Uncontrolled)</Button>
      <LightBox isOpen={isOpen} onDismiss={() => setIsOpen(false)} defaultActiveIndex={1}>
        <LightBoxBody>
          {IMAGES.map((img) => (
            <LightBoxItem key={img.src} src={img.src} alt={img.alt} />
          ))}
        </LightBoxBody>
      </LightBox>
    </Box>
  );
};

export const Uncontrolled = UncontrolledTemplate.bind({});
Uncontrolled.storyName = 'Uncontrolled (Default Active Index)';

const MixedContentTemplate: StoryFn<typeof LightBox> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Mixed Gallery</Button>
      <LightBox
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        activeIndex={activeIndex}
        onIndexChange={setActiveIndex}
      >
        <LightBoxBody>
          <LightBoxItem src="https://picsum.photos/seed/img1/1200/800" alt="Landscape 1" />
          <LightBoxItem src="https://picsum.photos/seed/img2/1200/800" alt="Landscape 2" />
          <LightBoxItem thumbnailSrc="https://picsum.photos/seed/img3/400/300" alt="Custom Content">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="400px"
              backgroundColor="surface.background.gray.moderate"
              borderRadius="medium"
              padding="spacing.7"
            >
              <Heading size="xlarge" textAlign="center">
                Custom content can go here — videos, PDFs, iframes, etc.
              </Heading>
            </Box>
          </LightBoxItem>
        </LightBoxBody>
      </LightBox>
    </Box>
  );
};

export const MixedContent = MixedContentTemplate.bind({});
MixedContent.storyName = 'Mixed Content (Images + Custom)';

const PDF_TOTAL_PAGES = 8;

const WithPDFSlideshowTemplate: StoryFn<typeof LightBox> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pdfPage, setPdfPage] = useState(1);

  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Slideshow with PDF</Button>
      <LightBox
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        activeIndex={activeIndex}
        onIndexChange={setActiveIndex}
      >
        <LightBoxBody>
          <LightBoxItem src="https://picsum.photos/seed/lightbox1/1200/800" alt="Photo 1" />
          <LightBoxItem src="https://picsum.photos/seed/lightbox2/1200/800" alt="Photo 2" />
          <LightBoxItem
            thumbnailSrc="https://picsum.photos/seed/pdfthumb/400/300"
            alt="PDF Document"
          >
            <Preview>
              <PreviewBody>
                <Document file="https://cdn.razorpay.com/traditional-banks-vs-razorpayx.pdf">
                  <ReactPdfPage pageNumber={pdfPage} width={600} />
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
                      onClick={() => setPdfPage((p) => Math.max(1, p - 1))}
                      variant="tertiary"
                      aria-label="Previous page"
                      isDisabled={pdfPage <= 1}
                    />
                    <Text size="medium" margin="spacing.2">
                      {pdfPage} / {PDF_TOTAL_PAGES}
                    </Text>
                    <Button
                      icon={ArrowRightIcon}
                      onClick={() => setPdfPage((p) => Math.min(PDF_TOTAL_PAGES, p + 1))}
                      variant="tertiary"
                      aria-label="Next page"
                      isDisabled={pdfPage >= PDF_TOTAL_PAGES}
                    />
                  </Box>
                }
              />
            </Preview>
          </LightBoxItem>
        </LightBoxBody>
      </LightBox>
    </Box>
  );
};

export const WithPDFSlideshow = WithPDFSlideshowTemplate.bind({});
WithPDFSlideshow.storyName = 'With PDF Slideshow (Images + PDF)';

const VERTICAL_IMAGES = [
  {
    src: 'https://picsum.photos/seed/vert1/800/1200',
    alt: 'Portrait Document 1',
  },
  {
    src: 'https://picsum.photos/seed/vert2/800/1200',
    alt: 'Portrait Document 2',
  },
  {
    src: 'https://picsum.photos/seed/vert3/800/1200',
    alt: 'Portrait Document 3',
  },
];

const VerticalImagesTemplate: StoryFn<typeof LightBox> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Box>
      <Box display="flex" gap="spacing.3" flexWrap="wrap">
        {VERTICAL_IMAGES.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => {
              setActiveIndex(i);
              setIsOpen(true);
            }}
            style={{ cursor: 'pointer', border: 'none', padding: 0, background: 'none' }}
          >
            <img
              src={img.src}
              alt={img.alt}
              style={{ width: '60px', height: '90px', objectFit: 'cover', display: 'block' }}
            />
          </button>
        ))}
      </Box>
      <Box marginTop="spacing.5">
        <Button onClick={() => setIsOpen(true)}>Open Vertical Gallery</Button>
      </Box>
      <LightBox
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        activeIndex={activeIndex}
        onIndexChange={setActiveIndex}
      >
        <LightBoxBody>
          {VERTICAL_IMAGES.map((img) => (
            <LightBoxItem key={img.src} src={img.src} alt={img.alt} />
          ))}
        </LightBoxBody>
      </LightBox>
    </Box>
  );
};

export const VerticalImages = VerticalImagesTemplate.bind({});
VerticalImages.storyName = 'Vertical (Portrait) Images';
