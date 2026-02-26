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
    previewImageSizePx: 120,
    stackHeightOffset: 12,
    singleCardStyle: {
      bottom: 0,
      right: 0,
      transform: 'rotate(0deg)',
      zIndex: 3,
    },
    stackCardStyles: [
      {
        bottom: 0,
        right: 32,
        transform: 'rotate(0deg)',
        zIndex: 3,
      },
      {
        bottom: 59,
        right: 10,
        transform: 'rotate(15deg)',
        zIndex: 2,
      },
      {
        bottom: 42,
        right: 62,
        transform: 'rotate(-15deg)',
        zIndex: 1,
      },
    ],
  },
} as const;

export { chatMessageToken };
