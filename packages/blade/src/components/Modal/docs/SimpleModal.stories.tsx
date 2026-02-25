import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import isChromatic from 'chromatic/isChromatic';
import { Modal, ModalFooter, ModalHeader, ModalBody } from '../Modal';
import type { ModalProps } from '../index';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Button } from '~components/Button';
import { Radio, RadioGroup } from '~components/Radio';
import { Skeleton } from '~components/Skeleton';
import { DownloadIcon } from '~components/Icons';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Alert } from '~components/Alert';
import { Carousel, CarouselItem } from '~components/Carousel';
import { Preview, PreviewBody } from '~components/Preview';
import { Card, CardBody } from '~components/Card';

export default {
  title: 'Components/Modal/SimpleModal',
  component: Modal,
  args: {
    size: 'medium',
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="This is a Modal component. This story is used for snapshot testing of Modal component."
          componentName="Modal"
        />
      ),
    },
  },
} as Meta<ModalProps>;

const ModalTemplate: StoryFn<typeof Modal> = ({ size }) => {
  // `!!isChramatic` is not readable hence disabling the eslint rule
  // eslint-disable-next-line no-unneeded-ternary
  const [isOpen, setIsOpen] = React.useState(isChromatic() ? true : false);

  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false);
        }}
        size={size}
      >
        <ModalHeader
          title="Address Details"
          subtitle="This example is created for Modal snapshot testing"
        />
        <ModalBody>
          <RadioGroup label="Addresses">
            <Radio value="home">Home - 11850 Florida 24, Cedar Key, Florida</Radio>
            <Radio value="office-1">Office - 2033 Florida 21, Cedar Key, Florida</Radio>
            <Radio value="office-2">Work - 5938 New York, Main Street</Radio>
          </RadioGroup>
        </ModalBody>
        <ModalFooter>
          <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
            <Button variant="secondary">Remove address</Button>
            <Button>Add address</Button>
          </Box>
        </ModalFooter>
      </Modal>
    </>
  );
};

export const SimpleModal = ModalTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
SimpleModal.storyName = 'Simple Modal';

const NonDismissibleModalTemplate: StoryFn<typeof Modal> = ({ size }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClose = (): void => {
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)}>Open Non-Dismissible Modal</Button>
      <Modal isOpen={isOpen} isDismissible={false} size={size}>
        <ModalHeader
          title="Important Action Required"
          subtitle="This modal requires explicit confirmation"
        />
        <ModalBody>
          <Alert
            title="Notice"
            description="This modal cannot be dismissed by clicking outside or pressing escape key."
            color="notice"
            isDismissible={false}
            isFullWidth
          />
          <Text marginTop="spacing.4" color="surface.text.gray.subtle">
            Try clicking outside the modal or pressing the escape key - it won't close. You must
            click one of the buttons below to proceed.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
            <Button variant="secondary" onClick={() => handleClose()}>
              Cancel
            </Button>
            <Button onClick={() => handleClose()} variant="primary">
              Confirm Action
            </Button>
          </Box>
        </ModalFooter>
      </Modal>
    </>
  );
};

export const NonDismissibleModal = NonDismissibleModalTemplate.bind({});
NonDismissibleModal.storyName = 'Non-Dismissible Modal';

const FullPageModalTemplate: StoryFn<typeof Modal> = ({ size }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isImageLoading, setIsImageLoading] = React.useState(true);

  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)}>Open Modal</Button>
      <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size={size}>
        <ModalHeader
          title="Full Page Modal"
          subtitle="This example is created for Full Page Modal"
        />
        <ModalBody height="100%" padding="spacing.0">
          <Box position="relative" width="100%" height="100%">
            {isImageLoading && (
              <Box
                position="absolute"
                top="0px"
                left="0px"
                width="100%"
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                backgroundColor="surface.background.gray.intense"
              >
                <Skeleton height="100%" width="100%" />
              </Box>
            )}
            <img
              width="100%"
              height="100%"
              src="https://picsum.photos/1920/1080"
              alt="randm"
              onLoad={() => setIsImageLoading(false)}
              style={{ display: isImageLoading ? 'none' : 'block' }}
            />
          </Box>
        </ModalBody>
        <ModalFooter>
          <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
            <Button variant="primary" icon={DownloadIcon} isDisabled={isImageLoading}>
              Download
            </Button>
          </Box>
        </ModalFooter>
      </Modal>
    </>
  );
};

