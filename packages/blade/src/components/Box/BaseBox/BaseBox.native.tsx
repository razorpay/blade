import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import styled from 'styled-components/native';
import React from 'react';
import { getBaseBoxStyles, getElevationValue } from './baseBoxStyles';
import type { BaseBoxProps } from './types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useTheme } from '~components/BladeProvider';
import type { ElevationStyles } from '~tokens/global/elevation';

/**
 * Some prop go to React Native DOM and fail with type errors.
 *
 * We're sending these props to styled components, we just don't put them on DOM
 */
const isSupportedOnReactNativeElement = (prop: string): boolean => {
  return !prop.startsWith('padding') && !prop.startsWith('margin') && prop !== 'flex';
};

/*
  An intermidiate wrapper in Box to apply elevation styles to BaseBox.
  Because just passing elevation to styled-component as is doesn't work
  We need to pass elevation as a prop to style `style={...elevation}`
*/
const BaseBoxWithShadow = React.forwardRef<
  View,
  Pick<BaseBoxProps, 'elevation'> & { style: StyleProp<ViewStyle> }
>((props, ref) => {
  const { theme } = useTheme();
  const shadow = (getElevationValue(props.elevation, theme) as unknown) as ElevationStyles;
  return (
    <View
      ref={ref}
      {...props}
      // if we don't have shadow don't merge
      style={shadow ? [props.style, shadow] : props.style}
    />
  );
});

const BaseBox = styled(BaseBoxWithShadow)
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
