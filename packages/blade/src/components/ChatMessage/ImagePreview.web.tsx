import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';

type ThumbnailPreviewProps = {
  thumbnails: string[];
  onThumbnailClick?: (args: { index: number; thumbnail: string }) => void;
};

const MAX_VISIBLE_STACK_IMAGES = 3;
const PREVIEW_IMAGE_SIZE = '120px';
const PREVIEW_IMAGE_SIZE_PX = 120;

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
  const isSingleThumbnail = previewThumbnails.length === 1;
  const overflowCount = Math.max(thumbnails.length - MAX_VISIBLE_STACK_IMAGES, 0);

  const getCardStyle = (
    stackIndex: number,
  ): {
    bottom: number;
    right: number;
    transform: string;
    zIndex: number;
  } => {
    if (isSingleThumbnail) {
      return {
        bottom: 0,
        right: 0,
        transform: 'rotate(0deg)',
        zIndex: 3,
      };
    }

    if (stackIndex === 0) {
      return {
        bottom: 2,
        right: 25,
        transform: 'rotate(0deg)',
        zIndex: 3,
      };
    }

    if (stackIndex === 1) {
      return {
        bottom: 61,
        right: 3,
        transform: 'rotate(15deg)',
        zIndex: 2,
      };
    }

    return {
      bottom: 44,
      right: 54,
      transform: 'rotate(-15deg)',
      zIndex: 1,
    };
  };

  // Absolutely positioned cards don't affect parent height,
  // so compute a deterministic min height from card offsets.
  const stackHeight = Math.max(
    ...previewThumbnails.map(
      (_, stackIndex) => getCardStyle(stackIndex).bottom + PREVIEW_IMAGE_SIZE_PX,
    ),
    0,
  );

  return (
    <BaseBox>
      <BaseBox
        position="relative"
        width={isSingleThumbnail ? PREVIEW_IMAGE_SIZE : '188px'}
        height={`${stackHeight}px`}
      >
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