export const FullPageModal = FullPageModalTemplate.bind({});
FullPageModal.args = {
  size: 'full',
};
FullPageModal.storyName = 'Full Page Modal';

const lightboxImages = [
  { id: 1, src: 'https://picsum.photos/seed/blade1/800/500', alt: 'Photo 1' },
  { id: 2, src: 'https://picsum.photos/seed/blade2/800/500', alt: 'Photo 2' },
  { id: 3, src: 'https://picsum.photos/seed/blade3/800/500', alt: 'Photo 3' },
  { id: 4, src: 'https://picsum.photos/seed/blade4/800/500', alt: 'Photo 4' },
  { id: 5, src: 'https://picsum.photos/seed/blade5/800/500', alt: 'Photo 5' },
  { id: 6, src: 'https://picsum.photos/seed/blade6/800/500', alt: 'Photo 6' },
];

const LightboxModalTemplate: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeSlide, setActiveSlide] = React.useState(0);

  const openLightbox = (index: number): void => {
    setActiveSlide(index);
    setIsOpen(true);
  };

  return (
    <Box>
      <Box display="flex" gap="spacing.4" flexWrap="wrap">
        {lightboxImages.map((image, index) => (
          <button
            key={image.id}
            onClick={() => openLightbox(index)}
            style={{ cursor: 'pointer', border: 'none', padding: 0, background: 'none' }}
          >
            <img
              src={image.src}
              alt={image.alt}
              style={{
                width: '150px',
                height: '100px',
                objectFit: 'cover',
                borderRadius: '4px',
                display: 'block',
              }}
            />
          </button>
        ))}
      </Box>

      <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="full" variant="transparent">
        <ModalHeader />
        <ModalBody padding="spacing.6">
          <div onClick={() => setIsOpen(false)}>
            <Box padding="spacing.11" display="flex" flexDirection="column">
              <Box marginX="spacing.9">
                <Carousel
                  activeSlide={activeSlide}
                  onChange={setActiveSlide}
                  navigationButtonPosition="side-overlap"
                  showIndicators={false}
                  visibleItems={1}
                >
                  {lightboxImages.map((image) => (
                    <CarouselItem key={image.id}>
                      <Preview isDragAndZoomDisabled={true} key={image.id}>
                        <PreviewBody>
                          <div onClick={(e) => e.stopPropagation()}>
                            <img
                              src={image.src}
                              alt={image.alt}
                              style={{
                                width: '100%',
                                height: '400px',
                                objectFit: 'cover',
                                display: 'block',
                              }}
                            />
                          </div>
                        </PreviewBody>
                      </Preview>
                    </CarouselItem>
                  ))}
                </Carousel>
              </Box>

              <Box display="flex" alignItems="center" justifyContent="center">
                <Box
                  marginTop="spacing.4"
                  display="flex"
                  flexDirection="row"
                  gap="spacing.4"
                  paddingX="spacing.4"
                  paddingY="spacing.3"
                  overflowX="auto"
                >
                  {lightboxImages.map((image, index) => (
                    <Card
                      key={image.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSlide(index);
                      }}
                      isSelected={activeSlide === index}
                      padding="spacing.0"
                      width="auto"
                    >
                      <CardBody>
                        <Box overflow="hidden" borderRadius="medium">
                          <img
                            src={image.src}
                            alt={image.alt}
                            style={{
                              width: '72px',
                              height: '48px',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                        </Box>
                      </CardBody>
                    </Card>
                  ))}
                </Box>
              </Box>
            </Box>
          </div>
        </ModalBody>
      </Modal>
    </Box>
  );
};

export const LightboxModal = LightboxModalTemplate.bind({});
LightboxModal.storyName = 'Lightbox Modal';
