/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import type { TextInput as TextInputReactNative, View } from 'react-native';
import type { Platform } from '~utils';
import { isReactNative, getPlatformType } from '~utils';

type BladeElementRef = Platform.Select<{
  web: Pick<HTMLElement, 'focus' | 'scrollIntoView'> | Pick<View, 'focus'>;
  native: React.MutableRefObject<any>;
}>;

/**
 * A hook which only exposes the properties of html input element via imparative hook
 *
 * It avoids exposing other native properties of HTMLElement
 * like `style` `classList` to avoid unintended usage of refs.
 */
const useBladeInnerRef = (
  targetRef: React.ForwardedRef<BladeElementRef>,
  handlers?: {
    // In some scenarios, your native HTML element might have a different ref compared to visible element.
    // In those cases, you can call your visible element's focus
    onFocus?: (opts?: FocusOptions) => void;
  },
): React.RefObject<HTMLInputElement | TextInputReactNative> => {
  const innerRef = React.useRef<HTMLInputElement | TextInputReactNative>(null);

  React.useImperativeHandle(
    targetRef,
    (): BladeElementRef => {
      const element = innerRef.current;
      // @ts-expect-error in react-native we expose the ref so that we can do findNodeHandle()
      if (isReactNative()) return innerRef.current;
      if (element instanceof HTMLElement) {
        if (getPlatformType() !== 'react-native' && element instanceof HTMLElement) {
          return {
            focus: (opts) => (handlers?.onFocus ? handlers.onFocus(opts) : element.focus(opts)),
            scrollIntoView: (opts) => element.scrollIntoView(opts),
          };
        } else {
          return {
            focus: () => element?.focus(),
          };
        }
      }
      return { focus: () => {}, scrollIntoView: () => {} };
    },
    [innerRef, handlers],
  );

  return innerRef;
};

export { useBladeInnerRef, BladeElementRef };
