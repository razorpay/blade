const typography = {
  onDesktop: {
    fonts: {
      size: {
        large: 200,
        medium: 100,
        small: 75,
        xsmall: 75,
      },
    },
    lineHeight: {
      large: 's',
      medium: 'l',
      small: 'l',
      xsmall: 'l',
    },
  },
  onMobile: {
    fonts: {
      size: {
        large: 200,
        medium: 100,
        small: 50,
        xsmall: 50,
      },
    },
    lineHeight: {
      large: 'm', // this is 24px but we need 20px
      medium: 'm', // this is 24px but we need 20px
      small: 's',
      xsmall: 's',
    },
  },
} as const;

export { typography };
