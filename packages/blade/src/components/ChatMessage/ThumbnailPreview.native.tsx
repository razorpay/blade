import React from 'react';
import { Image, Pressable } from 'react-native';
import type { ResolvedThumbnailItem, ThumbnailPreviewProps } from './types';
import { chatMessageToken } from './token';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { makeSize } from '~utils';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';

const imagePreviewToken = chatMessageToken.imagePreview;

const resolveThumbnailItem = (
  thumbnail: ResolvedThumbnailItem['originalThumbnail'],
  originalIndex: number,
): ResolvedThumbnailItem => ({
  id: thumbnail.id ?? `thumbnail-${originalIndex}-${thumbnail.url}`,
  url: thumbnail.url,
  alt: thumbnail.alt ?? '',
  originalIndex,
  originalThumbnail: thumbnail,
});

const getCardStyle = (
  stackIndex: number,
  isSingleThumbnail: boolean,
): typeof imagePreviewToken['singleCardStyle'] => {
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
}: ThumbnailPreviewProps): React.ReactElement | null => {
  const resolvedThumbnails: ResolvedThumbnailItem[] = thumbnails.map(resolveThumbnailItem);

  const previewThumbnails = resolvedThumbnails.slice(0, imagePreviewToken.maxVisibleStackImages);
  const isSingleThumbnail = previewThumbnails.length === 1;
  const overflowCount = Math.max(
    resolvedThumbnails.length - imagePreviewToken.maxVisibleStackImages,
    0,
  );

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

  const containerWidth = isSingleThumbnail ? imagePreviewToken.previewImageSizePx : 188;

  const content = (
    <BaseBox
      {...metaAttribute({ name: MetaConstants.ChatMessageThumbnailPreview })}
      position="relative"
      width={makeSize(containerWidth)}
      height={makeSize(stackHeight)}
    >
      {[...previewThumbnails].reverse().map(({ id, url, alt }, reverseIndex) => {
        const stackIndex = previewThumbnails.length - reverseIndex - 1;
        const cardStyle = getCardStyle(stackIndex, isSingleThumbnail);

        return (
          <BaseBox
            key={`${id}-${stackIndex}`}
            position="absolute"
            width={makeSize(imagePreviewToken.previewImageSizePx)}
            height={makeSize(imagePreviewToken.previewImageSizePx)}
            borderRadius="small"
            overflow="hidden"
            padding="spacing.0"
            bottom={makeSize(cardStyle.bottom)}
            right={makeSize(cardStyle.right)}
            zIndex={cardStyle.zIndex}
            elevation="midRaised"
            borderWidth="thin"
            borderColor="interactive.border.staticWhite.default"
            backgroundColor="surface.background.gray.moderate"
            style={{ transform: cardStyle.nativeTransform }}
          >
            <Image
              source={{ uri: url }}
              style={{
                width: imagePreviewToken.previewImageSizePx,
                height: imagePreviewToken.previewImageSizePx,
              }}
              resizeMode="cover"
              accessibilityLabel={alt}
            />
          </BaseBox>
        );
      })}

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
          borderWidth="thin"
          borderColor="surface.border.gray.muted"
          zIndex={4}
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
  );

  if (onThumbnailClick) {
    return <Pressable onPress={onThumbnailClick}>{content}</Pressable>;
  }

  return content;
};

export { ThumbnailPreview };
