import React from 'react';
import type { ResolvedThumbnailItem, ThumbnailPreviewProps } from './types';
import { chatMessageToken } from './token';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';

const imagePreviewToken = chatMessageToken.imagePreview;

type CardStyle = {
  bottom: number;
  right: number;
  transform: string;
  zIndex: number;
};

const resolveThumbnailItem = (
  thumbnail: ResolvedThumbnailItem['originalThumbnail'],
  originalIndex: number,
): ResolvedThumbnailItem => {
  return {
    id: thumbnail.id ?? `thumbnail-${originalIndex}-${thumbnail.url}`,
    url: thumbnail.url,
    alt: thumbnail.alt ?? '',
    originalIndex,
    originalThumbnail: thumbnail,
  };
};

const getCardStyle = (stackIndex: number, isSingleThumbnail: boolean): CardStyle => {
  if (isSingleThumbnail) {
    return imagePreviewToken.singleCardStyle;
  }

  return (
    imagePreviewToken.stackCardStyles[stackIndex] ??
    imagePreviewToken.stackCardStyles[imagePreviewToken.stackCardStyles.length - 1]
  );
};

const ThumbnailPreview = ({
  thumbnails,
  onThumbnailClick,
}: ThumbnailPreviewProps): React.ReactElement => {
  if (!thumbnails || thumbnails.length === 0) {
    return <BaseBox />;
  }

  const resolvedThumbnails: ResolvedThumbnailItem[] = thumbnails.map(resolveThumbnailItem);

  const previewThumbnails = resolvedThumbnails.slice(0, imagePreviewToken.maxVisibleStackImages);
  const isSingleThumbnail = previewThumbnails.length === 1;
  const overflowCount = Math.max(
    resolvedThumbnails.length - imagePreviewToken.maxVisibleStackImages,
    0,
  );
  // Absolutely positioned cards don't affect parent height,
  // so compute a deterministic min height from card offsets.
  const stackHeight =
    Math.max(
      ...previewThumbnails.map(
        (_, stackIndex) =>
          getCardStyle(stackIndex, isSingleThumbnail).bottom + imagePreviewToken.previewImageSizePx,
      ),
      0,
    ) + imagePreviewToken.stackHeightOffset;

  return (
    <BaseBox>
      <BaseBox
        position="relative"
        width={isSingleThumbnail ? imagePreviewToken.previewImageSize : '188px'}
        height={`${stackHeight}px`}
      >
        {[...previewThumbnails]
          .reverse()
          .map(({ id, url, alt, originalIndex, originalThumbnail }, reverseIndex) => {
            const stackIndex = previewThumbnails.length - reverseIndex - 1;
            const cardStyle = getCardStyle(stackIndex, isSingleThumbnail);

            return (
              <BaseBox
                key={`${id}-${stackIndex}`}
                position="absolute"
                as={onThumbnailClick ? 'button' : 'div'}
                onClick={
                  onThumbnailClick
                    ? () => onThumbnailClick({ index: originalIndex, thumbnail: originalThumbnail })
                    : undefined
                }
                width={imagePreviewToken.previewImageSize}
                height={imagePreviewToken.previewImageSize}
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
                  src={url}
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
