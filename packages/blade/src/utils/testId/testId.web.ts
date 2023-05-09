// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const testID = (defaultKey: string) => {
  if (!defaultKey) return {};
  return {
    'data-testid': defaultKey,
  };
};
