import React from 'react';
import styled from 'styled-components';
import type { ResolvedThumbnailItem, ThumbnailPreviewProps } from './types';
import { chatMessageToken } from './token';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { makeSize } from '~utils';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';

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

const StyledPreviewImage = styled.img({
  width: '100%',
  height: '100%',
  aspectRatio: '1 / 1',
  objectFit: 'cover',
  display: 'block',
});

const ThumbnailPreview = ({
  thumbnails,
  onThumbnailClick,
}: ThumbnailPreviewProps): React.ReactElement | null => {
  const resolvedThumbnails: ResolvedThumbnailItem[] = thumbnails.map(resolveThumbnailItem);

  const previewThumbnails = resolvedThumbnails.slice(0, imagePreviewToken.maxVisibleStackImages);
  const isSingleThumbnail = previewThumbnails.length === 1;
  const overflowCount = Math.max(
    resolvedThumbnails.length - imagePreviewToken.maxVisibleStackImages,
    0,
  );
  // Absolutely positioned cards don't affect parent height,
  // so compute a deterministic min height from card offsets.
  // For a single card, use the image size directly.
  // For stacked cards, calculate based on bottom offsets plus image size and stack offset.
  const stackHeight = isSingleThumbnail
    ? imagePreviewToken.previewImageSizePx
    : Math.max(
        ...previewThumbnails.map(
          (_, stackIndex) =>
            getCardStyle(stackIndex, isSingleThumbnail).bottom +
            imagePreviewToken.previewImageSizePx,
        ),
        0,
      ) + imagePreviewToken.stackHeightOffset;

  return (
    <BaseBox {...metaAttribute({ name: MetaConstants.ChatMessageThumbnailPreview })}>
      <BaseBox
        as={onThumbnailClick ? 'button' : 'div'}
        type={onThumbnailClick ? 'button' : undefined}
        onClick={onThumbnailClick}
        cursor={onThumbnailClick ? 'pointer' : 'default'}
        position="relative"
        width={isSingleThumbnail ? imagePreviewToken.previewImageSize : '188px'}
        height={makeSize(stackHeight)}
        border="none"
        padding="spacing.0"
        margin="spacing.0"
        backgroundColor="transparent"
      >
        {
          // Render back cards first and front card last (top-most in DOM paint order).
          // `reverse()` mutates, so clone first to preserve `previewThumbnails`.
          // Data mapping example for `previewThumbnails = [A, B, C]`:
          // - A = thumbnails[0], B = thumbnails[1], C = thumbnails[2]
          // - Render loop iterates `[C, B, A]`
          // - Computed stackIndex becomes 2, 1, 0 respectively
          //   => C uses style slot 2, B uses style slot 1, A uses style slot 0
          // This preserves stack positioning by original order while controlling paint order.
          [...previewThumbnails].reverse().map(({ id, url, alt }, reverseIndex) => {
            const stackIndex = previewThumbnails.length - reverseIndex - 1;
            const cardStyle = getCardStyle(stackIndex, isSingleThumbnail);

            return (
              <BaseBox
                key={`${id}-${stackIndex}`}
                position="absolute"
                width={imagePreviewToken.previewImageSize}
                height={imagePreviewToken.previewImageSize}
                borderRadius="small"
                overflow="hidden"
                padding="spacing.0"
                bottom={makeSize(cardStyle.bottom)}
                right={makeSize(cardStyle.right)}
                transform={cardStyle.transform}
                zIndex={cardStyle.zIndex}
                elevation="midRaised"
                border="thin"
                borderColor="interactive.border.staticWhite.default"
                backgroundColor="surface.background.gray.moderate"
              >
                <StyledPreviewImage src={url} alt={alt} />
              </BaseBox>
            );
          })
        }

        {overflowCount > 0 ? (
          <BaseBox
            position="absolute"
            right={makeSize(10)}
            bottom={makeSize(0)}
            width={makeSize(40)}
            height={makeSize(40)}
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
