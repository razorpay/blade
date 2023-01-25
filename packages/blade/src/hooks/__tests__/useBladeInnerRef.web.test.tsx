/* eslint-disable react/display-name */
import React from 'react';
import type { BladeElementRef } from '../useBladeInnerRef';
import { useBladeInnerRef } from '../useBladeInnerRef';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('useBladeInnerRef', () => {
  it('should only expose focus and scrollIntoView', () => {
    let refValue = null;
    const CustomButton = React.forwardRef<BladeElementRef>((_props, ref) => {
      const innerRef = useBladeInnerRef(ref);

      return <button ref={innerRef as React.RefObject<HTMLButtonElement>}>click</button>;
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
    expect(refValue).not.toHaveProperty('style');
    expect(refValue).toHaveProperty('focus');
    expect(refValue).toHaveProperty('scrollIntoView');
  });
});
