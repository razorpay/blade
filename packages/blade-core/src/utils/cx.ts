export const cx = (...classes: Array<string | false | undefined>): string =>
  classes.filter(Boolean).join(' ');
