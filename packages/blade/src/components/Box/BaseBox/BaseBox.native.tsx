import { View } from 'react-native';
import styled from 'styled-components/native';
import { getBaseBoxStyles } from './baseBoxStyles';
import type { BaseBoxProps } from './types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

/**
 * Some prop go to React Native DOM and fail with type errors.
 *
 * We're sending these props to styled components, we just don't put them on DOM
 */
const isSupportedOnReactNativeElement = (prop: string): boolean => {
  return !prop.startsWith('padding') && !prop.startsWith('margin') && prop !== 'flex';
};

const BaseBox = styled(View)
  .attrs<BaseBoxProps>((props) => {
    return {
      ...metaAttribute({
        name: (props as never)['data-blade-component'] || MetaConstants.BaseBox,
      }),
    };
  })
  .withConfig({
    shouldForwardProp: (prop, defaultValidator) =>
      isSupportedOnReactNativeElement(prop) && defaultValidator(prop),
  })<BaseBoxProps>((props) => {
  const cssObject = getBaseBoxStyles(props);
  return cssObject;
});

export { BaseBox };
