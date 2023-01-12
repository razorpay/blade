import React from 'react';
import type { TextInput as TextInputReactNative } from 'react-native';

type NativeHTMLInputRefProps = Pick<HTMLElement, 'focus' | 'scrollIntoView'>;

/**
 * A hook which only exposes the properties of html input element via imparative hook
 *
 * It avoids exposing other native properties of HTMLElement
 * like `style` `classList` to avoid unintended usage of refs.
 */
const useExposeInputRef = (
  targetRef: React.ForwardedRef<NativeHTMLInputRefProps>,
  inputRef: React.RefObject<TextInputReactNative | HTMLInputElement>,
) => {
  React.useImperativeHandle(
    targetRef,
    (): NativeHTMLInputRefProps => {
      const input = inputRef.current as HTMLInputElement & {
        selectedOptions: HTMLSelectElement['selectedOptions'];
      };
      return {
        focus: (opts) => input.focus(opts),
        scrollIntoView: (opts) => input.scrollIntoView(opts),
      };
    },
    [inputRef],
  );
};

export { useExposeInputRef, NativeHTMLInputRefProps };
