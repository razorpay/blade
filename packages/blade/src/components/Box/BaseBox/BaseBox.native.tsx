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

const StyledBaseBox = styled(View)
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

const BaseBox = React.forwardRef<View, BaseBoxProps>(
  (props, ref): React.ReactElement => {
    const { theme } = useTheme();
    const shadow = (getElevationValue(props.elevation, theme) as unknown) as ElevationStyles;

    // @ts-expect-error TODO fix: weird styled component error
    return <StyledBaseBox ref={ref} style={shadow} {...props} />;
  },
);

export { BaseBox };
