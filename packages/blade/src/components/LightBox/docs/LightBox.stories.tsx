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

const DEFAULT_IMAGES = [
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

const PDF_FILE_URL = 'https://cdn.razorpay.com/traditional-banks-vs-razorpayx.pdf';
const FALLBACK_PDF_THUMBNAIL = 'https://picsum.photos/seed/pdfthumb/400/300';
const VIDEO_FILE_URL = 'https://www.w3schools.com/html/mov_bbb.mp4';
const VIDEO_THUMBNAIL_URL = 'https://picsum.photos/seed/lightbox-video-thumb/400/300';

const usePdfThumbnail = (pdfUrl: string): string | undefined => {
  const [thumbnail, setThumbnail] = useState<string>();

  React.useEffect(() => {
    let isMounted = true;
    const loadingTask = pdfjs.getDocument(pdfUrl);

    const generateThumbnail = async (): Promise<void> => {
      try {
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 0.25 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
          return;
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        if (isMounted) {
          setThumbnail(canvas.toDataURL('image/jpeg', 0.8));
        }
      } catch {
        // Keep fallback thumbnail when PDF thumbnail generation fails.
      }
    };

    void generateThumbnail();

    return () => {
      isMounted = false;
      void loadingTask.destroy();
    };
  }, [pdfUrl]);

  return thumbnail;
};

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
        onIndexChange={({ index }) => setActiveIndex(index)}
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

const DefaultTemplate: StoryFn<typeof LightBox> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Gallery</Button>
      <LightBox
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        activeIndex={activeIndex}
        onIndexChange={({ index }) => setActiveIndex(index)}
      >
        <LightBoxBody>
          {DEFAULT_IMAGES.map((img) => (
            <LightBoxItem key={img.src} src={img.src} alt={img.alt} />
          ))}
        </LightBoxBody>
      </LightBox>
    </Box>
  );
};

export const Default = DefaultTemplate.bind({});
Default.storyName = 'Default';

const PDF_TOTAL_PAGES = 8;

const MixedContentWithPDFTemplate: StoryFn<typeof LightBox> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pdfPage, setPdfPage] = useState(1);
  const pdfThumbnail = usePdfThumbnail(PDF_FILE_URL);

  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Mixed Gallery (Image + PDF + Video)</Button>
      <LightBox
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        activeIndex={activeIndex}
        onIndexChange={({ index }) => setActiveIndex(index)}
      >
        <LightBoxBody>
          <LightBoxItem
            src="https://picsum.photos/seed/lightbox-horizontal/1200/800"
            alt="Horizontal Image"
          />
          <LightBoxItem
            src="https://picsum.photos/seed/lightbox-vertical/800/1200"
            alt="Vertical Image"
          />
          <LightBoxItem thumbnail={pdfThumbnail ?? FALLBACK_PDF_THUMBNAIL} alt="PDF File">
            <Preview>
              <PreviewBody>
                <Document file={PDF_FILE_URL}>
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
          <LightBoxItem thumbnail={VIDEO_THUMBNAIL_URL} alt="Video File">
            <Box width="100%" maxWidth="1000px">
              <video controls width="100%">
                <source src={VIDEO_FILE_URL} type="video/mp4" />
                <track
                  kind="captions"
                  srcLang="en"
                  label="English captions"
                  src="data:text/vtt,WEBVTT"
                />
                Your browser does not support the video tag.
              </video>
            </Box>
          </LightBoxItem>
        </LightBoxBody>
      </LightBox>
    </Box>
  );
};

export const MixedContentWithPDF = MixedContentWithPDFTemplate.bind({});
MixedContentWithPDF.storyName = 'Mixed Content (Horizontal + Vertical + PDF + Video)';

const ControlledTemplate: StoryFn<typeof LightBox> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Box>
      <Box display="flex" gap="spacing.3" flexWrap="wrap">
        {DEFAULT_IMAGES.map((img, i) => (
          <Button
            key={img.src}
            onClick={() => {
              setActiveIndex(i);
              setIsOpen(true);
            }}
          >
            Open item {i + 1}
          </Button>
        ))}
      </Box>
      <Box marginTop="spacing.5">
        <Button onClick={() => setIsOpen(true)}>Open Gallery</Button>
      </Box>
      <LightBox
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        activeIndex={activeIndex}
        onIndexChange={({ index }) => setActiveIndex(index)}
      >
        <LightBoxBody>
          {DEFAULT_IMAGES.map((img) => (
            <LightBoxItem key={img.src} src={img.src} alt={img.alt} />
          ))}
        </LightBoxBody>
      </LightBox>
    </Box>
  );
};

export const Controlled = ControlledTemplate.bind({});
Controlled.storyName = 'Controlled';
