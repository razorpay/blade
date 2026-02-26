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
  },
} as const;

export { chatMessageToken };
