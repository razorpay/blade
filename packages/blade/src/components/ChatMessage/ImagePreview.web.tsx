import React from 'react';
import type { ThumbnailItem } from './types';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';

type ThumbnailPreviewProps = {
  thumbnails: ThumbnailItem[];
  onThumbnailClick?: ({ index, thumbnail }: { index: number; thumbnail: string }) => void;
};

const MAX_VISIBLE_STACK_IMAGES = 3;
const PREVIEW_IMAGE_SIZE = '120px';
const PREVIEW_IMAGE_SIZE_PX = 120;
const SPACING_OFFSET = 8;

type ResolvedThumbnailItem = {
  id: string;
  thumbnail: string;
  alt: string;
  originalIndex: number;
};

const ThumbnailPreview = ({
  thumbnails,
  onThumbnailClick,
}: ThumbnailPreviewProps): React.ReactElement => {
  if (!thumbnails || thumbnails.length === 0) {
    return <BaseBox />;
  }

  const resolvedThumbnails: ResolvedThumbnailItem[] = thumbnails.map((thumbnail, originalIndex) => {
    return {
      id: thumbnail.id,
      thumbnail: thumbnail.url,
      alt: thumbnail.alt,
      originalIndex,
    };
  });

  const previewThumbnails = resolvedThumbnails
    .slice(0, MAX_VISIBLE_STACK_IMAGES)
    .map((resolvedThumbnail) => resolvedThumbnail);
  const isSingleThumbnail = previewThumbnails.length === 1;
  const overflowCount = Math.max(resolvedThumbnails.length - MAX_VISIBLE_STACK_IMAGES, 0);

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
        bottom: 0,
        right: 32,
        transform: 'rotate(0deg)',
        zIndex: 3,
      };
    }

    if (stackIndex === 1) {
      return {
        bottom: 59,
        right: 10,
        transform: 'rotate(15deg)',
        zIndex: 2,
      };
    }

    return {
      bottom: 42,
      right: 62,
      transform: 'rotate(-15deg)',
      zIndex: 1,
    };
  };
  // Absolutely positioned cards don't affect parent height,
  // so compute a deterministic min height from card offsets.
  const stackHeight =
    Math.max(
      ...previewThumbnails.map(
        (_, stackIndex) => getCardStyle(stackIndex).bottom + PREVIEW_IMAGE_SIZE_PX,
      ),
      0,
    ) + SPACING_OFFSET;

  return (
    <BaseBox>
      <BaseBox
        position="relative"
        width={isSingleThumbnail ? PREVIEW_IMAGE_SIZE : '188px'}
        height={`${stackHeight}px`}
      >
        {[...previewThumbnails]
          .reverse()
          .map(({ id, thumbnail, alt, originalIndex }, reverseIndex) => {
            const stackIndex = previewThumbnails.length - reverseIndex - 1;
            const cardStyle = getCardStyle(stackIndex);

            return (
              <BaseBox
                key={`${id}-${stackIndex}`}
                position="absolute"
                as={onThumbnailClick ? 'button' : 'div'}
                onClick={
                  onThumbnailClick
                    ? () => onThumbnailClick({ index: originalIndex, thumbnail })
                    : undefined
                }
                width={PREVIEW_IMAGE_SIZE}
                height={PREVIEW_IMAGE_SIZE}
                borderRadius="small"
                overflow="hidden"
                style={{
                  bottom: `${cardStyle.bottom}px`,
                  right: `${cardStyle.right}px`,
                  transform: cardStyle.transform,
                  zIndex: cardStyle.zIndex,
                  cursor: onThumbnailClick ? 'pointer' : undefined,
                  padding: 0,
                  background: 'none',
                }}
                elevation="midRaised"
                border="thin"
                borderColor="interactive.border.staticWhite.default"
              >
                <img
                  src={thumbnail}
                  alt={alt}
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
            right="10px"
            bottom="0px"
            width="40px"
            height="40px"
            borderRadius="max"
            display="flex"
            alignItems="center"
            justifyContent="center"
            backgroundColor="surface.background.gray.moderate"
            elevation="lowRaised"
            border="thin"
            borderColor="surface.border.gray.muted"
            style={{ zIndex: 4 }}
          >
            <Text
              color="surface.text.gray.muted"
              size="medium"
              weight="medium"
              textAlign="center"
              marginRight="spacing.1"
            >
              +{overflowCount}
            </Text>
          </BaseBox>
        ) : null}
      </BaseBox>
    </BaseBox>
  );
};

export { ThumbnailPreview };
