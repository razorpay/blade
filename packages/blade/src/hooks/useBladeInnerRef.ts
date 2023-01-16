import React from 'react';
import type { TextInput as TextInputReactNative } from 'react-native';

type BladeElementRef = Pick<HTMLElement, 'focus' | 'scrollIntoView'>;

/**
 * A hook which only exposes the properties of html input element via imparative hook
 *
 * It avoids exposing other native properties of HTMLElement
 * like `style` `classList` to avoid unintended usage of refs.
 */
const useBladeInnerRef = (
  targetRef: React.ForwardedRef<BladeElementRef>,
): React.RefObject<BladeElementRef> => {
  const textInputRef = React.useRef<HTMLInputElement | TextInputReactNative>(null);

  React.useImperativeHandle(
    targetRef,
    (): BladeElementRef => {
      const input = textInputRef.current as HTMLInputElement;
      return {
        focus: (opts) => input.focus(opts),
        scrollIntoView: (opts) => input.scrollIntoView(opts),
      };
    },
    [textInputRef],
  );

  return (textInputRef as unknown) as React.RefObject<BladeElementRef>;
};

export { useBladeInnerRef, BladeElementRef };
