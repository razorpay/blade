import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';

type ThumbnailPreviewProps = {
  thumbnails: string[];
  onThumbnailClick?: (args: { index: number; thumbnail: string }) => void;
};

const MAX_VISIBLE_STACK_IMAGES = 3;
const PREVIEW_IMAGE_SIZE = '120px';

const ThumbnailPreview = ({
  thumbnails,
  onThumbnailClick,
}: ThumbnailPreviewProps): React.ReactElement => {
  if (!thumbnails || thumbnails.length === 0) {
    return <BaseBox />;
  }

  const previewThumbnails = thumbnails
    .slice(0, MAX_VISIBLE_STACK_IMAGES)
    .map((thumbnail, index) => ({ thumbnail, index }));
  const overflowCount = Math.max(thumbnails.length - MAX_VISIBLE_STACK_IMAGES, 0);

  const getCardStyle = (
    stackIndex: number,
  ): {
    bottom: number;
    right: number;
    transform: string;
    zIndex: number;
  } => {
    if (stackIndex === 0) {
      return {
        bottom: 0,
        right: 14,
        transform: 'rotate(0deg)',
        zIndex: 3,
      };
    }

    if (stackIndex === 1) {
      return {
        bottom: 51,
        right: 0,
        transform: 'rotate(8deg)',
        zIndex: 2,
      };
    }

    return {
      bottom: 40,
      right: 32,
      transform: 'rotate(-8deg)',
      zIndex: 1,
    };
  };

  return (
    <BaseBox padding="spacing.3">
      <BaseBox position="relative" width="188px" height="160px">
        {[...previewThumbnails].reverse().map(({ thumbnail, index }, reverseIndex) => {
          const stackIndex = previewThumbnails.length - reverseIndex - 1;
          const cardStyle = getCardStyle(stackIndex);

          return (
            <BaseBox
              key={`${thumbnail}-${stackIndex}`}
              position="absolute"
              as={onThumbnailClick ? 'button' : 'div'}
              onClick={onThumbnailClick ? () => onThumbnailClick({ index, thumbnail }) : undefined}
              width={PREVIEW_IMAGE_SIZE}
              height={PREVIEW_IMAGE_SIZE}
              borderRadius="large"
              overflow="hidden"
              style={{
                bottom: `${cardStyle.bottom}px`,
                right: `${cardStyle.right}px`,
                transform: cardStyle.transform,
                zIndex: cardStyle.zIndex,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                cursor: onThumbnailClick ? 'pointer' : undefined,
                border: 'none',
                padding: 0,
                background: 'none',
              }}
              elevation="lowRaised"
            >
              <img
                src={thumbnail}
                alt={`Chat thumbnail preview ${stackIndex + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  aspectRatio: '1 / 1',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </BaseBox>
          );
        })}

        {overflowCount > 0 ? (
          <BaseBox
            position="absolute"
            right="-8px"
            bottom="0px"
            width="40px"
            height="40px"
            borderRadius="max"
            display="flex"
            alignItems="center"
            justifyContent="center"
            backgroundColor="surface.background.gray.moderate"
            elevation="midRaised"
            borderColor="surface.border.gray.muted"
            style={{ zIndex: 4, borderWidth: '3px' }}
          >
            <Text color="surface.text.gray.muted" size="large" weight="semibold" textAlign="center">
              +{overflowCount}
            </Text>
          </BaseBox>
        ) : null}
      </BaseBox>
    </BaseBox>
  );
};

export { ThumbnailPreview };
