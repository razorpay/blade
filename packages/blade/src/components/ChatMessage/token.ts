import { size, colors as globalColors } from '~tokens/global';

type CardStyle = {
  bottom: number;
  right: number;
  transform: string;
  nativeTransform: { rotate: string }[];
  zIndex: number;
};

const chatMessageToken = {
  default: {},
  self: {
    padding: 'spacing.4',
    backgroundColor: {
      default: 'surface.background.gray.intense',
      error: 'feedback.background.negative.subtle',
    },
  },
  imagePreview: {
    maxVisibleStackImages: 3,
    previewImageSize: '120px',
    previewImageSizePx: size[120],
    stackHeightOffset: size[12],
    singleCardStyle: {
      bottom: size[0],
      right: size[0],
      transform: 'rotate(0deg)',
      nativeTransform: [{ rotate: '0deg' }],
      zIndex: 3,
    } as CardStyle,
    stackCardStyles: [
      {
        bottom: size[0],
        right: size[32],
        transform: 'rotate(0deg)',
        nativeTransform: [{ rotate: '0deg' }],
        zIndex: 3,
      },
      {
        bottom: size[59],
        right: size[10],
        transform: 'rotate(15deg)',
        nativeTransform: [{ rotate: '15deg' }],
        zIndex: 2,
      },
      {
        bottom: size[42],
        right: size[62],
        transform: 'rotate(-15deg)',
        nativeTransform: [{ rotate: '-15deg' }],
        zIndex: 1,
      },
    ] as CardStyle[],
  },
  messageBubble: {
    boxShadow: '0px 0.5px 4px 0px',
    boxShadowColor: {
      light: globalColors.neutral.blueGrayLight.a906,
      dark: globalColors.neutral.black[50],
    },
  },
} as const;

export { chatMessageToken };
