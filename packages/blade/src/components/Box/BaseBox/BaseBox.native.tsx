import { View } from 'react-native';
import type { DefaultTheme } from 'styled-components/native';
import styled from 'styled-components/native';
import React from 'react';
import type { StyledComponent } from 'styled-components';
import { getBaseBoxStyles, getElevationValue } from './baseBoxStyles';
import type { BaseBoxProps } from './types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useTheme } from '~components/BladeProvider';
import type { ElevationStyles } from '~tokens/global/elevation';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

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

// @ts-expect-error we have to use `as StyledComponent<>` to type this otherwise `as` prop's types break
// Since we loose the generic nature of the component
const _BaseBox = (props, ref): React.ReactElement => {
  const { theme } = useTheme();
  const shadow = (getElevationValue(props.elevation, theme) as unknown) as ElevationStyles;
  return (
    <StyledBaseBox ref={ref} {...props} style={shadow ? [shadow, props.style] : props.style} />
  );
};

const BaseBox = assignWithoutSideEffects(React.forwardRef(_BaseBox), {
  displayName: 'BaseBox',
}) as StyledComponent<typeof View, DefaultTheme, BaseBoxProps>;

export { BaseBox };
