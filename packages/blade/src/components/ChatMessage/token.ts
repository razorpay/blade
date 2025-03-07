const chatMessageToken = {
  default: {},
  self: {
    padding: 'spacing.4',
    borderTopLeftRadius: 'large',
    borderTopRightRadius: 'large',
    borderBottomLeftRadius: 'large',
    borderBottomRightRadiusForLastMessage: 'none',
    borderBottomRightRadius: 'large',
    backgroundColor: {
      default: 'surface.background.primary.subtle',
      error: 'feedback.background.negative.subtle',
    },
  },
} as const;

export { chatMessageToken };
