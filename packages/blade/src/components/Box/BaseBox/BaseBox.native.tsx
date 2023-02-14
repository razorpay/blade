import { View } from 'react-native';
import styled from 'styled-components/native';
import { getBaseBoxStyles } from './getBaseBoxStyles';
import type { BaseBoxProps } from './types';

/**
 * Some prop go to React Native DOM and fail with type errors.
 *
 * We're sending these props to styled components, we just don't put them on DOM
 */
const doesReactNativeSupportValue = (prop: string): boolean => {
  return !prop.startsWith('padding') && !prop.startsWith('margin');
};

const BaseBox = styled(View)
  .withConfig({
    shouldForwardProp: (prop, defaultValidator) =>
      doesReactNativeSupportValue(prop) && defaultValidator(prop),
  })
  .attrs((props: BaseBoxProps) => ({
    flex: props.flex ? Number(props.flex) : undefined, // flex only takes number in react native
  }))<BaseBoxProps>((props) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cssObject = getBaseBoxStyles(props);
  return cssObject;
});

export { BaseBox };
