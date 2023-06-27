/* eslint-disable react/display-name */
import React from 'react';
import { View } from 'react-native';
import type { BladeElementRef } from '../useBladeInnerRef.web';
import { useBladeInnerRef } from '../useBladeInnerRef.web';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('useBladeInnerRef', () => {
  it('should only expose focus and scrollIntoView', () => {
    let refValue = null;
    const CustomButton = React.forwardRef<BladeElementRef>((_props, ref) => {
      const innerRef = useBladeInnerRef(ref);

      return <View ref={innerRef as React.RefObject<View>}>click</View>;
    });
    const Example = (): React.ReactElement => {
      return (
        <CustomButton
          ref={(value) => {
            refValue = value;
          }}
        />
      );
    };

    renderWithTheme(<Example />);
    expect(refValue).toHaveProperty('focus');
    expect(refValue).not.toHaveProperty('style');
    expect(refValue).not.toHaveProperty('scrollIntoView');
  });
});
