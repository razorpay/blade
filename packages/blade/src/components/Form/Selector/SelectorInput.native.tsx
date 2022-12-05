/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-useless-fragment */

type HoverProps = {
  isChecked?: boolean;
  isDisabled?: boolean;
  hasError?: boolean;
};
// noop in react-native
const SelectorInput = (_props: HoverProps & { inputProps?: any }): React.ReactElement => {
  return <></>;
};

export { SelectorInput };
